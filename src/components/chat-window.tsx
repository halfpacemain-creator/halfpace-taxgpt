import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Copy, RefreshCcw, Square, ArrowUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { BrandMark, Logo } from "@/components/logo";

import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { usePersistThread } from "@/lib/threads";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  threadId: string;
  initialMessages: UIMessage[];
  emptyStateSuggestions?: string[];
  autoSend?: string;
  onAutoSent?: () => void;
}

function getMessageText(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function detectRtl(text: string): boolean {
  // Arabic/Urdu/Hebrew range
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

export function ChatWindow({
  threadId,
  initialMessages,
  emptyStateSuggestions,
  autoSend,
  onAutoSent,
}: ChatWindowProps) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status, stop, regenerate, setMessages, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => toast.error(e.message || "Something went wrong"),
  });

  usePersistThread({ threadId, messages, status });

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto focus on mount / thread change / after send.
  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status === "ready"]);

  // Auto-send a query passed via search params (from the home page hand-off).
  const autoSentRef = useRef<string | null>(null);
  useEffect(() => {
    if (!autoSend) return;
    if (autoSentRef.current === autoSend) return;
    if (initialMessages.length > 0) return;
    autoSentRef.current = autoSend;
    void sendMessage({ text: autoSend });
    onAutoSent?.();
  }, [autoSend, initialMessages.length, sendMessage, onAutoSent]);

  // Auto-scroll to bottom on new content.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const isLoading = status === "submitted" || status === "streaming";

  const submit = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || isLoading) return;
    void sendMessage({ text });
    setInput("");
    // refocus
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  const onRegenerate = () => {
    if (isLoading) return;
    void regenerate();
  };

  const onClear = () => {
    if (messages.length === 0) return;
    if (!confirm("Clear this conversation?")) return;
    setMessages([]);
  };

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <EmptyState onPick={(p) => submit(p)} suggestions={emptyStateSuggestions} />
          ) : (
            <ul className="space-y-6">
              {messages.map((m) => {
                const text = getMessageText(m);
                const isUser = m.role === "user";
                const rtl = detectRtl(text);
                return (
                  <li key={m.id} className="group">
                    {isUser ? (
                      <div className="flex justify-end">
                        <div
                          dir={rtl ? "rtl" : "ltr"}
                          className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-chat-user px-4 py-2.5 text-chat-user-foreground shadow-sm"
                        >
                          {text}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <BrandMark className="mt-0.5 h-8 w-8 shrink-0 ring-1 ring-black/5" />

                        <div className="min-w-0 flex-1" dir={rtl ? "rtl" : "ltr"}>
                          {text ? (
                            <Markdown>{text}</Markdown>
                          ) : (
                            <ThinkingIndicator />
                          )}
                          {m.id === lastAssistantId && !isLoading && (
                            <div className="mt-2 flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => onCopy(text)}
                                aria-label="Copy response"
                                title="Copy"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={onRegenerate}
                                aria-label="Regenerate response"
                                title="Regenerate"
                              >
                                <RefreshCcw className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
              {status === "submitted" && (
                <li className="flex items-start gap-3">
                  <BrandMark className="mt-0.5 h-8 w-8 shrink-0 ring-1 ring-black/5" />
                  <ThinkingIndicator />
                </li>

              )}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <Composer
            value={input}
            onChange={setInput}
            onSubmit={() => submit()}
            onStop={stop}
            isLoading={isLoading}
            textareaRef={textareaRef}
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span>
              HalfPace TaxGPT can make mistakes. Verify important details with a qualified professional.
            </span>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="rounded px-2 py-0.5 hover:bg-muted hover:text-foreground"
              >
                Clear conversation
              </button>
            )}
          </div>
          {error && (
            <div className="mt-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2 text-sm text-muted-foreground">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
    </div>
  );
}

function EmptyState({
  onPick,
  suggestions,
}: {
  onPick: (s: string) => void;
  suggestions?: string[];
}) {
  const list = suggestions ?? DEFAULT_SUGGESTIONS;
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Logo size="lg" showText={false} />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
        How can I help with your <span className="brand-gradient-text">taxes</span> today?
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Ask anything about Income Tax, GST, TDS, Accounting, Trademark or Business Compliance.
        Reply in English, Hindi, Urdu or Hinglish — I'll match your language.
      </p>
      <div className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {list.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-xl border border-border bg-card px-3 py-2.5 text-left text-sm text-foreground/90 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

const DEFAULT_SUGGESTIONS = [
  "How do I file my ITR?",
  "GST registration limit?",
  "Can I claim HRA?",
  "What is Section 80C?",
];

function Composer({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
  textareaRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const rtl = detectRtl(value);

  // Auto-resize.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [value, textareaRef]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isLoading) {
          onStop();
        } else {
          onSubmit();
        }
      }}
      className={cn(
        "relative flex items-end gap-2 rounded-2xl border border-input bg-card p-2.5 shadow-sm transition-shadow",
        "focus-within:border-primary/50 focus-within:shadow-md",
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={rtl ? "rtl" : "ltr"}
        placeholder="Ask about Income Tax, GST, TDS, ROC…"
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading) onSubmit();
          }
        }}
        className="max-h-[220px] min-h-[28px] flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-[15px] leading-6 outline-none placeholder:text-muted-foreground"
      />
      <Button
        type="submit"
        size="icon-sm"
        className={cn(
          "h-9 w-9 shrink-0 rounded-full",
          !isLoading && !value.trim() && "opacity-50",
        )}
        disabled={!isLoading && !value.trim()}
        aria-label={isLoading ? "Stop generating" : "Send message"}
        title={isLoading ? "Stop" : "Send"}
      >
        {isLoading ? <Square className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
      </Button>
    </form>
  );
}
