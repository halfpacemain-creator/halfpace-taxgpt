// Sentinels surfaced from the API route. Never leak provider names,
// stack traces, or quota details to end users. The server logs the
// real error; the client only receives one of these sentinels.

export const ERROR_SENTINELS = {
  QUOTA: "__HP_QUOTA_EXCEEDED__",
  RATE_LIMIT: "__HP_RATE_LIMIT__",
  GENERIC: "__HP_GENERIC_ERROR__",
} as const;

export type ErrorKind = "quota" | "rate_limit" | "generic";

export function classifyProviderError(err: unknown): ErrorKind {
  const e = err as { status?: number; statusCode?: number; message?: string; code?: string } | undefined;
  const status = e?.status ?? e?.statusCode;
  const raw = `${e?.message ?? ""} ${e?.code ?? ""}`.toLowerCase();

  const quotaSignals = [
    "quota",
    "resource_exhausted",
    "resource has been exhausted",
    "insufficient_quota",
    "billing",
    "exceeded your current",
    "credits exhausted",
    "402",
  ];
  if (quotaSignals.some((s) => raw.includes(s))) return "quota";
  if (status === 402) return "quota";

  const rateSignals = ["rate limit", "rate_limit", "too many requests"];
  if (rateSignals.some((s) => raw.includes(s))) return "rate_limit";
  if (status === 429) {
    // 429 from Gemini often means daily free-tier quota exhausted rather
    // than a burst rate limit. Treat as quota to guide users to WhatsApp.
    return "quota";
  }

  return "generic";
}

export function sentinelFor(kind: ErrorKind): string {
  if (kind === "quota") return ERROR_SENTINELS.QUOTA;
  if (kind === "rate_limit") return ERROR_SENTINELS.RATE_LIMIT;
  return ERROR_SENTINELS.GENERIC;
}

export function detectErrorKind(message: string | undefined): ErrorKind | null {
  if (!message) return null;
  if (message.includes(ERROR_SENTINELS.QUOTA)) return "quota";
  if (message.includes(ERROR_SENTINELS.RATE_LIMIT)) return "rate_limit";
  if (message.includes(ERROR_SENTINELS.GENERIC)) return "generic";
  return null;
}
