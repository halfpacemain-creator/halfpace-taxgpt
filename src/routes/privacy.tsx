import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PublicFooter } from "@/components/public-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — HalfPace TaxGPT" },
      { name: "description", content: "How HalfPace TaxGPT handles your data." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-2xl px-4 py-12">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
          <p>
            HalfPace TaxGPT is built with privacy in mind. For the current MVP,
            your conversations are stored only in your browser's local storage
            and are not synced to our servers.
          </p>
          <h2>What we collect</h2>
          <ul>
            <li><strong>Chat content:</strong> your messages are sent to our AI provider to generate responses. They are not used to identify you personally.</li>
            <li><strong>Local storage:</strong> chat history is saved on your device only. Clearing your browser data deletes it.</li>
            <li><strong>Analytics:</strong> we may collect anonymous usage analytics to improve the product.</li>
          </ul>
          <h2>What we don't do</h2>
          <ul>
            <li>We don't sell your data.</li>
            <li>We don't share your chats with third parties beyond the AI provider needed to generate a response.</li>
          </ul>
          <h2>Contact</h2>
          <p>
            Questions? Email <a href="mailto:hello@halfpace.in">hello@halfpace.in</a>.
          </p>
        </article>
        <PublicFooter />
      </div>
    </AppShell>
  );
}
