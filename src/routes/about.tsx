import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  ScrollText,
  Users,
  Building2,
  ShieldCheck,
  Smartphone,
  Zap,
  Award,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PublicFooter } from "@/components/public-footer";
import { openWhatsAppInNewTab } from "@/lib/whatsapp";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — HalfPace® TaxGPT" },
      {
        name: "description",
        content:
          "HalfPace® TaxGPT is India's intelligent tax & compliance assistant, powered by HalfPace® Finance & Tax Consultants.",
      },
      { property: "og:title", content: "About HalfPace® TaxGPT" },
      { property: "og:description", content: "AI-powered guidance for Indian taxation and compliance." },
    ],
  }),
  component: About,
});

const features = [
  { icon: Sparkles, title: "AI-powered Tax Assistant", text: "Instant answers grounded in Indian tax law." },
  { icon: ScrollText, title: "Latest Tax Law Guidance", text: "Aligned with the current Finance Act and GST rules." },
  { icon: Users, title: "Human Expert Support", text: "Escalate complex matters to our tax team." },
  { icon: Building2, title: "Business Compliance", text: "ROC, GST, TDS, MSME and startup filings." },
  { icon: ShieldCheck, title: "Secure & Confidential", text: "Your data stays on your device by default." },
  { icon: Smartphone, title: "Mobile Friendly", text: "Premium experience on phone, tablet and desktop." },
  { icon: Zap, title: "Fast Responses", text: "Streaming answers with clear structure." },
  { icon: Award, title: "Trusted Expertise", text: "Backed by practising tax consultants." },
];

const trustPoints = [
  "AI backed by professional tax expertise",
  "Built specifically for Indian tax and compliance",
  "Continuously updated with the latest laws and guidance",
  "Human expert support available when needed",
  "Secure handling of user information",
];

function About() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_50%_-10%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent)]"
          />
          <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              India's Intelligent Tax &amp; Compliance Assistant
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              HalfPace<sup className="reg-mark" aria-hidden>®</sup>{" "}
              <span className="brand-gradient-text">TaxGPT</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Powered by <span className="font-medium text-foreground">HalfPace<sup className="reg-mark" aria-hidden>®</sup> Finance &amp; Tax Consultants</span> —
              practical AI guidance for Indian individuals, professionals and businesses.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Start a Conversation
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur hover:bg-background"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>

        {/* About HalfPace */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                About HalfPace<sup className="reg-mark" aria-hidden>®</sup>
              </h2>
              <p className="mt-4 text-muted-foreground">
                HalfPace<sup className="reg-mark" aria-hidden>®</sup> Finance &amp; Tax Consultants is a professional
                tax and compliance consultancy dedicated to helping individuals, professionals and businesses
                navigate Indian taxation with confidence.
              </p>
              <p className="mt-3 text-muted-foreground">
                HalfPace<sup className="reg-mark" aria-hidden>®</sup> TaxGPT combines artificial intelligence with
                practical tax expertise to provide guidance on Income Tax, GST, TDS, Accounting, Company &amp;
                LLP Compliance, Trademark and Business Registrations.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold">Our Mission</h3>
              <p className="mt-3 text-muted-foreground">
                To simplify taxation and compliance through technology while providing practical, reliable and
                easy-to-understand guidance.
              </p>
            </div>
          </div>
        </section>

        {/* Why choose */}
        <section className="border-y border-border bg-muted/30 px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Why Choose HalfPace<sup className="reg-mark" aria-hidden>®</sup>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Built for accuracy, backed by professionals.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-foreground">{title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Trust */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/[0.06] via-background to-accent/[0.05] p-8 shadow-sm">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Why Trust HalfPace<sup className="reg-mark" aria-hidden>®</sup> TaxGPT?
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {trustPoints.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  Need personalised tax advice?
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Our professional team is ready to help.
                </p>
              </div>
              <div className="grid gap-3 text-sm">
                <a href="tel:+917021402436" className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 hover:bg-background">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">7021402436</span>
                  <span className="text-muted-foreground">· Call</span>
                </a>
                <a href="tel:+919987600927" className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 hover:bg-background">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">9987600927</span>
                  <span className="text-muted-foreground">· Call</span>
                </a>
                <a href="mailto:ikaclients@gmail.com" className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 hover:bg-background">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-medium">ikaclients@gmail.com</span>
                </a>
                <a href="https://www.halfpace.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 hover:bg-background">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="font-medium">www.halfpace.in</span>
                </a>
                <button
                  type="button"
                  onClick={() => openWhatsAppInNewTab("", "")}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1ebe5b] hover:shadow-md"
                >
                  <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
    </AppShell>
  );
}
