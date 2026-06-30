import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:text-foreground prose-code:before:hidden prose-code:after:hidden prose-headings:font-semibold prose-table:text-sm">
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
              <div className="my-4 overflow-x-auto rounded-lg border border-border">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-border bg-muted px-3 py-2 text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="border-b border-border px-3 py-2 align-top">{children}</td>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary underline underline-offset-2"
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
