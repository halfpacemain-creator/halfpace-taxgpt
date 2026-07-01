import { useCallback, useRef, useSyncExternalStore } from "react";

export type BookmarkCategory =
  | "GST"
  | "Income Tax"
  | "TDS"
  | "ROC/MCA"
  | "Trademark"
  | "Accounting"
  | "Payroll"
  | "Startup/MSME"
  | "General";

export interface Bookmark {
  id: string;
  threadId: string;
  messageId: string;
  question: string;
  answer: string;
  title: string;
  category: BookmarkCategory;
  pinned: boolean;
  createdAt: number;
}

const KEY = "halfpace-taxgpt:bookmarks:v1";
const isBrowser = () => typeof window !== "undefined";
const isDev =
  typeof process !== "undefined" && process.env?.NODE_ENV !== "production";

const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}

function log(...args: unknown[]) {
  if (isDev) console.log("[bookmarks]", ...args);
}

function detectCategory(text: string): BookmarkCategory {
  const t = (text || "").toLowerCase();
  if (/\b(gst|gstr|itc|input tax credit|hsn|composition)\b/.test(t)) return "GST";
  if (/\b(tds|tcs|section\s*19[24]|form\s*16|26q|24q)\b/.test(t)) return "TDS";
  if (/\b(roc|mca|dir[-\s]?3|aoc[-\s]?4|mgt[-\s]?7|company registration|llp|din)\b/.test(t))
    return "ROC/MCA";
  if (/\b(trademark|tm|class\s*\d+|intellectual property|ipr)\b/.test(t)) return "Trademark";
  if (/\b(payroll|salary|pf|epf|esi|gratuity|professional tax|ptrc)\b/.test(t)) return "Payroll";
  if (/\b(startup india|msme|udyam|dpiit)\b/.test(t)) return "Startup/MSME";
  if (/\b(bookkeeping|journal|ledger|depreciation|balance sheet|p&l|accounting)\b/.test(t))
    return "Accounting";
  if (
    /\b(income tax|itr|80c|80d|section\s*\d+|old regime|new regime|advance tax|capital gain|slab)\b/.test(
      t,
    )
  )
    return "Income Tax";
  return "General";
}

function deriveTitle(question: string): string {
  const q = (question || "").trim().replace(/\s+/g, " ");
  if (!q) return "Untitled bookmark";
  return q.length > 70 ? `${q.slice(0, 67)}…` : q;
}

function isValid(b: unknown): b is Bookmark {
  if (!b || typeof b !== "object") return false;
  const x = b as Record<string, unknown>;
  return (
    typeof x.id === "string" &&
    typeof x.messageId === "string" &&
    typeof x.answer === "string"
  );
}

function normalize(raw: Partial<Bookmark> & { question?: string; answer?: string }): Bookmark {
  const question = String(raw.question ?? "");
  const answer = String(raw.answer ?? "");
  return {
    id: String(raw.id ?? `bm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`),
    threadId: String(raw.threadId ?? ""),
    messageId: String(raw.messageId ?? raw.id ?? ""),
    question,
    answer,
    title: typeof raw.title === "string" && raw.title.trim() ? raw.title : deriveTitle(question),
    category: (raw.category as BookmarkCategory) ?? detectCategory(`${question} ${answer}`),
    pinned: Boolean(raw.pinned),
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : Date.now(),
  };
}

function readAll(): Bookmark[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      log("corrupted (not array) — resetting");
      window.localStorage.setItem(KEY, "[]");
      return [];
    }
    const cleaned = parsed
      .filter((x) => x && typeof x === "object")
      .map((x) => normalize(x as Partial<Bookmark>))
      .filter(isValid);
    // Migrate silently if shape changed.
    if (cleaned.length !== parsed.length) {
      window.localStorage.setItem(KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (err) {
    log("read failed — resetting", err);
    try {
      window.localStorage.setItem(KEY, "[]");
    } catch {
      /* ignore */
    }
    return [];
  }
}

function writeAll(items: Bookmark[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch (err) {
    log("write failed", err);
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const handle = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  if (isBrowser()) window.addEventListener("storage", handle);
  return () => {
    listeners.delete(cb);
    if (isBrowser()) window.removeEventListener("storage", handle);
  };
}

export function isBookmarked(messageId: string): boolean {
  return readAll().some((b) => b.messageId === messageId);
}

export function toggleBookmark(
  input: {
    threadId: string;
    messageId: string;
    question: string;
    answer: string;
  },
): boolean {
  const all = readAll();
  const existing = all.find((x) => x.messageId === input.messageId);
  if (existing) {
    writeAll(all.filter((x) => x.messageId !== input.messageId));
    return false;
  }
  writeAll([normalize(input), ...all]);
  return true;
}

export function deleteBookmark(id: string) {
  writeAll(readAll().filter((b) => b.id !== id));
}

export function togglePin(id: string) {
  writeAll(readAll().map((b) => (b.id === id ? { ...b, pinned: !b.pinned } : b)));
}

export function clearAllBookmarks() {
  writeAll([]);
}

const EMPTY: Bookmark[] = [];

export function useBookmarks(): Bookmark[] {
  // Cache snapshot so useSyncExternalStore does not loop.
  const snap = useRef<Bookmark[]>(EMPTY);
  const get = useCallback(() => {
    const next = readAll();
    const prev = snap.current;
    if (
      prev.length !== next.length ||
      JSON.stringify(prev) !== JSON.stringify(next)
    ) {
      snap.current = next;
    }
    return snap.current;
  }, []);
  const getServer = useCallback(() => EMPTY, []);
  return useSyncExternalStore(subscribe, get, getServer);
}
