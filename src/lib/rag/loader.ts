/**
 * Build-time loader for HalfPace knowledge documents.
 *
 * Reads every Markdown file under `src/knowledge/<domain>/*.md`, parses its
 * YAML front matter, and exposes a flat list of `KnowledgeDoc` records.
 *
 * Uses Vite's `import.meta.glob` with `?raw` so all docs are bundled into
 * the server build — no filesystem access at request time. Adding a new
 * file is enough; no registry to update.
 *
 * When a real vector store is added later, the same `KnowledgeDoc[]` feeds
 * the embedding pipeline; only `search.ts` swaps implementation.
 */
import { parseFrontmatter, type DocFrontmatter } from "./frontmatter";

export type KnowledgeDoc = {
  id: string; // path-derived stable id
  path: string; // /src/knowledge/<domain>/<file>.md
  domain: string; // folder name (income-tax, gst, ...)
  data: DocFrontmatter;
  body: string;
};

const RAW = import.meta.glob("/src/knowledge/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function domainFromPath(path: string): string {
  // /src/knowledge/income-tax/foo.md -> income-tax
  const parts = path.split("/");
  const i = parts.indexOf("knowledge");
  return i >= 0 && parts[i + 1] ? parts[i + 1] : "general";
}

let cached: KnowledgeDoc[] | null = null;

export function loadAllDocs(): KnowledgeDoc[] {
  if (cached) return cached;
  const docs: KnowledgeDoc[] = [];
  for (const [path, raw] of Object.entries(RAW)) {
    const { data, body } = parseFrontmatter(raw);
    const domain = data.category || domainFromPath(path);
    docs.push({
      id: path.replace(/^.*\/knowledge\//, "").replace(/\.md$/, ""),
      path,
      domain: domain.replace(/_/g, "-"),
      data,
      body,
    });
  }
  cached = docs;
  return docs;
}

export function docsByDomain(domain: string): KnowledgeDoc[] {
  const normalized = domain.replace(/_/g, "-");
  return loadAllDocs().filter((d) => d.domain === normalized);
}
