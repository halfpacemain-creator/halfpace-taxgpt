import { Link, useRouterState } from "@tanstack/react-router";
import {
  MessageSquarePlus,
  Calculator,
  Newspaper,
  Info,
  Mail,
  Trash2,
  X,
  Menu,
  History,
  Settings,
  Search,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { FloatingAction } from "@/components/floating-action";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  clearAllThreads,
  deleteThread,
  newThreadId,
  useThreads,
} from "@/lib/threads";
import { cn } from "@/lib/utils";

const staticLinks = [
  { to: "/bookmarks", label: "Bookmarks", icon: Star },
  { to: "/calculators", label: "Tax Calculators", icon: Calculator },
  { to: "/updates", label: "Latest Tax Updates", icon: Newspaper },
  { to: "/about", label: "About HalfPace", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const threads = useThreads();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [query, setQuery] = useState("");

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter((t) => {
      if (t.title.toLowerCase().includes(q)) return true;
      return t.messages.some((m) =>
        m.parts.some((p) => p.type === "text" && p.text.toLowerCase().includes(q)),
      );
    });
  }, [threads, query]);

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <Link to="/" onClick={onNavigate} className="min-w-0">
          <Logo />
        </Link>
      </div>

      <div className="space-y-2 px-3">
        <Link
          to="/chat/$threadId"
          params={{ threadId: newThreadId() }}
          onClick={onNavigate}
          className="flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent/70"
        >
          <MessageSquarePlus className="h-4 w-4 text-primary" />
          New chat
        </Link>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats…"
            aria-label="Search chats"
            className="w-full rounded-lg border border-sidebar-border bg-background/60 py-2 pl-8 pr-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-2 pb-4">
        {threads.length > 0 && (
          <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {query ? `Results (${filteredThreads.length})` : "Recent"}
          </div>
        )}
        {query && filteredThreads.length === 0 && (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            No chats match "{query}".
          </div>
        )}
        <ul className="space-y-0.5">
          {filteredThreads.slice(0, 50).map((t) => {
            const active = path === `/chat/${t.id}`;
            return (
              <li key={t.id} className="group relative">
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  onClick={onNavigate}
                  className={cn(
                    "block truncate rounded-md px-3 py-2 pr-8 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                  )}
                  title={t.title}
                >
                  {t.title}
                </Link>
                <button
                  type="button"
                  aria-label={`Delete ${t.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (confirm(`Delete chat "${t.title}"?`)) deleteThread(t.id);
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>

        {threads.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear all chats? This cannot be undone.")) clearAllThreads();
            }}
            className="mt-3 w-full rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
          >
            Clear all chats
          </button>
        )}

        <div className="mt-6 space-y-0.5">
          {staticLinks.map((l) => {
            const Icon = l.icon;
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                )}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-sidebar-border px-4 py-3 text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} HalfPace TaxGPT
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Close drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [path]);

  // Body scroll lock while drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden w-72 shrink-0 border-r border-sidebar-border md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-sidebar-border bg-sidebar shadow-2xl animate-in slide-in-from-left safe-pt safe-pb safe-pl">
            <div className="flex justify-end p-2">
              <Button size="icon-sm" variant="ghost" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar — sticky, compact, safe-area aware */}
        <header
          className="sticky top-0 z-20 flex h-12 items-center justify-between gap-1 border-b border-border bg-background/85 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/70 safe-pt safe-pl safe-pr md:hidden"
        >
          <div className="flex min-w-0 items-center gap-1">
            <Button
              size="icon-sm"
              variant="ghost"
              className="h-10 w-10"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="min-w-0 truncate">
              <Logo size="sm" />
            </Link>
          </div>
          <div className="flex items-center gap-0.5">
            <Link
              to="/chat/$threadId"
              params={{ threadId: newThreadId() }}
              aria-label="New chat"
              title="New chat"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <MessageSquarePlus className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Chat history"
              title="History"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <History className="h-5 w-5" />
            </button>
            <Link
              to="/about"
              aria-label="Settings"
              title="Settings"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </header>

        <main className="relative min-h-0 flex-1 overflow-hidden">
          {children}
          <FloatingAction />
        </main>
      </div>
    </div>
  );
}
