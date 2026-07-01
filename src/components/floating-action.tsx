import { Link } from "@tanstack/react-router";
import { Calculator, MessageCircle, MessageSquarePlus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { newThreadId } from "@/lib/threads";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, openWhatsAppInNewTab } from "@/lib/whatsapp";

export function FloatingAction() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      className="pointer-events-none fixed right-4 z-30 flex flex-col items-end md:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 6.25rem)" }}
    >
      {open && (
        <div className="pointer-events-auto mb-3 flex flex-col items-end gap-2">
          <Link
            to="/chat/$threadId"
            params={{ threadId: newThreadId() }}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-border"
          >
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            New Chat
          </Link>
          <Link
            to="/calculators"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-border"
          >
            <Calculator className="h-4 w-4 text-primary" />
            Tax Calculator
          </Link>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.preventDefault();
              setOpen(false);
              openWhatsAppInNewTab();
            }}
            className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            WhatsApp
          </a>
        </div>
      )}
      <button
        type="button"
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full text-white shadow-xl transition-transform brand-gradient-bg",
          open && "rotate-45",
        )}
      >
        {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </button>
    </div>
  );
}
