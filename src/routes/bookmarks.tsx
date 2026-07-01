import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Star, Trash2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { toggleBookmark, useBookmarks } from "@/lib/bookmarks";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks — HalfPace TaxGPT" },
      { name: "description", content: "Your saved HalfPace TaxGPT answers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const bookmarks = useBookmarks();

  return (
    <AppShell>
      <div className="mx-auto h-full w-full max-w-3xl overflow-y-auto px-4 py-6">
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
          <h1 className="text-xl font-semibold tracking-tight">Bookmarks</h1>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Tap the ⭐ below any AI response to save it here for quick reference.
        </p>

        {bookmarks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">You haven't saved any responses yet.</p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start a conversation
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {bookmarks.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Question
                    </div>
                    <div className="mt-0.5 line-clamp-2 text-sm font-medium text-foreground">
                      {b.question || "(untitled)"}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      to="/chat/$threadId"
                      params={{ threadId: b.threadId }}
                      aria-label="Open chat"
                      title="Open chat"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Remove bookmark"
                      title="Remove bookmark"
                      onClick={() =>
                        toggleBookmark({
                          threadId: b.threadId,
                          messageId: b.messageId,
                          question: b.question,
                          answer: b.answer,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 border-t border-border pt-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Answer
                  </div>
                  <p className="mt-1 line-clamp-6 whitespace-pre-wrap text-sm text-foreground/90">
                    {b.answer}
                  </p>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  Saved {new Date(b.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
