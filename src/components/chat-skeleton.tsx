export function ChatSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="hp-shimmer h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="hp-shimmer h-3 w-1/3 rounded" />
            <div className="hp-shimmer h-3 w-11/12 rounded" />
            <div className="hp-shimmer h-3 w-10/12 rounded" />
            <div className="hp-shimmer h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
