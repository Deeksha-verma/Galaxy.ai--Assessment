import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

export const runLLMTask = task({
  id: "run-llm",
  retry: { maxAttempts: 2 },
  run: async (payload: {
    model: string;
    systemPrompt?: string;
    userMessage: string;
    imageUrls?: string[];
  }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: payload.model || "gemini-2.0-flash",
      systemInstruction: payload.systemPrompt,
    });

    const parts: Part[] = [{ text: payload.userMessage }];

    // Fetch and encode images for vision blocks
    for (const url of payload.imageUrls ?? []) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
        const buf = await res.arrayBuffer();
        const b64 = Buffer.from(buf).toString("base64");
        const mime = res.headers.get("content-type") ?? "image/jpeg";
        parts.push({ inlineData: { data: b64, mimeType: mime } });
      } catch (err) {
        console.warn(`Could not process image ${url}:`, err);
        // Continue without failing the entire prompt
      }
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    return { text: result.response.text() };
  },
});
