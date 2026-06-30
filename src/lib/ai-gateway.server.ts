import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Official Google Gemini provider.
 *
 * Reads GEMINI_API_KEY from server env. Swap providers by editing this file.
 */
export function createGoogleProvider(apiKey: string) {
  return createGoogleGenerativeAI({ apiKey });
}
