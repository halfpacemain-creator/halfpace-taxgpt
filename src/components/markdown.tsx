import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { buildWhatsAppUrl, openWhatsAppInNewTab } from "@/lib/whatsapp";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none break-words prose-p:leading-7 prose-p:my-3 prose-li:my-1 prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h2:mt-6 prose-h3:mt-5 prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-xl prose-pre:p-3 prose-pre:overflow-x-auto prose-code:before:hidden prose-code:after:hidden prose-table:text-sm prose-strong:text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className?.startsWith("language-");
            if (isInline) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="my-4 -mx-1 overflow-x-auto rounded-xl border border-border shadow-sm">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-muted/70">{children}</thead>;
          },
          tr({ children }) {
            return <tr className="even:bg-muted/30">{children}</tr>;
          },
          th({ children }) {
            return (
              <th className="border-b border-border px-3 py-2 text-left font-semibold whitespace-nowrap">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="border-b border-border px-3 py-2 align-top">{children}</td>;
          },
          ul({ children }) {
            return <ul className="my-3 list-disc space-y-1 pl-5 marker:text-primary/70">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="my-3 list-decimal space-y-1 pl-5 marker:text-primary/70 marker:font-semibold">{children}</ol>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-4 border-l-2 border-primary/40 bg-primary/5 px-4 py-2 text-foreground/90">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            const lowerHref = href?.toLowerCase() ?? "";
            const isWhatsAppHref =
              lowerHref.includes("wa.me") ||
              lowerHref.includes("whatsapp.com");
            const safeHref = isWhatsAppHref ? buildWhatsAppUrl() : href;
            return (
              <a
                href={safeHref}
                target="_blank"
                rel="noreferrer noopener"
                onClick={
                  isWhatsAppHref
                    ? (event) => {
                        event.preventDefault();
                        openWhatsAppInNewTab();
                      }
                    : undefined
                }
                className="text-primary underline underline-offset-2 break-words"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
