import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, Globe, MessageCircle, Clock, MapPin } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PublicFooter } from "@/components/public-footer";
import { openWhatsAppInNewTab } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — HalfPace® TaxGPT" },
      {
        name: "description",
        content: "Reach the HalfPace® Finance & Tax Consultants team for expert tax and compliance help.",
      },
      { property: "og:title", content: "Contact HalfPace® TaxGPT" },
      { property: "og:description", content: "Talk to our tax experts by phone, email or WhatsApp." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_400px_at_50%_-20%,color-mix(in_oklab,var(--primary)_15%,transparent),transparent)]"
          />
          <div className="relative mx-auto max-w-5xl px-6 py-16 text-center">
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Get in touch
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              We're here for your tax, GST, compliance and business registration questions.
            </p>
          </div>
        </section>

        {/* Office details */}
        <section className="mx-auto max-w-5xl px-6 py-14">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-semibold">
                HalfPace<sup className="reg-mark" aria-hidden>®</sup> Finance &amp; Tax Consultants
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <a href="tel:+917021402436" className="group rounded-2xl border border-border bg-background/60 p-5 transition hover:-translate-y-0.5 hover:bg-background hover:shadow-md">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" /> Office
                </div>
                <div className="mt-2 text-lg font-semibold">7021402436</div>
                <div className="mt-1 text-sm text-muted-foreground">Tap to call</div>
              </a>
              <a href="tel:+919987600927" className="group rounded-2xl border border-border bg-background/60 p-5 transition hover:-translate-y-0.5 hover:bg-background hover:shadow-md">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" /> Office
                </div>
                <div className="mt-2 text-lg font-semibold">9987600927</div>
                <div className="mt-1 text-sm text-muted-foreground">Tap to call</div>
              </a>
              <a href="mailto:ikaclients@gmail.com" className="group rounded-2xl border border-border bg-background/60 p-5 transition hover:-translate-y-0.5 hover:bg-background hover:shadow-md">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" /> Email
                </div>
                <div className="mt-2 text-lg font-semibold">ikaclients@gmail.com</div>
                <div className="mt-1 text-sm text-muted-foreground">We reply within 24 hours</div>
              </a>
              <a href="https://www.halfpace.in" target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-border bg-background/60 p-5 transition hover:-translate-y-0.5 hover:bg-background hover:shadow-md">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Globe className="h-4 w-4 text-primary" /> Website
                </div>
                <div className="mt-2 text-lg font-semibold">www.halfpace.in</div>
                <div className="mt-1 text-sm text-muted-foreground">Visit our site</div>
              </a>
            </div>
          </div>
        </section>

        {/* Hours + Buttons */}
        <section className="mx-auto max-w-5xl px-6 pb-14">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">Office Hours</h3>
              </div>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <dt className="text-muted-foreground">Monday – Friday</dt>
                  <dd className="font-medium">9:45 AM – 7:00 PM</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Saturday &amp; Sunday</dt>
                  <dd className="font-medium">Closed</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="font-display text-lg font-semibold">Quick actions</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href="tel:+919987600927" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <button
                  type="button"
                  onClick={() => openWhatsAppInNewTab("", "")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1ebe5b] hover:shadow-md"
                >
                  <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} /> WhatsApp
                </button>
                <a href="mailto:ikaclients@gmail.com" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-muted">
                  <Mail className="h-4 w-4 text-primary" /> Email
                </a>
                <a href="https://www.halfpace.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-muted">
                  <Globe className="h-4 w-4 text-primary" /> Visit Website
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Support Notice */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6">
            <div className="text-sm font-semibold text-foreground">
              HalfPace<sup className="reg-mark" aria-hidden>®</sup> TaxGPT is currently in Beta
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              For urgent or complex tax matters, please contact our expert team directly.
              Expected response time: <span className="font-medium text-foreground">within 24 hours</span>.
            </p>
          </div>
        </section>

        <PublicFooter />
      </div>
    </AppShell>
  );
}
