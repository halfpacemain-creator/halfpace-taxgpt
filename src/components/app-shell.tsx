import { Link, useRouterState } from "@tanstack/react-router";
import { MessageSquarePlus, Calculator, Newspaper, Info, Mail, Trash2, X } from "lucide-react";
import { useState } from "react";

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
  { to: "/calculators", label: "Tax Calculators", icon: Calculator },
  { to: "/updates", label: "Latest Tax Updates", icon: Newspaper },
  { to: "/about", label: "About HalfPace", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const threads = useThreads();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <Link to="/" onClick={onNavigate} className="min-w-0">
          <Logo />
        </Link>
      </div>

      <div className="px-3">
        <Link
          to="/chat/$threadId"
          params={{ threadId: newThreadId() }}
          onClick={onNavigate}
          className="flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent/70"
        >
          <MessageSquarePlus className="h-4 w-4 text-primary" />
          New chat
        </Link>
      </div>

      <div className="mt-5 flex-1 overflow-y-auto px-2 pb-4">
        {threads.length > 0 && (
          <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recent
          </div>
        )}
        <ul className="space-y-0.5">
          {threads.slice(0, 30).map((t) => {
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
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
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

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden w-72 shrink-0 border-r border-sidebar-border md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-sidebar-border bg-sidebar shadow-xl">
            <div className="flex justify-end p-2">
              <Button size="icon-sm" variant="ghost" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center justify-between border-b border-border px-3 md:hidden">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <Link
            to="/chat/$threadId"
            params={{ threadId: newThreadId() }}
            aria-label="New chat"
            className="rounded-md p-2 text-muted-foreground hover:text-foreground"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Link>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
