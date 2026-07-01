import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Copy,
  ExternalLink,
  MessageSquarePlus,
  Pin,
  PinOff,
  Search,
  Share2,
  Star,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { ErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import {
  deleteBookmark,
  togglePin,
  useBookmarks,
  type Bookmark,
  type BookmarkCategory,
} from "@/lib/bookmarks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks — HalfPace® TaxGPT" },
      { name: "description", content: "Your saved HalfPace® TaxGPT answers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookmarksRoute,
});

function BookmarksRoute() {
  return (
    <AppShell>
      <ErrorBoundary>
        <BookmarksPage />
      </ErrorBoundary>
    </AppShell>
  );
}

const CATEGORIES: (BookmarkCategory | "All")[] = [
  "All",
  "Income Tax",
  "GST",
  "TDS",
  "ROC/MCA",
  "Trademark",
  "Accounting",
  "Payroll",
  "Startup/MSME",
  "General",
];

function BookmarksPage() {
  const bookmarks = useBookmarks();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<BookmarkCategory | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = bookmarks.filter((b) => {
      if (cat !== "All" && b.category !== cat) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.question.toLowerCase().includes(q) ||
        b.answer.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.createdAt - a.createdAt;
    });
  }, [bookmarks, query, cat]);

  return (
    <div className="mx-auto h-full w-full max-w-3xl overflow-y-auto px-4 py-6">
      <header className="mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
        <h1 className="text-xl font-semibold tracking-tight">Bookmarks</h1>
        <span className="ml-auto text-xs text-muted-foreground">
          {bookmarks.length} saved
        </span>
      </header>

      {bookmarks.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-3 space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bookmarks…"
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs transition-colors",
                    cat === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No bookmarks match your filters.
            </div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((b) => (
                <BookmarkCard key={b.id} b={b} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
        <Star className="h-6 w-6 text-amber-500" />
      </div>
      <h2 className="text-base font-semibold">No Bookmarked Responses Yet</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Save important AI responses using the ⭐ Bookmark button and they'll appear here.
      </p>
      <Link
        to="/"
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Start a New Chat
      </Link>
    </div>
  );
}

function BookmarkCard({ b }: { b: Bookmark }) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(b.answer);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };
  const onShare = async () => {
    const data = { title: b.title, text: `Q: ${b.question}\n\nA: ${b.answer}` };
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share(data);
        return;
      }
    } catch {
      /* fall through */
    }
    try {
      await navigator.clipboard.writeText(data.text);
      toast.success("Copied — ready to share");
    } catch {
      toast.error("Could not share");
    }
  };
  const onDelete = () => {
    if (confirm("Delete this bookmark?")) {
      deleteBookmark(b.id);
      toast.success("Bookmark deleted");
    }
  };

  const when = new Date(b.createdAt);
  const whenLabel = Number.isFinite(when.getTime())
    ? when.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
    : "";

  return (
    <li
      className={cn(
        "rounded-2xl border bg-card p-4 shadow-sm transition-colors",
        b.pinned ? "border-primary/40 bg-primary/[0.02]" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
              {b.category}
            </span>
            {b.pinned && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-amber-600">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            )}
            {whenLabel && (
              <span className="text-[11px] text-muted-foreground">{whenLabel}</span>
            )}
          </div>
          <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold text-foreground">
            {b.title}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {b.threadId && (
            <Link
              to="/chat/$threadId"
              params={{ threadId: b.threadId }}
              aria-label="Open chat"
              title="Open chat"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {b.answer && (
        <p className="mt-3 line-clamp-5 whitespace-pre-wrap border-t border-border pt-3 text-sm text-foreground/90">
          {b.answer}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1 text-muted-foreground">
        <IconBtn label="Copy" onClick={onCopy}>
          <Copy className="h-3.5 w-3.5" />
        </IconBtn>
        <IconBtn label="Share" onClick={onShare}>
          <Share2 className="h-3.5 w-3.5" />
        </IconBtn>
        <IconBtn
          label={b.pinned ? "Unpin" : "Pin to top"}
          onClick={() => togglePin(b.id)}
          active={b.pinned}
        >
          {b.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
        </IconBtn>
        <IconBtn label="Delete" onClick={onDelete} destructive>
          <Trash2 className="h-3.5 w-3.5" />
        </IconBtn>
      </div>
    </li>
  );
}

function IconBtn({
  label,
  onClick,
  active,
  destructive,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  destructive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "h-8 w-8",
        active && "text-amber-600",
        destructive && "hover:text-destructive",
      )}
    >
      {children}
    </Button>
  );
}
