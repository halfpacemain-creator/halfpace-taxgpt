import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PublicFooter } from "@/components/public-footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — HalfPace TaxGPT" },
      { name: "description", content: "Terms governing the use of HalfPace TaxGPT." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-4 py-12">
          <h1>Terms of Use</h1>
          <p>Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
          <p>
            By using HalfPace TaxGPT you agree to these terms. The service is
            provided "as is" without warranties of any kind.
          </p>
          <h2>Informational only</h2>
          <p>
            HalfPace TaxGPT provides general informational guidance about Indian
            taxation and compliance. It does <strong>not</strong> constitute
            legal, tax or professional advice. AI responses may contain errors —
            always verify important matters with a qualified professional and
            official sources before acting.
          </p>
          <h2>Acceptable use</h2>
          <ul>
            <li>Don't use the service to engage in unlawful activity.</li>
            <li>Don't attempt to extract, copy or resell the underlying model.</li>
            <li>Don't submit personally identifiable information about third parties without their consent.</li>
          </ul>
          <h2>Liability</h2>
          <p>
            HalfPace and its team are not liable for any loss arising from
            reliance on AI-generated answers. Decisions based on responses are
            entirely the user's responsibility.
          </p>
        </article>
        <PublicFooter />
      </div>
    </AppShell>
  );
}
