import { z } from "zod";
import dotenv from "dotenv";

// Load from .env if present
dotenv.config();

const EnvSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
  TRIGGER_SECRET_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  TRANSLOADIT_AUTH_KEY: z.string().min(1),
  TRANSLOADIT_AUTH_SECRET: z.string().min(1),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
});

// This will throw synchronously on boot if any required key is missing,
// which is exactly what we want to avoid silent failures later.
export const config = EnvSchema.parse(process.env);
