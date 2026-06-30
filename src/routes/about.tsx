import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PublicFooter } from "@/components/public-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — HalfPace TaxGPT" },
      {
        name: "description",
        content:
          "HalfPace TaxGPT is an AI assistant focused on Indian taxation and compliance. Learn what we do and how we help.",
      },
      { property: "og:title", content: "About HalfPace TaxGPT" },
      { property: "og:description", content: "AI-powered guidance for Indian taxation and compliance." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-4 py-12">
          <h1>About HalfPace TaxGPT</h1>
          <p className="lead">
            India's AI Tax Expert — built to make Indian taxation and compliance
            understandable, in the language you actually speak.
          </p>
          <p>
            HalfPace TaxGPT answers questions across Income Tax, GST, TDS,
            Accounting, ROC &amp; MCA, Trademark, LLP &amp; Company Registration,
            MSME, Startup India, Professional Tax, Bookkeeping and Payroll.
          </p>
          <h2>Why we built it</h2>
          <p>
            Tax in India is complex. Most resources are either dense legal text or
            generic articles. HalfPace TaxGPT gives you direct answers, plain-language
            explanations, and a practical example — in English, Hindi, Urdu or
            Hinglish.
          </p>
          <h2>What it isn't</h2>
          <p>
            HalfPace TaxGPT is not a filing portal, ERP or CRM. It is a chat
            assistant for guidance and education. For specific decisions,
            penalties, or legal matters, please consult a qualified professional.
          </p>
          <p>
            <Link to="/contact">Get in touch</Link> or{" "}
            <Link to="/">start a conversation</Link>.
          </p>
        </article>
        <PublicFooter />
      </div>
    </AppShell>
  );
}
