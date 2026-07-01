import { createFileRoute, Link } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PublicFooter } from "@/components/public-footer";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Latest Tax Updates — HalfPace® TaxGPT" },
      {
        name: "description",
        content:
          "Latest updates from CBDT, GSTN, MCA and the Government of India on tax and compliance.",
      },
    ],
  }),
  component: Updates,
});

function Updates() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl brand-gradient-bg text-white">
              <Newspaper className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Latest Tax Updates
              </h1>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>

          <p className="mt-6 text-muted-foreground">
            A curated feed of notifications, circulars and rule changes from
            CBDT, GSTN, MCA and the Government of India is in the works.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            For now, ask the assistant about any recent change — for example:
            <em> "What changed in GST in this year's Budget?"</em>
          </p>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Ask HalfPace® TaxGPT
            </Link>
          </div>
        </section>
        <PublicFooter />
      </div>
    </AppShell>
  );
}
