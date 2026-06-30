import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Lovable AI Gateway provider helper.
 *
 * Modular AI layer — to switch provider later (OpenAI direct, OpenRouter,
 * Anthropic, Gemini, etc.) only this file and src/lib/ai-config.ts need
 * to change. The chat route and any other server consumers import the
 * `getModel` helper below.
 */
export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
    },
  });
}
