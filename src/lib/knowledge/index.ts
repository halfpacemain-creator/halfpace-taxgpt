/**
 * HalfPace TaxGPT knowledge base — aggregation + selective loader.
 *
 * Architecture:
 *   1. Classify the user query (`classifyDomain`) into one or more
 *      `DomainCategory` buckets.
 *   2. `buildKnowledgeContext(query)` loads ONLY the relevant module(s)
 *      and concatenates them into a compact context block.
 *   3. The system prompt embeds that block per-request.
 *
 * Future: swap the per-module string builders for vector-search retrievers
 * (Acts / Rules / Notifications / Circulars / HalfPace SOPs) keyed by the
 * same `DomainCategory` taxonomy. Call sites do not change.
 */
import { INCOME_TAX } from "./income-tax";
import { GST } from "./gst";
import { COMPLIANCE } from "./compliance";
import { HALFPACE } from "./halfpace";
import { classifyDomain, type DomainCategory } from "./classifier";

export { classifyDomain } from "./classifier";
export type { DomainCategory, ClassificationResult } from "./classifier";

export const KNOWLEDGE = { INCOME_TAX, GST, COMPLIANCE, HALFPACE } as const;

// ---------- Per-module formatters ----------

function incomeTaxBlock(): string {
  const it = INCOME_TAX;
  return `[INCOME TAX — ${it.assessmentYear} / ${it.financialYear}, reviewed ${it.lastReviewed}]
New regime slabs (default, u/s 115BAC):
${it.newRegimeSlabs
  .map(
    (s) =>
      `  • up to ₹${s.upTo === Infinity ? "above ₹15,00,000" : s.upTo.toLocaleString("en-IN")} → ${(s.rate * 100).toFixed(0)}%`,
  )
  .join("\n")}
Standard deduction (new regime, salaried): ₹${it.newRegimeStandardDeduction.toLocaleString("en-IN")}
Rebate u/s 87A (new regime): full rebate up to total income ₹${it.newRegimeRebate87A.limit.toLocaleString("en-IN")} (max ₹${it.newRegimeRebate87A.maxRebate.toLocaleString("en-IN")})
Old regime slabs:
${it.oldRegimeSlabs
  .map(
    (s) =>
      `  • up to ₹${s.upTo === Infinity ? "above ₹10,00,000" : s.upTo.toLocaleString("en-IN")} → ${(s.rate * 100).toFixed(0)}%`,
  )
  .join("\n")}
Old regime std. deduction: ₹${it.oldRegimeStandardDeduction.toLocaleString("en-IN")}; 87A rebate up to ₹${it.oldRegimeRebate87A.limit.toLocaleString("en-IN")} (max ₹${it.oldRegimeRebate87A.maxRebate.toLocaleString("en-IN")}).
Health & Education Cess: ${(it.healthAndEducationCess * 100).toFixed(0)}%
Key due dates: ITR (non-audit) ${it.dueDates.itrNonAudit}; audit cases ${it.dueDates.itrAuditCases}; belated/revised ${it.dueDates.belatedRevisedItr}.
Advance tax: ${it.dueDates.advanceTax.map((a) => `${a.instalment} by ${a.by} (${a.cumulative})`).join("; ")}
Interest: 234A ${it.interest.section234A}; 234B ${it.interest.section234B}; 234C ${it.interest.section234C}.
Notes:
${it.notes.map((n) => `  - ${n}`).join("\n")}`;
}

function gstBlock(): string {
  const g = GST;
  return `[GST — reviewed ${g.lastReviewed}]
Registration thresholds: Goods ₹${(g.registrationThresholds.goodsNormalStates / 100000).toFixed(0)} lakh (₹${(g.registrationThresholds.goodsSpecialCategory / 100000).toFixed(0)} lakh special category); Services ₹${(g.registrationThresholds.services / 100000).toFixed(0)} lakh (₹${(g.registrationThresholds.servicesSpecialCategory / 100000).toFixed(0)} lakh special category).
Rate slabs: ${g.rateSlabs.map((r) => `${(r * 100).toFixed(0)}%`).join(", ")}.
Due dates: GSTR-1 (monthly) ${g.dueDates.gstr1Monthly}; QRMP GSTR-1 ${g.dueDates.gstr1Quarterly_QRMP}; IFF ${g.dueDates.iff_QRMP}; GSTR-3B (monthly) ${g.dueDates.gstr3bMonthly}; QRMP GSTR-3B ${g.dueDates.gstr3bQRMP}; CMP-08 ${g.dueDates.cmp08Composition}; GSTR-4 ${g.dueDates.gstr4Composition}; GSTR-9 ${g.dueDates.gstr9Annual}; GSTR-9C ${g.dueDates.gstr9CReconciliation}.
Late fees: ${Object.entries(g.lateFees).map(([k, v]) => `${k} — ${v}`).join("; ")}.
Interest: delayed payment ${g.interest.delayedPayment}; wrong ITC utilised ${g.interest.excessITC}.
ITC time limit (s.16(4)): ${g.itc.timeLimit}
Blocked credits (s.17(5)): ${g.itc.blockedCredits}
ITC conditions (s.16(2)): ${g.itc.conditions}
E-invoicing: ${g.eInvoicing.threshold} → ${g.eInvoicing.appliesTo}.
E-way bill: ${g.eWayBill.threshold}; validity ${g.eWayBill.validity}.
Notes:
${g.notes.map((n) => `  - ${n}`).join("\n")}`;
}

