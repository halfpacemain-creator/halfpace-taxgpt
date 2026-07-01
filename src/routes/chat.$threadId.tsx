import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { AppShell } from "@/components/app-shell";
import { ChatSkeleton } from "@/components/chat-skeleton";
import { ChatWindow } from "@/components/chat-window";
import { getThread } from "@/lib/threads";
import type { UIMessage } from "ai";

const searchSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/chat/$threadId")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Chat — HalfPace® TaxGPT" },
      {
        name: "description",
        content:
          "AI-powered chat about Indian taxation, GST, TDS, and business compliance.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { threadId } = Route.useParams();
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    const t = getThread(threadId);
    setInitial(t?.messages ?? []);
  }, [threadId]);

  const clearQ = () => {
    if (q) void navigate({ search: {}, replace: true, params: { threadId } });
  };

  return (
    <AppShell>
      {initial === null ? (
        <ChatSkeleton />
      ) : (
        <ChatWindow
          key={threadId}
          threadId={threadId}
          initialMessages={initial}
          autoSend={q}
          onAutoSent={clearQ}
        />
      )}
    </AppShell>
  );
}
