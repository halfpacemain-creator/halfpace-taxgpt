import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Beaker, Bot, Briefcase, Copyright, Scale, Phone, Mail } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PublicFooter } from "@/components/public-footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — HalfPace® TaxGPT" },
      { name: "description", content: "Terms governing the use of HalfPace® TaxGPT by HalfPace® Finance & Tax Consultants." },
    ],
  }),
  component: Terms,
});

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      <div className="mt-4 space-y-3 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

function Terms() {
  const updated = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_380px_at_50%_-20%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)]"
          />
          <div className="relative mx-auto max-w-3xl px-6 py-14 text-center">
            <h1 className="font-display text-4xl font-semibold tracking-tight">Terms of Use</h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
          </div>
        </section>

        <div className="mx-auto grid max-w-3xl gap-5 px-6 py-12">
          <Section icon={CheckCircle2} title="Acceptance">
            <p>
              By accessing or using HalfPace<sup className="reg-mark" aria-hidden>®</sup> TaxGPT, you agree to
              be bound by these Terms of Use. If you do not agree, please discontinue use of the platform.
            </p>
          </Section>

          <Section icon={Beaker} title="Beta Service">
            <p>
              HalfPace<sup className="reg-mark" aria-hidden>®</sup> TaxGPT is currently a Beta product.
              Features, responses and available knowledge may evolve and improve over time. Occasional
              downtime or changes to functionality may occur without prior notice.
            </p>
          </Section>

          <Section icon={Bot} title="AI Limitation">
            <p>
              The AI assistant may occasionally provide incomplete, outdated or inaccurate information.
              Users are responsible for verifying any output before acting on important tax decisions, filings
              or compliance matters.
            </p>
          </Section>

          <Section icon={Briefcase} title="Professional Advice">
            <p>
              Use of this chatbot does not create a client-consultant, attorney-client, or fiduciary
              relationship. For personalised advice, please engage with HalfPace<sup className="reg-mark" aria-hidden>®</sup>{" "}
              Finance &amp; Tax Consultants or another qualified professional.
            </p>
          </Section>

          <Section icon={Copyright} title="Intellectual Property">
            <p>
              HalfPace<sup className="reg-mark" aria-hidden>®</sup> is a registered trademark. All branding,
              content, design, software and underlying materials remain the exclusive property of
              HalfPace<sup className="reg-mark" aria-hidden>®</sup> Finance &amp; Tax Consultants. Unauthorised
              reproduction, redistribution or resale is prohibited.
            </p>
          </Section>

          <Section icon={Scale} title="Limitation of Liability">
            <p>
              The platform is provided on an "as is" and "as available" basis without warranties of any kind.
              To the maximum extent permitted by law, HalfPace<sup className="reg-mark" aria-hidden>®</sup> and
              its team shall not be liable for any direct, indirect, incidental or consequential loss arising
              from the use of, or reliance upon, AI-generated responses.
            </p>
          </Section>

          <Section icon={Mail} title="Contact">
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> <a href="tel:+917021402436" className="hover:text-foreground">7021402436</a></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> <a href="tel:+919987600927" className="hover:text-foreground">9987600927</a></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> <a href="mailto:ikaclients@gmail.com" className="hover:text-foreground">ikaclients@gmail.com</a></li>
            </ul>
          </Section>
        </div>

        <PublicFooter />
      </div>
    </AppShell>
  );
}
