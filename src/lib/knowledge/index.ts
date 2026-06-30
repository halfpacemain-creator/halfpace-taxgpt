/**
 * HalfPace TaxGPT knowledge base — aggregation layer.
 *
 * Current implementation: deterministic structured facts injected into the
 * system prompt at request time. This is a lightweight RAG-ready scaffold.
 *
 * Future: replace `buildKnowledgeContext()` with a vector-search retriever
 * that pulls the top-k relevant chunks from an embeddings index of:
 *   - Income-tax Act / Finance Acts
 *   - CGST/IGST/SGST Acts, Rules, Notifications, Circulars
 *   - CBDT / CBIC circulars and press releases
 *   - Companies Act / LLP Act
 *   - HalfPace-authored guidance
 *
 * The chat route only depends on `buildKnowledgeContext(userQuery)`, so the
 * swap is local — no UI / route changes required.
 */
import { INCOME_TAX } from "./income-tax";
import { GST } from "./gst";
import { COMPLIANCE } from "./compliance";

export const KNOWLEDGE = { INCOME_TAX, GST, COMPLIANCE } as const;

/**
 * Build a compact, model-friendly knowledge context block.
 *
 * For now this returns the full structured facts (small payload). When a
 * real vector store is added, switch on `userQuery` to only retrieve the
 * relevant slices.
 */
export function buildKnowledgeContext(_userQuery?: string): string {
  const it = INCOME_TAX;
  const g = GST;
  const c = COMPLIANCE;

  return `
=== HALFPACE TAXGPT VERIFIED KNOWLEDGE BASE ===
Use these values as the source of truth. If a user asks about a number /
rate / due date that is covered here, you MUST use these figures and may
cite them confidently. If a question goes beyond what's listed, say so.

[INCOME TAX — ${it.assessmentYear} / ${it.financialYear}, reviewed ${it.lastReviewed}]
New regime slabs (default, u/s 115BAC):
${it.newRegimeSlabs
  .map(
    (s) =>
      `  • up to ₹${s.upTo === Infinity ? "above ₹15,00,000" : s.upTo.toLocaleString("en-IN")} → ${(s.rate * 100).toFixed(0)}%`,
  )
  .join("\n")}
Standard deduction (new regime, salaried): ₹${it.newRegimeStandardDeduction.toLocaleString("en-IN")}
Rebate u/s 87A (new regime): full rebate up to total income ₹${it.newRegimeRebate87A.limit.toLocaleString("en-IN")} (max ₹${it.newRegimeRebate87A.maxRebate.toLocaleString("en-IN")})
Health & Education Cess: ${(it.healthAndEducationCess * 100).toFixed(0)}%
Key due dates: ITR (non-audit) ${it.dueDates.itrNonAudit}; audit cases ${it.dueDates.itrAuditCases}; belated/revised ${it.dueDates.belatedRevisedItr}.
Advance tax: ${it.dueDates.advanceTax.map((a) => `${a.instalment} by ${a.by} (${a.cumulative})`).join("; ")}
Interest: 234A ${it.interest.section234A}; 234B ${it.interest.section234B}; 234C ${it.interest.section234C}.
Notes:
${it.notes.map((n) => `  - ${n}`).join("\n")}

[GST — reviewed ${g.lastReviewed}]
Registration thresholds: Goods ₹${(g.registrationThresholds.goodsNormalStates / 100000).toFixed(0)} lakh (₹${(g.registrationThresholds.goodsSpecialCategory / 100000).toFixed(0)} lakh special category); Services ₹${(g.registrationThresholds.services / 100000).toFixed(0)} lakh (₹${(g.registrationThresholds.servicesSpecialCategory / 100000).toFixed(0)} lakh special category).
Rate slabs: ${g.rateSlabs.map((r) => `${(r * 100).toFixed(0)}%`).join(", ")}.
Key due dates: GSTR-1 (monthly) ${g.dueDates.gstr1Monthly}; GSTR-3B (monthly) ${g.dueDates.gstr3bMonthly}; QRMP GSTR-3B ${g.dueDates.gstr3bQRMP}; GSTR-9 ${g.dueDates.gstr9Annual}; GSTR-9C ${g.dueDates.gstr9CReconciliation}.
Interest: delayed payment ${g.interest.delayedPayment}; wrong ITC utilised ${g.interest.excessITC}.
ITC time limit: ${g.itc.timeLimit}
Blocked credits (s.17(5)): ${g.itc.blockedCredits}
ITC conditions (s.16(2)): ${g.itc.conditions}
E-invoicing: ${g.eInvoicing.threshold} → ${g.eInvoicing.appliesTo}.
E-way bill: ${g.eWayBill.threshold}; validity ${g.eWayBill.validity}.

[ROC / MCA]
${Object.entries(c.roc).map(([k, v]) => `  • ${k.toUpperCase()}: ${v}`).join("\n")}

[LLP]
${Object.entries(c.llp).map(([k, v]) => `  • ${k}: ${v}`).join("\n")}

[TDS — common sections]
${Object.entries(c.tds.commonSections).map(([k, v]) => `  • Sec ${k}: ${v}`).join("\n")}
TCS s.206C(1H): ${c.tds.tcs206C1H}

[MSME]
Classification — Micro: ${c.msme.classification.micro}; Small: ${c.msme.classification.small}; Medium: ${c.msme.classification.medium}.
Sec 43B(h): ${c.msme.section43B_h}

[Professional Tax]
${c.professionalTax.note}

[Trademark]
${c.trademark.process.map((p, i) => `  ${i + 1}. ${p}`).join("\n")}
=== END KNOWLEDGE BASE ===
`.trim();
}

/**
 * Future RAG retrieval stub. Returns [] today; swap implementation when
 * embeddings store is added. Keep the signature stable.
 */
export async function retrieveLegalChunks(
  _query: string,
  _topK = 5,
): Promise<Array<{ source: string; text: string; score: number }>> {
  return [];
}
