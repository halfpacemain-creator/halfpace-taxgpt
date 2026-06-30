/**
 * Lightweight rule-based domain classifier.
 *
 * Returns the primary domain(s) for a user query so we can load only the
 * relevant knowledge module(s) into the system prompt. This keeps the
 * payload small and focused, and prepares for a future RAG layer where
 * the same `DomainCategory` taxonomy will key the embeddings index.
 *
 * Swap the rules for an LLM/embedding classifier later without changing
 * call sites — the function signature is stable.
 */

export type DomainCategory =
  | "income_tax"
  | "gst"
  | "tds"
  | "roc_mca"
  | "trademark"
  | "accounting"
  | "msme"
  | "payroll_pt"
  | "halfpace"
  | "general"
  | "out_of_scope";

const KEYWORDS: Record<Exclude<DomainCategory, "general" | "out_of_scope">, RegExp[]> = {
  income_tax: [
    /\b(income[\s-]?tax|itr|i\.?t\.?r|salary tax|115bac|new regime|old regime|advance tax|234[abc]|87a|capital gain|hra|80c|80d|chapter vi-?a|tax slab|assessee|ay\s*20|fy\s*20|aadhaar pan|pan card|26as|ais|tis|refund)\b/i,
  ],
  gst: [
    /\b(gst|cgst|sgst|igst|utgst|gstr[-\s]?\d+|gstin|itc|input tax credit|rcm|reverse charge|composition|qrmp|e[-\s]?invoice|e[-\s]?way bill|hsn|sac|cbic|place of supply|lut)\b/i,
  ],
  tds: [
    /\b(tds|tcs|194[a-z]?|tan|form\s*16|form\s*26q|form\s*27q|deductor|deductee|tds return)\b/i,
  ],
  roc_mca: [
    /\b(roc|mca|companies act|aoc[-\s]?4|mgt[-\s]?7|dir[-\s]?3|dpt[-\s]?3|adt[-\s]?1|llp|form\s*8|form\s*11|incorporation|spice\+?|din|company registration|opc|private limited|pvt ltd|director|board meeting|agm|auditor appointment)\b/i,
  ],
  trademark: [
    /\b(trademark|trade mark|tm[-\s]?a|ip india|brand registration|logo registration|nice class|opposition|tm renewal)\b/i,
  ],
  accounting: [
    /\b(accounting|bookkeeping|book[-\s]?keeping|journal entry|ledger|trial balance|balance sheet|profit and loss|p&l|depreciation|bank reconciliation|brs|tally|zoho books)\b/i,
  ],
  msme: [
    /\b(msme|udyam|micro enterprise|small enterprise|medium enterprise|43b\(h\)|startup india|dpiit)\b/i,
  ],
  payroll_pt: [
    /\b(payroll|salary structure|epf|esic|pf|gratuity|professional tax|ptec|ptrc)\b/i,
  ],
  halfpace: [/\b(halfpace|about (this|the) (assistant|app|bot)|who (made|built) you)\b/i],
};

const OUT_OF_SCOPE_HINTS: RegExp[] = [
  /\b(cricket|football|movie|song|recipe|biryani|weather|stock tip|crypto price|bitcoin price|joke|poem|love|girlfriend|dating|medicine|symptom|disease|programming|code|python|javascript|history of india|prime minister|election|politics)\b/i,
];

const GREETINGS = /^\s*(hi|hello|hey|namaste|namaskar|salaam|assalamu|good (morning|afternoon|evening)|thanks|thank you|shukriya|dhanyavad)\b[\s!.?]*$/i;

export type ClassificationResult = {
  categories: DomainCategory[]; // ordered, most relevant first
  isGreeting: boolean;
  isLikelyOutOfScope: boolean;
};

export function classifyDomain(query: string | undefined | null): ClassificationResult {
  const q = (query ?? "").trim();
  if (!q) {
    return { categories: ["general"], isGreeting: false, isLikelyOutOfScope: false };
  }

  if (GREETINGS.test(q)) {
    return { categories: ["general"], isGreeting: true, isLikelyOutOfScope: false };
  }

  const matched: DomainCategory[] = [];
  for (const [cat, patterns] of Object.entries(KEYWORDS) as [
    DomainCategory,
    RegExp[],
  ][]) {
    if (patterns.some((p) => p.test(q))) matched.push(cat);
  }

  const isLikelyOutOfScope =
    matched.length === 0 && OUT_OF_SCOPE_HINTS.some((p) => p.test(q));

  if (matched.length === 0) {
    return {
      categories: ["general"],
      isGreeting: false,
      isLikelyOutOfScope,
    };
  }

  return { categories: matched, isGreeting: false, isLikelyOutOfScope: false };
}
