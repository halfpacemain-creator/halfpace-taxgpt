import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { AI_CONFIG } from "@/lib/ai-config";
import { createGoogleProvider } from "@/lib/ai-gateway.server";
import { buildSystemPrompt } from "@/lib/system-prompt";

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: ChatRequestBody;
        try {
          body = (await request.json()) as ChatRequestBody;
        } catch {
          return new Response("Invalid JSON body", { status: 400 });
        }

        const messages = body.messages;
        if (!Array.isArray(messages)) {
          return new Response("messages array is required", { status: 400 });
        }

        const key = process.env.GEMINI_API_KEY;
        if (!key) {
          return new Response("Missing GEMINI_API_KEY", { status: 500 });
        }

        try {
          const gateway = createGoogleProvider(key);
          // Use the latest user message to (in future) retrieve relevant
          // legal chunks. Today buildSystemPrompt returns the full
          // structured knowledge base regardless of query.
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
              const e = err as { status?: number; message?: string };
              if (e?.status === 429) {
                return "You're sending requests too quickly. Please try again in a moment.";
              }
              if (e?.status === 402) {
                return "AI credits exhausted on this workspace. Please add credits in Settings → Plans & credits.";
              }
              return e?.message ?? "Something went wrong while generating a response.";
            },
          });
        } catch (err) {
          const e = err as { status?: number; message?: string };
          const status = e?.status ?? 500;
          return new Response(e?.message ?? "Internal error", { status });
        }
      },
    },
  },
});
