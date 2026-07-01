/**
 * Lightweight keyword + metadata retriever.
 *
 * Scoring (simple and explainable):
 *   +5  per keyword (from front matter `keywords`) appearing in the query
 *   +3  per token from `title` appearing in the query
 *   +1  per query token appearing in `body` (capped per token at 3 hits)
 *   +2  if the doc's domain is in `preferredDomains`
 *   +1  freshness bonus if `effective_date` is within the current FY
 *
 * Returns top-k `KnowledgeDoc` records with their score. Designed to be
 * swapped wholesale for a vector retriever later — only this file changes.
 */
import { loadAllDocs, docsByDomain, type KnowledgeDoc } from "./loader";

export type RetrievedDoc = {
  doc: KnowledgeDoc;
  score: number;
};

const STOPWORDS = new Set([
  "the","a","an","of","to","in","on","for","is","are","what","how","when",
  "where","why","do","does","i","my","me","you","your","and","or","with",
  "be","by","at","as","this","that","it","from","please","kindly","tell",
  "explain","about","under","sec","section",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function countMatches(haystack: string, needle: string, cap = 3): number {
  if (!needle) return 0;
  const re = new RegExp(`\\b${needle.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\\\$&")}\\b`, "gi");
  const m = haystack.match(re);
  return Math.min(m?.length ?? 0, cap);
}

function freshnessBonus(effective?: string): number {
  if (!effective) return 0;
  const d = new Date(effective);
  if (isNaN(d.getTime())) return 0;
  const now = new Date();
  // Current Indian FY = April → March
  const fyStart = new Date(
    now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1,
    3,
    1,
  );
  return d >= fyStart ? 1 : 0;
}

export type SearchOptions = {
  preferredDomains?: string[];
  topK?: number;
  /** Hard-limit candidates to these domains. */
  domainsOnly?: string[];
};

export function search(
  query: string,
  { preferredDomains = [], topK = 5, domainsOnly }: SearchOptions = {},
): RetrievedDoc[] {
  const q = (query ?? "").trim();
  if (!q) return [];
  const tokens = tokenize(q);
  if (tokens.length === 0) return [];

  const pool = domainsOnly && domainsOnly.length
    ? domainsOnly.flatMap((d) => docsByDomain(d))
    : loadAllDocs();

  const preferred = new Set(preferredDomains.map((d) => d.replace(/_/g, "-")));

  const scored: RetrievedDoc[] = pool.map((doc) => {
    let score = 0;

    // keywords from front matter
    for (const kw of doc.data.keywords ?? []) {
      const k = kw.toLowerCase();
      if (tokens.includes(k) || q.toLowerCase().includes(k)) score += 5;
    }

    // title tokens
    for (const t of tokenize(doc.data.title ?? "")) {
      if (tokens.includes(t)) score += 3;
    }

    // body matches (per token, capped)
    for (const t of tokens) score += countMatches(doc.body, t);

    if (preferred.has(doc.domain)) score += 2;
    score += freshnessBonus(doc.data.effective_date);

    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/** Format retrieved docs for injection into the system prompt. */
export function formatRetrieved(retrieved: RetrievedDoc[]): string {
  if (retrieved.length === 0) return "";
  return retrieved
    .map(({ doc }, i) => {
      const d = doc.data;
      const meta = [
        d.source ? `Source: ${d.source}` : null,
        d.financial_year ? `FY: ${d.financial_year}` : null,
        d.effective_date ? `Effective: ${d.effective_date}` : null,
        d.version ? `v${d.version}` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      return `--- [DOC ${i + 1}] ${d.title} (${doc.domain})
${meta ? meta + "\n" : ""}${doc.body}`;
    })
    .join("\n\n");
}
