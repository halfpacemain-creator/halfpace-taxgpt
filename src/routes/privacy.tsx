import { createFileRoute } from "@tanstack/react-router";
import { Database, Cog, Lock, AlertTriangle, ShieldCheck, Phone, Mail } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PublicFooter } from "@/components/public-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — HalfPace® TaxGPT" },
      { name: "description", content: "How HalfPace® Finance & Tax Consultants handles your data on HalfPace® TaxGPT." },
    ],
  }),
  component: Privacy,
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

function Privacy() {
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
            <h1 className="font-display text-4xl font-semibold tracking-tight">Privacy Policy</h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
          </div>
        </section>

        <div className="mx-auto grid max-w-3xl gap-5 px-6 py-12">
          <Section icon={Database} title="Information We Collect">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Chat conversations you have with HalfPace<sup className="reg-mark" aria-hidden>®</sup> TaxGPT</li>
              <li>Contact details you voluntarily share (name, email, phone)</li>
              <li>Documents or images you upload for reference</li>
              <li>Anonymous usage analytics to improve the platform</li>
            </ul>
          </Section>

          <Section icon={Cog} title="How We Use Information">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Provide accurate AI responses to your queries</li>
              <li>Improve the underlying AI and knowledge base</li>
              <li>Deliver customer support when requested</li>
              <li>Enhance platform performance and reliability</li>
              <li>Comply with applicable legal obligations</li>
            </ul>
          </Section>

          <Section icon={Lock} title="Confidentiality">
            <p>
              Any tax-related information you share — whether in chat or as an uploaded document — is handled
              confidentially by HalfPace<sup className="reg-mark" aria-hidden>®</sup> Finance &amp; Tax
              Consultants and is used solely to help answer your query.
            </p>
          </Section>

          <Section icon={AlertTriangle} title="AI Disclaimer">
            <p>
              AI responses are informational only. Please obtain professional advice from a qualified
              Chartered Accountant or tax expert before acting on any important tax matter.
            </p>
          </Section>

          <Section icon={ShieldCheck} title="Data Security">
            <p>
              We apply reasonable technical and organisational safeguards to protect your information from
              unauthorised access, alteration or disclosure. Chat history is stored locally in your browser by
              default and can be cleared at any time.
            </p>
          </Section>

          <Section icon={Mail} title="Contact">
            <p className="text-foreground font-medium">HalfPace<sup className="reg-mark" aria-hidden>®</sup> Finance &amp; Tax Consultants</p>
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
