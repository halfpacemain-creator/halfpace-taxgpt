import { useEffect, useRef, useState } from "react";
import { Users, MessageSquare, BookOpen, Star } from "lucide-react";

import { fetchSiteStats, type SiteStats } from "@/lib/analytics-stats";

type StatDef = {
  key: keyof SiteStats;
  label: string;
  icon: typeof Users;
  emoji: string;
};

const STATS: StatDef[] = [
  { key: "visitors", label: "Visitors", icon: Users, emoji: "👥" },
  { key: "conversations", label: "AI Conversations", icon: MessageSquare, emoji: "💬" },
  { key: "queriesAnswered", label: "Tax Queries Answered", icon: BookOpen, emoji: "📚" },
  { key: "betaUsers", label: "Beta Users", icon: Star, emoji: "⭐" },
];

const DURATION = 1400;

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return new Intl.NumberFormat("en-IN").format(n);
}

function useAnimatedCount(target: number, start: boolean): number {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const from = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, start]);

  return value;
}

function StatCard({ stat, value, start }: { stat: StatDef; value: number; start: boolean }) {
  const animated = useAnimatedCount(value, start);
  const Icon = stat.icon;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-70 blur-2xl transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.18), transparent 70%)",
        }}
      />
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-lg" aria-hidden>
          {stat.emoji}
        </span>
      </div>
      <div className="mt-4 text-3xl font-bold tracking-tight tabular-nums text-foreground">
        {formatNumber(animated)}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
    </div>
  );
}

export function StatsSection() {
  const [data, setData] = useState<SiteStats | null>(null);

  useEffect(() => {
    let mounted = true;
    void fetchSiteStats().then((s) => {
      if (mounted) setData(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16" aria-labelledby="stats-heading">
      <div className="mb-6 text-center">
        <h2 id="stats-heading" className="text-xl font-semibold tracking-tight md:text-2xl">
          Trusted by taxpayers across India
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live usage of HalfPace<sup className="reg-mark" aria-hidden>®</sup> TaxGPT
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {STATS.map((s) => (
          <StatCard
            key={s.key}
            stat={s}
            value={data?.[s.key] ?? 0}
            start={data !== null}
          />
        ))}
      </div>
    </section>
  );
}
