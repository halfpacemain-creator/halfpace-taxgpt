const CHIPS: { label: string; prompt: string }[] = [
  { label: "GST", prompt: "Explain GST registration limits and rate slabs in India." },
  { label: "Income Tax", prompt: "Walk me through the new income tax regime slabs for FY 2024-25." },
  { label: "TDS", prompt: "Which TDS section applies to professional fees and at what rate?" },
  { label: "Trademark", prompt: "How do I register a trademark in India and what is the process?" },
  { label: "ROC", prompt: "What are the annual ROC filing requirements for a Private Limited Company?" },
  { label: "Company Registration", prompt: "How do I register a Private Limited Company in India?" },
  { label: "LLP", prompt: "Explain the compliance requirements for an LLP in India." },
  { label: "Tax Calculator", prompt: "Help me calculate my income tax under the new regime for FY 2024-25." },
];

export function SuggestionChips({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2">
        {CHIPS.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => onPick(c.prompt)}
            className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground hover:shadow"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
