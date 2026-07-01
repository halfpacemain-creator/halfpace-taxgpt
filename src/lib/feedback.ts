// Local feedback capture. Phase 4 will persist to Lovable Cloud.

export type FeedbackRating = "up" | "down";

export interface FeedbackEntry {
  id: string;
  threadId: string;
  messageId: string;
  rating: FeedbackRating;
  question: string;
  answer: string;
  createdAt: number;
}

const KEY = "halfpace-taxgpt:feedback:v1";
const isBrowser = () => typeof window !== "undefined";

function readAll(): FeedbackEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as FeedbackEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeAll(items: FeedbackEntry[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function getFeedback(messageId: string): FeedbackRating | null {
  return readAll().find((f) => f.messageId === messageId)?.rating ?? null;
}

export function setFeedback(entry: Omit<FeedbackEntry, "id" | "createdAt">) {
  const all = readAll().filter((f) => f.messageId !== entry.messageId);
  all.unshift({
    ...entry,
    id: `fb_${Date.now().toString(36)}`,
    createdAt: Date.now(),
  });
  writeAll(all);
}

export function clearFeedback(messageId: string) {
  writeAll(readAll().filter((f) => f.messageId !== messageId));
}