function tdsBlock(): string {
  const c = COMPLIANCE;
  return `[TDS / TCS — common sections]
${Object.entries(c.tds.commonSections).map(([k, v]) => `  • Sec ${k}: ${v}`).join("\n")}
TCS s.206C(1H): ${c.tds.tcs206C1H}
TDS deposit due: 7th of next month (April: 30 April). Quarterly TDS returns: 31 Jul / 31 Oct / 31 Jan / 31 May.
Interest s.201(1A): 1% per month for late deduction; 1.5% per month for late deposit.`;
}

function rocBlock(): string {
  const c = COMPLIANCE;
  return `[ROC / MCA — Companies Act 2013]
${Object.entries(c.roc).map(([k, v]) => `  • ${k.toUpperCase()}: ${v}`).join("\n")}

[LLP — LLP Act 2008]
${Object.entries(c.llp).map(([k, v]) => `  • ${k}: ${v}`).join("\n")}`;
}

function trademarkBlock(): string {
  const c = COMPLIANCE;
  return `[Trademark — Trade Marks Act 1999]
Classes: ${c.trademark.classes}
Process:
${c.trademark.process.map((p, i) => `  ${i + 1}. ${p}`).join("\n")}`;
}

function accountingBlock(): string {
  return `[Accounting / Bookkeeping]
Follow Indian GAAP / Ind AS as applicable. Maintain books u/s 128 Companies Act / s.44AA Income-tax Act.
Common heads: Sales, Purchases, Direct Expenses, Indirect Expenses, Assets (Fixed, Current), Liabilities (Current, Long-term), Capital.
Depreciation: Income-tax — WDV method as per s.32 + Rule 5; Companies Act — useful life basis per Sch. II.
Bank Reconciliation: match book balance vs bank statement; identify unpresented cheques, uncredited deposits, bank charges, interest.`;
}

function msmeBlock(): string {
  const c = COMPLIANCE;
  return `[MSME / Udyam]
Registration: ${c.msme.udyamRegistration}
Classification — Micro: ${c.msme.classification.micro}; Small: ${c.msme.classification.small}; Medium: ${c.msme.classification.medium}.
Income-tax s.43B(h): ${c.msme.section43B_h}`;
}

function payrollPtBlock(): string {
  const c = COMPLIANCE;
  return `[Payroll / Professional Tax]
PT: ${c.professionalTax.note}
EPF: 12% employee + 12% employer (8.33% to EPS, 3.67% to EPF) on basic+DA up to wage ceiling.
ESIC: 0.75% employee + 3.25% employer on gross wages where gross ≤ ₹21,000/month.
Gratuity: Payable after 5 years of continuous service; formula = (Last drawn basic+DA × 15 × completed years) / 26. Tax-exempt up to ₹20 lakh.`;
}

function halfpaceBlock(): string {
  const h = HALFPACE;
  return `[HALFPACE — about & house style, reviewed ${h.lastReviewed}]
About: ${h.about}
Escalation triggers (advise user to consult a CA/CS/lawyer):
${h.escalationTriggers.map((t) => `  - ${t}`).join("\n")}
House style:
${h.houseStyle.map((t) => `  - ${t}`).join("\n")}`;
}

const BUILDERS: Record<DomainCategory, (() => string) | null> = {
  income_tax: incomeTaxBlock,
  gst: gstBlock,
  tds: tdsBlock,
  roc_mca: rocBlock,
  trademark: trademarkBlock,
  accounting: accountingBlock,
  msme: msmeBlock,
  payroll_pt: payrollPtBlock,
  halfpace: halfpaceBlock,
  general: null,
  out_of_scope: null,
};

/**
 * Build a focused knowledge context block for the given query.
 * Loads ONLY the modules matched by `classifyDomain`. For greetings or
 * empty queries, returns just the HalfPace house style.
 */
export function buildKnowledgeContext(userQuery?: string): string {
  const { categories } = classifyDomain(userQuery);

  const blocks: string[] = [];
  const seen = new Set<string>();
  for (const cat of categories) {
    const fn = BUILDERS[cat];
    if (!fn || seen.has(cat)) continue;
    seen.add(cat);
    blocks.push(fn());
  }
  // Always include HalfPace house style so the assistant stays on-brand,
  // unless it's already in.
  if (!seen.has("halfpace")) blocks.push(halfpaceBlock());

  return `=== HALFPACE TAXGPT VERIFIED KNOWLEDGE BASE (loaded: ${categories.join(", ")}) ===
Use these values as the source of truth. If a user asks about a number,
rate, due date or section that is covered here, you MUST use these figures
and may cite them confidently. If a question goes beyond what's listed,
say so explicitly rather than guessing.

${blocks.join("\n\n")}
=== END KNOWLEDGE BASE ===`;
}

/**
 * Future RAG retrieval stub. Returns [] today; swap implementation when
 * embeddings store is added. Keep the signature stable so callers
 * (system-prompt.ts) need no changes.
 */
export async function retrieveLegalChunks(
  _query: string,
  _categories: DomainCategory[] = [],
  _topK = 5,
): Promise<Array<{ source: string; text: string; score: number; category: DomainCategory }>> {
  return [];
}
