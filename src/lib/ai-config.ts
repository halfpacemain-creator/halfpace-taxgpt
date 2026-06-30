/**
 * Central AI configuration.
 *
 * Change the model id here to switch which model HalfPace TaxGPT uses.
 * Any model id supported by the Lovable AI Gateway is valid. To switch
 * providers entirely, also update src/lib/ai-gateway.server.ts.
 */
export const AI_CONFIG = {
  // Default chat model — Google Gemini 3 Flash Preview via Lovable AI Gateway.
  model: "google/gemini-3-flash-preview",
  // Max steps for any future tool-calling loop.
  maxSteps: 50,
} as const;
