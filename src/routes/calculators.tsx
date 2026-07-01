import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PublicFooter } from "@/components/public-footer";

export const Route = createFileRoute("/calculators")({
  head: () => ({
    meta: [
      { title: "Tax Calculators — HalfPace® TaxGPT" },
      {
        name: "description",
        content:
          "Coming soon: Income Tax, GST, HRA and TDS calculators for India.",
      },
    ],
  }),
  component: Calculators,
});

const PLANNED = [
  "Income Tax Calculator (Old vs New regime)",
  "GST Calculator",
  "HRA Exemption Calculator",
  "TDS Calculator",
  "Salary Take-home Calculator",
  "Capital Gains Calculator",
];

function Calculators() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl brand-gradient-bg text-white">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Tax Calculators
              </h1>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>

          <p className="mt-6 text-muted-foreground">
            We're building a suite of accurate Indian tax calculators. In the
            meantime, you can ask HalfPace® TaxGPT to walk you through any of
            these calculations conversationally.
          </p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {PLANNED.map((p) => (
              <li
                key={p}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm"
              >
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Ask the AI instead
            </Link>
          </div>
        </section>
        <PublicFooter />
      </div>
    </AppShell>
  );
}
