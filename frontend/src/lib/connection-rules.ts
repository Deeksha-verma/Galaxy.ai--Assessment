import type { Connection, Node } from "@xyflow/react";

// Output type each node produces
const OUTPUT_TYPE: Record<string, "text" | "image" | "video"> = {
  text: "text",
  "upload-image": "image",
  "upload-video": "video",
  llm: "text",
  "crop-image": "image",
  "extract-frame": "image",
};

// Which handle IDs on a target node accept which output types
const HANDLE_ACCEPTS: Record<string, Array<"text" | "image" | "video">> = {
  system_prompt: ["text"],
  user_message: ["text"],
  timestamp: ["text"],
  x_percent: ["text"],
  y_percent: ["text"],
  width_percent: ["text"],
  height_percent: ["text"],
  image_url: ["image"],
  images: ["image"],
  video_url: ["video"],
};

export function isValidConnection(
  connection: Connection,
  nodes: Node[]
): boolean {
  // Prevent self-loops
  if (connection.source === connection.target) return false;
  const source = nodes.find((n) => n.id === connection.source);
  if (!source) return false;
  const outType = OUTPUT_TYPE[source.type as string];
  if (!outType) return false;
  const accepted = HANDLE_ACCEPTS[connection.targetHandle as string] ?? [];
  return accepted.includes(outType);
}
