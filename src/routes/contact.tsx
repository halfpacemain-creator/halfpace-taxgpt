import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PublicFooter } from "@/components/public-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — HalfPace TaxGPT" },
      {
        name: "description",
        content: "Reach the HalfPace TaxGPT team for feedback, partnerships or support.",
      },
      { property: "og:title", content: "Contact HalfPace TaxGPT" },
      { property: "og:description", content: "Get in touch with the HalfPace TaxGPT team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-4 py-12">
          <h1>Contact</h1>
          <p>
            We'd love to hear from you. For product feedback, partnerships, or
            press, please write to{" "}
            <a href="mailto:hello@halfpace.in">hello@halfpace.in</a>.
          </p>
          <h2>Support</h2>
          <p>
            For help using HalfPace TaxGPT, describe your question in the chat —
            the assistant can guide you. For account or billing matters, email
            the same address.
          </p>
        </article>
        <PublicFooter />
      </div>
    </AppShell>
  );
}
