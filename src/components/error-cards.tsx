import { MessageCircle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ErrorKind } from "@/lib/error-messages";
import { buildWhatsAppUrl, openWhatsAppInNewTab } from "@/lib/whatsapp";

const WHATSAPP_URL = buildWhatsAppUrl();

export function QuotaLimitCard({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <div className="mt-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-[#14B8A6]/[0.06] p-5 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">
        Daily AI Usage Limit Reached
      </h3>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
        <p>Thank you for using HalfPace TaxGPT.</p>
        <p>We've reached today's free AI usage limit for this service.</p>
        <p>
          Please try again later, or continue your query with our expert team on
          WhatsApp.
        </p>
        <p>
          WhatsApp:{" "}
          <span className="font-medium text-foreground">+91 99876 00927</span>
        </p>
        <p className="text-xs">
          HalfPace TaxGPT is currently in{" "}
          <span className="font-medium text-foreground">Beta</span>. We appreciate
          your patience and support.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            event.preventDefault();
            openWhatsAppInNewTab();
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5b] hover:shadow-md"
        >
          <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
          Continue on WhatsApp
        </a>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
}

export function GenericErrorCard({
  onRetry,
  onDismiss,
}: {
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <div className="mt-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">
        Something went wrong
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        We couldn't process your request right now. Please try again in a
        moment. If the issue continues, our team is available on WhatsApp.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {onRetry && (
          <Button size="sm" onClick={onRetry} className="gap-2">
            <RefreshCcw className="h-3.5 w-3.5" />
            Try again
          </Button>
        )}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            event.preventDefault();
            openWhatsAppInNewTab();
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
        >
          <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
          Chat on WhatsApp
        </a>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
}

export function ChatErrorDisplay({
  kind,
  onRetry,
  onDismiss,
}: {
  kind: ErrorKind;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  if (kind === "quota" || kind === "rate_limit") {
    return <QuotaLimitCard onDismiss={onDismiss} />;
  }
  return <GenericErrorCard onRetry={onRetry} onDismiss={onDismiss} />;
}
