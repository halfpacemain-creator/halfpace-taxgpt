import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  Square,
  ArrowUp,
  Download,
  FileText,
  FileDown,
  Copy as CopyIcon,
  Mic,
  Paperclip,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { ChatErrorDisplay } from "@/components/error-cards";
import { BrandMark, Logo } from "@/components/logo";
import { Markdown } from "@/components/markdown";
import { MessageActions } from "@/components/message-actions";
import { SuggestionChips } from "@/components/suggestion-chips";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WhatsAppHelpCard, shouldShowWhatsAppCard } from "@/components/whatsapp-help-card";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { prepareAttachment, type PreparedAttachment } from "@/lib/attachments";
import { detectErrorKind, type ErrorKind } from "@/lib/error-messages";
import { copyChat, downloadChatPdf, downloadChatText } from "@/lib/export-chat";
import { deriveTitle, usePersistThread } from "@/lib/threads";
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

interface ImagePart {
  url: string;
  mediaType: string;
  filename?: string;
}

function getMessageImages(m: UIMessage): ImagePart[] {
  const out: ImagePart[] = [];
  for (const p of m.parts as Array<{
    type: string;
    url?: string;
    mediaType?: string;
    filename?: string;
  }>) {
    if (p.type === "file" && p.url && p.mediaType?.startsWith("image/")) {
      out.push({ url: p.url, mediaType: p.mediaType, filename: p.filename });
    }
  }
  return out;
}

