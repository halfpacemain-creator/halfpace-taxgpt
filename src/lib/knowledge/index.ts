/**
 * HalfPace TaxGPT — RAG-driven knowledge aggregator.
 *
 * `buildKnowledgeContext(query)`:
 *   1. Classifies the query into one or more `DomainCategory` buckets.
 *   2. Retrieves the top-k matching docs from `src/knowledge/**` using a
 *      keyword + metadata search, restricted to the detected domain(s).
 *   3. Falls back to broad search if domain-restricted search is empty.
 *   4. Returns a compact context block; only the retrieved docs are
 *      injected into the system prompt.
 *
 * Future: swap `search()` in `lib/rag/search.ts` for a vector retriever —
 * no call sites need to change.
 */
import { classifyDomain, type DomainCategory } from "./classifier";
import { formatRetrieved, search } from "../rag/search";
import { loadAllDocs } from "../rag/loader";

export { classifyDomain } from "./classifier";
export type { DomainCategory, ClassificationResult } from "./classifier";

// Map internal taxonomy → folder slugs under src/knowledge/
const DOMAIN_TO_FOLDER: Record<DomainCategory, string[]> = {
  income_tax: ["income-tax"],
  gst: ["gst"],
  tds: ["tds"],
  roc_mca: ["roc"],
  trademark: ["trademark"],
  accounting: ["accounting"],
  msme: ["accounting", "income-tax"], // 43B(h) lives in income-tax / accounting
  payroll_pt: ["accounting"],
  halfpace: ["halfpace"],
  general: ["halfpace"],
  out_of_scope: ["halfpace"],
};

export function buildKnowledgeContext(userQuery?: string): string {
  const { categories } = classifyDomain(userQuery);
  const folders = Array.from(
    new Set(categories.flatMap((c) => DOMAIN_TO_FOLDER[c])),
  );

  const q = (userQuery ?? "").trim();

  // Domain-scoped retrieval first
  let retrieved = q
    ? search(q, { preferredDomains: folders, domainsOnly: folders, topK: 4 })
    : [];

  // Broaden if nothing matched
  if (retrieved.length === 0 && q) {
    retrieved = search(q, { preferredDomains: folders, topK: 4 });
  }

  const docs = retrieved.length
    ? formatRetrieved(retrieved)
    : "No targeted documents matched. Answer from general expertise but apply Section 2 (accuracy) rigorously and omit any citation you cannot verify.";

  const totalDocs = loadAllDocs().length;

  return `=== RETRIEVED KNOWLEDGE (RAG) ===
Classification: ${categories.join(", ")}
Searched folders: ${folders.join(", ")}
Retrieved ${retrieved.length} of ${totalDocs} indexed documents.
The doc bodies below are the source of truth. Quote their figures, dates
and citations verbatim. If the user asks something beyond these docs and
you are not fully confident, say so per Section 2.

${docs}
=== END RETRIEVED KNOWLEDGE ===`;
}

/**
 * Backwards-compatible RAG stub. The active retriever is `search()` in
 * `lib/rag/search.ts`; this wrapper preserves the older async signature
 * for callers that may want a uniform Promise-returning API once a true
 * vector store is added.
 */
export async function retrieveLegalChunks(
  query: string,
  topK = 5,
): Promise<Array<{ source: string; text: string; score: number; domain: string }>> {
  return search(query, { topK }).map(({ doc, score }) => ({
    source: doc.data.source ?? doc.path,
    text: doc.body,
    score,
    domain: doc.domain,
  }));
}
