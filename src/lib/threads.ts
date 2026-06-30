import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import type { UIMessage } from "ai";

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
}

const STORAGE_KEY = "halfpace-taxgpt:threads:v1";
const isBrowser = () => typeof window !== "undefined";

const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}

function readAll(): ChatThread[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeAll(threads: ChatThread[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    // ignore quota errors
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const handle = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  if (isBrowser()) window.addEventListener("storage", handle);
  return () => {
    listeners.delete(cb);
    if (isBrowser()) window.removeEventListener("storage", handle);
  };
}

export function useThreads() {
  // Stable snapshot ref so useSyncExternalStore doesn't loop.
  const snap = useRef<ChatThread[]>([]);
  const get = useCallback(() => {
    const next = readAll();
    // Only update ref when changed by JSON identity for stability.
    const prev = snap.current;
    if (prev.length !== next.length || JSON.stringify(prev) !== JSON.stringify(next)) {
      snap.current = next;
    }
    return snap.current;
  }, []);
  const getServer = useCallback(() => snap.current, []);
  return useSyncExternalStore(subscribe, get, getServer);
}

export function getThread(id: string): ChatThread | undefined {
  return readAll().find((t) => t.id === id);
}

export function createThread(id: string, title = "New chat"): ChatThread {
  const thread: ChatThread = { id, title, updatedAt: Date.now(), messages: [] };
  const all = readAll();
  if (!all.some((t) => t.id === id)) {
    writeAll([thread, ...all]);
  }
  return thread;
}

export function upsertThread(thread: ChatThread) {
  const all = readAll();
  const idx = all.findIndex((t) => t.id === thread.id);
  if (idx >= 0) {
    all[idx] = thread;
  } else {
    all.unshift(thread);
  }
  all.sort((a, b) => b.updatedAt - a.updatedAt);
  writeAll(all);
}

export function deleteThread(id: string) {
  writeAll(readAll().filter((t) => t.id !== id));
}

export function renameThread(id: string, title: string) {
  const all = readAll();
  const t = all.find((x) => x.id === id);
  if (!t) return;
  t.title = title;
  t.updatedAt = Date.now();
  writeAll(all);
}

export function clearAllThreads() {
  writeAll([]);
}

export function deriveTitle(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  if (!text) return "New chat";
  return text.length > 60 ? `${text.slice(0, 57)}…` : text;
}

export function newThreadId(): string {
  if (isBrowser() && "crypto" in window && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Persist a thread's messages whenever they settle (status becomes 'ready'
 * or 'error'), and also on first user message so the thread appears in
 * the sidebar immediately.
 */
export function usePersistThread(opts: {
  threadId: string;
  messages: UIMessage[];
  status: string;
}) {
  const { threadId, messages, status } = opts;
  useEffect(() => {
    if (!threadId || messages.length === 0) return;
    if (status === "submitted" || status === "streaming") return;
    upsertThread({
      id: threadId,
      title: deriveTitle(messages),
      updatedAt: Date.now(),
      messages,
    });
  }, [threadId, messages, status]);

  // Seed thread in sidebar as soon as the user sends their first message.
  useEffect(() => {
    if (!threadId || messages.length === 0) return;
    const existing = getThread(threadId);
    if (!existing) {
      upsertThread({
        id: threadId,
        title: deriveTitle(messages),
        updatedAt: Date.now(),
        messages,
      });
    }
  }, [threadId, messages.length]); // eslint-disable-line react-hooks/exhaustive-deps
}
