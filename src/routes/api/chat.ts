import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { AI_CONFIG } from "@/lib/ai-config";
import { createGoogleProvider } from "@/lib/ai-gateway.server";
import { classifyProviderError, sentinelFor } from "@/lib/error-messages";
import { buildSystemPrompt } from "@/lib/system-prompt";

type ChatRequestBody = { messages?: unknown };

function logServerError(context: string, err: unknown) {
  const e = err as { status?: number; message?: string; stack?: string; code?: string };
  // Full technical detail stays on the server for debugging. Never returned to the client.
  console.error(`[chat-api] ${context}`, {
    status: e?.status,
    code: e?.code,
    message: e?.message,
    stack: e?.stack,
  });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: ChatRequestBody;
        try {
          body = (await request.json()) as ChatRequestBody;
        } catch (err) {
          logServerError("invalid-json", err);
          return new Response(sentinelFor("generic"), { status: 400 });
        }

        const messages = body.messages;
        if (!Array.isArray(messages)) {
          return new Response(sentinelFor("generic"), { status: 400 });
        }

        const key = process.env.GEMINI_API_KEY;
        if (!key) {
          logServerError("missing-api-key", new Error("GEMINI_API_KEY not set"));
          return new Response(sentinelFor("generic"), { status: 500 });
        }

        try {
          const gateway = createGoogleProvider(key);
          const lastUser = [...(messages as UIMessage[])]
            .reverse()
            .find((m) => m.role === "user");
          const lastUserText =
            lastUser?.parts
              ?.filter((p) => p.type === "text")
              .map((p) => (p as { text: string }).text)
              .join(" ") ?? "";
          const result = streamText({
            model: gateway(AI_CONFIG.model),
            system: buildSystemPrompt(lastUserText),
            messages: await convertToModelMessages(messages as UIMessage[]),
            abortSignal: request.signal,
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
            onError: (err) => {
              logServerError("stream-error", err);
              return sentinelFor(classifyProviderError(err));
            },
          });
        } catch (err) {
          logServerError("handler-error", err);
          return new Response(sentinelFor(classifyProviderError(err)), {
            status: 500,
          });
        }
      },
    },
  },
});
