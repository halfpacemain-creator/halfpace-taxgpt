import { useSyncExternalStore } from "react";

export interface Bookmark {
  id: string;
  threadId: string;
  messageId: string;
  question: string;
  answer: string;
  createdAt: number;
}

const KEY = "halfpace-taxgpt:bookmarks:v1";
const isBrowser = () => typeof window !== "undefined";
const listeners = new Set<() => void>();

function readAll(): Bookmark[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Bookmark[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeAll(items: Bookmark[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
  for (const l of listeners) l();
}

export function isBookmarked(messageId: string): boolean {
  return readAll().some((b) => b.messageId === messageId);
}

export function toggleBookmark(b: Omit<Bookmark, "id" | "createdAt">): boolean {
  const all = readAll();
  const existing = all.find((x) => x.messageId === b.messageId);
  if (existing) {
    writeAll(all.filter((x) => x.messageId !== b.messageId));
    return false;
  }
  writeAll([
    { ...b, id: `bm_${Date.now().toString(36)}`, createdAt: Date.now() },
    ...all,
  ]);
  return true;
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

export function useBookmarks(): Bookmark[] {
  return useSyncExternalStore(subscribe, readAll, () => []);
}
