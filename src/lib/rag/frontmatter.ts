/**
 * Tiny YAML-front-matter parser — no external dependency.
 *
 * Supports a subset sufficient for HalfPace knowledge docs:
 *   ---
 *   title: ...
 *   category: income_tax
 *   source: Income-tax Act, 1961 — s.115BAC
 *   financial_year: FY 2024-25
 *   effective_date: 2024-04-01
 *   version: 1
 *   keywords: [new regime, slabs, 115BAC]
 *   ---
 *
 * Values may be plain strings, numbers, or bracketed comma-lists.
 * Quotes (single or double) around strings are stripped.
 */

export type DocFrontmatter = {
  title: string;
  category: string;
  source?: string;
  financial_year?: string;
  effective_date?: string;
  version?: string | number;
  keywords: string[];
  // anything else
  [k: string]: unknown;
};

const FM_RE = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;

function stripQuotes(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

function parseValue(raw: string): unknown {
  const v = raw.trim();
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => stripQuotes(s))
      .filter(Boolean);
  }
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return stripQuotes(v);
}

export function parseFrontmatter(input: string): {
  data: DocFrontmatter;
  body: string;
} {
  const m = input.match(FM_RE);
  if (!m) {
    return {
      data: { title: "Untitled", category: "general", keywords: [] },
      body: input,
    };
  }
  const yaml = m[1];
  const body = m[2] ?? "";

  const data: Record<string, unknown> = {};
  for (const line of yaml.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1);
    data[key] = parseValue(value);
  }

  const keywords = Array.isArray(data.keywords)
    ? (data.keywords as string[])
    : typeof data.keywords === "string"
      ? (data.keywords as string).split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  return {
    data: {
      title: (data.title as string) ?? "Untitled",
      category: (data.category as string) ?? "general",
      source: data.source as string | undefined,
      financial_year: data.financial_year as string | undefined,
      effective_date: data.effective_date as string | undefined,
      version: data.version as string | number | undefined,
      keywords,
      ...data,
    },
    body: body.trim(),
  };
}
