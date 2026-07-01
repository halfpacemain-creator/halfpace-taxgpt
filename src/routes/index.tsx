import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowUp,
  FileText,
  Receipt,
  Briefcase,
  Stamp,
  Building2,
  BadgePercent,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { Logo } from "@/components/logo";
import { PublicFooter } from "@/components/public-footer";
import { Button } from "@/components/ui/button";
import { newThreadId } from "@/lib/threads";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HalfPace® TaxGPT — India's AI Tax Expert" },
      {
        name: "description",
        content:
          "Ask HalfPace® TaxGPT anything about Income Tax, GST, Accounting, Trademark or Business Compliance. Free AI assistant for Indian taxation in English, Hindi, Urdu and Hinglish.",
      },
      { property: "og:title", content: "HalfPace® TaxGPT — India's AI Tax Expert" },
      {
        property: "og:description",
        content:
          "Ask anything about Income Tax, GST, Accounting, Trademark or Business Compliance.",
      },
    ],
  }),
  component: Index,
});

const SUGGESTIONS = [
  "How do I file my ITR?",
  "GST registration limit?",
  "Can I claim HRA?",
  "What is Section 80C?",
  "How do I reply to an Income Tax notice?",
  "GST for freelancers.",
  "مجھے انکم ٹیکس ریٹرن کیسے فائل کرنی ہے؟",
  "मुझे GST रजिस्ट्रेशन कब लेना चाहिए?",
];

const FEATURES = [
  { label: "Income Tax", icon: FileText },
  { label: "GST", icon: Receipt },
  { label: "TDS", icon: BadgePercent },
  { label: "Accounting", icon: Briefcase },
  { label: "Trademark", icon: Stamp },
  { label: "Company Registration", icon: Building2 },
] as const;

function detectRtl(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

function Index() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [input]);

  const startChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = newThreadId();
    void navigate({
      to: "/chat/$threadId",
      params: { threadId: id },
      search: { q: trimmed },
    });
  };

  const rtl = detectRtl(input);

  return (
    <AppShell>
      <div className="h-full overflow-y-auto app-bg-radials">
        <section className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-10 pt-12 text-center md:pt-20">
          <Logo size="lg" showText={false} />
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            HalfPace<sup className="reg-mark" aria-hidden>®</sup>{" "}
            <span className="brand-gradient-text">TaxGPT</span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Ask anything about Income Tax, GST, Accounting, Trademark or Business Compliance.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              startChat(input);
            }}
            className="mt-8 w-full"
          >
            <div className="relative flex items-end gap-2 rounded-2xl border border-input bg-card p-2.5 text-left shadow-sm transition-shadow focus-within:border-primary/50 focus-within:shadow-md">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                dir={rtl ? "rtl" : "ltr"}
                placeholder="Ask HalfPace® TaxGPT anything…"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    startChat(input);
                  }
                }}
                className="max-h-[220px] min-h-[28px] flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-[15px] leading-6 outline-none placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                size="icon-sm"
                className="h-9 w-9 shrink-0 rounded-full"
                disabled={!input.trim()}
                aria-label="Send"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => {
              const r = detectRtl(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => startChat(s)}
                  dir={r ? "rtl" : "ltr"}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground hover:shadow-sm md:text-sm"
                >
                  {s}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border/70 bg-card/60 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-[13px] font-medium text-foreground/90">{f.label}</div>
                </div>
              );
            })}
          </div>
        </section>


        <PublicFooter />
      </div>
    </AppShell>
  );
}
