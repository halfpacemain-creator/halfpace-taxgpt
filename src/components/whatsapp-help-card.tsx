import { MessageCircle } from "lucide-react";

import { WHATSAPP_DISPLAY, buildWhatsAppUrl, openWhatsAppInNewTab } from "@/lib/whatsapp";

// Triggers that suggest the user would benefit from human expert help.
const COMPLEX_TRIGGERS = [
  // Notices / litigation
  "notice", "143(2)", "148", "142(1)", "drc-01", "drc-1", "show cause", "show-cause",
  "assessment", "reassessment", "scrutiny", "appeal", "appellate", "cit(a)", "itat",
  "penalty", "penalties", "prosecution", "summons", "search", "survey", "raid",
  // Document review
  "review my", "check my", "review this", "look at my", "review the document",
  "review document", "draft", "agreement", "contract",
  // Complex matters
  "transfer pricing", "fema", "merger", "demerger", "slump sale", "restructuring",
  "litigation", "dispute", "refund stuck", "rectification", "154",
  // AI uncertainty markers (from system prompt)
  "cannot confirm", "can't confirm", "not certain", "uncertain",
  "please verify with a qualified", "consult a chartered accountant",
  "consult a ca", "professional assistance", "escalate",
];

export function shouldShowWhatsAppCard(userQuery: string, aiResponse: string): boolean {
  if (!aiResponse || aiResponse.trim().length < 40) return false;
  const haystack = `${userQuery}\n${aiResponse}`.toLowerCase();
  return COMPLEX_TRIGGERS.some((t) => haystack.includes(t));
}

export { buildWhatsAppUrl };

export function WhatsAppHelpCard({
  userQuery,
  aiResponse,
}: {
  userQuery: string;
  aiResponse: string;
  chatId?: string;
}) {
  const url = buildWhatsAppUrl(userQuery, aiResponse);
  return (
    <div className="mt-4 rounded-2xl border border-[#25D366]/25 bg-gradient-to-br from-[#25D366]/[0.06] to-[#128C7E]/[0.06] p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-foreground">
        Still not sure about the answer?
      </h4>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        HalfPace<sup className="reg-mark" aria-hidden>®</sup> TaxGPT is currently in{" "}
        <span className="font-medium text-foreground">Beta</span>.
        While we strive for accuracy, some tax situations need a detailed review by our experts.
        If your query is complex or you'd like professional assistance, continue this conversation
        directly with our team on WhatsApp. Our tax experts will review your query and respond
        within approximately <span className="font-medium text-foreground">24 hours</span>.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        WhatsApp: <span className="font-medium text-foreground">{WHATSAPP_DISPLAY}</span>
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => {
          event.preventDefault();
          openWhatsAppInNewTab(userQuery, aiResponse);
        }}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5b] hover:shadow-md active:translate-y-0"
      >
        <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
        Continue on WhatsApp
      </a>
    </div>
  );
}

