import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { Transloadit } from "transloadit";
import fs from "fs/promises";
import path from "path";
import os from "os";

// Reuse same Transloadit helper
async function uploadToTransloadit(filePath: string): Promise<string> {
  const tl = new Transloadit({
    authKey: process.env.TRANSLOADIT_AUTH_KEY!,
    authSecret: process.env.TRANSLOADIT_AUTH_SECRET!,
  });

  return tl.createAssembly({
    params: {
      steps: {
        export: { use: ":original", robot: "/file/filter", accepts: [["image", "*"] as any] }
      }
    },
    files: {
      file: filePath
    }
  }).then(result => {
    if (result.results?.export?.[0]?.ssl_url) {
      return result.results.export[0].ssl_url;
    } else if (result.uploads?.[0]?.ssl_url) {
      return result.uploads[0].ssl_url;
    } else {
      return result.assembly_ssl_url || "";
    }
  });
}

// Helper to determine exact timestamp based on percentage or string
async function getTimeStamp(videoPath: string, tsParam: string | number): Promise<string> {
  // If it's a simple number or string '12.5' etc, return it as seconds
  if (typeof tsParam === "number" || (!tsParam.toString().includes("%") && !isNaN(Number(tsParam)))) {
    return String(tsParam);
  }

  // If percentage (e.g., "50%"), we need to probe the video length
  const pctStr = tsParam.toString().replace("%", "").trim();
  const pct = Number(pctStr);
  if (isNaN(pct) || pct < 0 || pct > 100) return "0"; // default if invalid

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format.duration || 0;
      const targetSec = duration * (pct / 100);
      resolve(String(targetSec));
    });
  });
}

export const extractFrameTask = task({
  id: "extract-frame",
  retry: { maxAttempts: 2 },
  run: async (payload: { videoUrl: string; timestamp?: string | number }) => {
    const tmpIn  = path.join(os.tmpdir(), `vid-in-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`);
    const tmpOut = path.join(os.tmpdir(), `frame-out-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`);

    try {
      // 1. Download video
      const res = await fetch(payload.videoUrl);
      if (!res.ok) throw new Error(`Failed to download video: ${res.statusText}`);
      const buf = await res.arrayBuffer();
      await fs.writeFile(tmpIn, Buffer.from(buf));

      // 2. Determine exact timestamp
      const ts = await getTimeStamp(tmpIn, payload.timestamp ?? 0);

      // 3. Extract single frame
      await new Promise<void>((resolve, reject) => {
        ffmpeg(tmpIn)
          .setFfmpegPath(ffmpegStatic!)
          .seekInput(ts)
          .frames(1)
          .output(tmpOut)
          .on("end", () => resolve())
          .on("error", (err) => reject(new Error(`FFmpeg frame extraction failed: ${err.message}`)))
          .run();
      });

      // 4. Upload to Transloadit
      const resultUrl = await uploadToTransloadit(tmpOut);
      return { imageUrl: resultUrl };

    } finally {
      await fs.rm(tmpIn).catch(() => {});
      await fs.rm(tmpOut).catch(() => {});
    }
  },
});