function detectRtl(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

export function ChatWindow({
  threadId,
  initialMessages,
  autoSend,
  onAutoSent,
}: ChatWindowProps) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);

  const { messages, sendMessage, status, stop, regenerate, setMessages } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => {
      const kind = detectErrorKind(e?.message) ?? "generic";
      setErrorKind(kind);
      if (kind === "generic") {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  usePersistThread({ threadId, messages, status });

  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<PreparedAttachment[]>([]);
  const [interimTranscript, setInterimTranscript] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPinnedRef = useRef(true);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status === "ready"]);

  // Auto-send from URL param.
  const autoSentRef = useRef<string | null>(null);
  useEffect(() => {
    if (!autoSend) return;
    if (autoSentRef.current === autoSend) return;
    if (initialMessages.length > 0) return;
    autoSentRef.current = autoSend;
    void sendMessage({ text: autoSend });
    onAutoSent?.();
  }, [autoSend, initialMessages.length, sendMessage, onAutoSent]);

  // Track whether the user is pinned to the bottom.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      isPinnedRef.current = distanceFromBottom < 120;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Only auto-scroll when pinned; never yank the user during scroll-up.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (!isPinnedRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const isLoading = status === "submitted" || status === "streaming";

  const submit = (raw?: string) => {
    const text = (raw ?? input).trim();
    if ((!text && attachments.length === 0) || isLoading) return;
    setErrorKind(null);
    isPinnedRef.current = true;
    if (attachments.length > 0) {
      const parts: Array<
        { type: "text"; text: string } | { type: "file"; url: string; mediaType: string; filename?: string }
      > = [];
      if (text) parts.push({ type: "text", text });
      for (const a of attachments) {
        parts.push({ type: "file", url: a.url, mediaType: a.mediaType, filename: a.filename });
      }
      void sendMessage({ role: "user", parts } as unknown as Parameters<typeof sendMessage>[0]);
    } else {
      void sendMessage({ text });
    }
    setInput("");
    setAttachments([]);
    setInterimTranscript("");
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const onClear = () => {
    if (messages.length === 0) return;
    if (!confirm("Clear this conversation?")) return;
    setMessages([]);
  };

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-4 sm:py-6">
          {messages.length === 0 ? (
            <EmptyState onPick={(p) => submit(p)} />
          ) : (
            <ul className="space-y-5 sm:space-y-6">
              {messages.map((m, idx) => {
                const text = getMessageText(m);
                const isUser = m.role === "user";
                const rtl = detectRtl(text);
                const isStreamingThis = m.id === lastAssistantId && isLoading;
                const prevUser = !isUser
                  ? [...messages.slice(0, idx)].reverse().find((x) => x.role === "user")
                  : null;
                const prevUserText = prevUser ? getMessageText(prevUser) : "";
                const showWhatsApp =
                  !isUser &&
                  !isStreamingThis &&
                  text.length > 0 &&
                  shouldShowWhatsAppCard(prevUserText, text);
                return (
                  <li key={m.id} className="group">
                    {isUser ? (
                      <div className="flex justify-end">
                        <div className="flex max-w-[85%] flex-col items-end gap-1.5">
                          {getMessageImages(m).map((img, i) => (
                            <img
                              key={i}
                              src={img.url}
                              alt={img.filename ?? "Attachment"}
                              className="max-h-64 max-w-full rounded-2xl border border-border shadow-sm"
                            />
                          ))}
                          {text && (
                            <div
                              dir={rtl ? "rtl" : "ltr"}
                              className="whitespace-pre-wrap break-words rounded-2xl bg-chat-user px-4 py-2.5 text-[15px] leading-6 text-chat-user-foreground shadow-sm"
                            >
                              {text}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                        <BrandMark className="mt-0.5 h-8 w-8 shrink-0 ring-1 ring-black/5" />
                        <div className="min-w-0 flex-1" dir={rtl ? "rtl" : "ltr"}>
                          {text ? (
                            <Markdown>{text}</Markdown>
                          ) : (
                            <ThinkingIndicator />
                          )}
                          {!isStreamingThis && text.length > 0 && (
                            <MessageActions
                              threadId={threadId}
                              messageId={m.id}
                              question={prevUserText}
                              answer={text}
                              onRegenerate={m.id === lastAssistantId ? () => regenerate() : undefined}
                              showRegenerate={m.id === lastAssistantId}
                            />
                          )}
                          {showWhatsApp && (
                            <WhatsAppHelpCard
                              userQuery={prevUserText}
                              aiResponse={text}
                              chatId={threadId}
                            />
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

      <div className="border-t border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65 safe-pb safe-pl safe-pr">
        <div className="mx-auto w-full max-w-3xl px-3 pt-2 sm:px-4">
          {messages.length > 0 && (
            <div className="pb-1">
              <SuggestionChips onPick={(p) => submit(p)} />
            </div>
          )}
          <Composer
            value={input}
            onChange={setInput}
            onSubmit={() => submit()}
            onStop={stop}
            isLoading={isLoading}
            textareaRef={textareaRef}
            attachments={attachments}
            onAttach={async (files) => {
              const next: PreparedAttachment[] = [...attachments];
              for (const f of files) {
                try {
                  if (next.length >= 3) {
                    toast.error("You can attach up to 3 images.");
                    break;
                  }
                  next.push(await prepareAttachment(f));
                } catch (err) {
                  toast.error((err as Error).message);
                }
              }
              setAttachments(next);
            }}
            onRemoveAttachment={(i) => setAttachments(attachments.filter((_, k) => k !== i))}
            interimTranscript={interimTranscript}
            onInterimTranscript={setInterimTranscript}
            onFinalTranscript={(t) => {
              setInput((prev) => (prev ? prev.trimEnd() + " " + t : t));
              setInterimTranscript("");
            }}
          />
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 pb-2 text-[11px] text-muted-foreground">
            <span className="min-w-0">
              HalfPace TaxGPT can make mistakes. Verify important details with a qualified professional.
            </span>
            {messages.length > 0 && (
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded px-2 py-0.5 hover:bg-muted hover:text-foreground"
                      aria-label="Export conversation"
                    >
                      <Download className="h-3 w-3" />
                      Export
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="top" className="w-52">
                    <DropdownMenuLabel>Export chat</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        downloadChatPdf(deriveTitle(messages), messages);
                        toast.success("PDF downloaded");
                      }}
                    >
                      <FileDown className="mr-2 h-4 w-4" /> Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        downloadChatText(deriveTitle(messages), messages);
                        toast.success("Text file downloaded");
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Download .txt
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          await copyChat(deriveTitle(messages), messages);
                          toast.success("Full chat copied to clipboard");
                        } catch {
                          toast.error("Could not copy");
                        }
                      }}
                    >
                      <CopyIcon className="mr-2 h-4 w-4" /> Copy entire chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={onClear}
                  className="rounded px-2 py-0.5 hover:bg-muted hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          {errorKind && (
            <ChatErrorDisplay
              kind={errorKind}
              onRetry={() => {
                setErrorKind(null);
                void regenerate();
              }}
              onDismiss={() => setErrorKind(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 py-2 text-sm">
      <span className="inline-flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
      </span>
      <span className="hp-analyzing font-medium">
        HalfPace TaxGPT is analysing your query…
      </span>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center sm:py-10">
      <Logo size="lg" showText={false} />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
        How can I help with your <span className="brand-gradient-text">taxes</span> today?
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Ask anything about Income Tax, GST, TDS, Accounting, Trademark or Business Compliance.
        Reply in English, Hindi, Urdu or Hinglish — I'll match your language.
      </p>
      <div className="mt-6 w-full">
        <SuggestionChips onPick={onPick} />
      </div>
      <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {DEFAULT_SUGGESTIONS.map((s) => (
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
  attachments,
  onAttach,
  onRemoveAttachment,
  interimTranscript,
  onInterimTranscript,
  onFinalTranscript,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  attachments: PreparedAttachment[];
  onAttach: (files: File[]) => void;
  onRemoveAttachment: (index: number) => void;
  interimTranscript: string;
  onInterimTranscript: (t: string) => void;
  onFinalTranscript: (t: string) => void;
}) {
  const rtl = detectRtl(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const voice = useVoiceInput({
    onTranscript: (t, isFinal) => {
      if (isFinal) onFinalTranscript(t);
      else onInterimTranscript(t);
    },
    onError: (msg) => toast.error(msg),
  });

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    // ~5 lines: 24px line-height * 5 + 16px padding
    el.style.height = Math.min(el.scrollHeight, 156) + "px";
  }, [value, textareaRef]);

  const canSend = !isLoading && (value.trim().length > 0 || attachments.length > 0);
  const displayValue = interimTranscript
    ? (value ? value.trimEnd() + " " : "") + interimTranscript
    : value;

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
        "relative flex flex-col gap-2 rounded-2xl border border-input bg-card p-2 shadow-sm transition-shadow",
        "focus-within:border-primary/50 focus-within:shadow-md",
      )}
    >
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1 pt-1">
          {attachments.map((a, i) => (
            <div
              key={i}
              className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted"
            >
              <img src={a.url} alt={a.filename} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveAttachment(i)}
                className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                aria-label={`Remove ${a.filename}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onAttach(files);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach image"
          title="Attach image"
          disabled={isLoading}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {voice.supported && (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className={cn(
              "h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground",
              voice.listening && "bg-primary/10 text-primary animate-pulse",
            )}
            onClick={() => (voice.listening ? voice.stop() : voice.start())}
            aria-label={voice.listening ? "Stop voice input" : "Start voice input"}
            title={voice.listening ? "Stop dictation" : "Voice input"}
            disabled={isLoading}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}

        <textarea
          ref={textareaRef}
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          dir={rtl ? "rtl" : "ltr"}
          placeholder={
            voice.listening ? "Listening…" : "Ask anything about GST, Income Tax, TDS, ROC, Trademark…"
          }
          rows={1}
          aria-label="Message HalfPace TaxGPT"
          readOnly={!!interimTranscript}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) onSubmit();
            }
          }}
          className="max-h-[156px] min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-[16px] leading-6 outline-none placeholder:text-muted-foreground md:text-[15px]"
        />
        <Button
          type="submit"
          size="icon-sm"
          className={cn(
            "h-11 w-11 shrink-0 rounded-full sm:h-10 sm:w-10",
            !isLoading && !canSend && "opacity-50",
          )}
          disabled={!isLoading && !canSend}
          aria-label={isLoading ? "Stop generating" : "Send message"}
          title={isLoading ? "Stop" : "Send"}
        >
          {isLoading ? <Square className="h-4 w-4" /> : <ArrowUp className="h-5 w-5" />}
        </Button>
      </div>
    </form>
  );
}
