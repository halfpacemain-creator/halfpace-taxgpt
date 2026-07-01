/**
 * HalfPace TaxGPT — Site statistics provider.
 *
 * Modular adapter that returns the four homepage counters. Currently
 * returns zeros (no analytics wired). To plug in a real source later
 * (Google Analytics, Plausible, Cloud DB, etc.), implement a provider
 * with the same shape and swap it in `getStatsProvider()`.
 */

export type SiteStats = {
  visitors: number;
  conversations: number;
  queriesAnswered: number;
  betaUsers: number;
};

export interface StatsProvider {
  fetch(): Promise<SiteStats>;
}

/** Default provider — zeros until an analytics backend is connected. */
class ZeroStatsProvider implements StatsProvider {
  async fetch(): Promise<SiteStats> {
    return {
      visitors: 0,
      conversations: 0,
      queriesAnswered: 0,
      betaUsers: 0,
    };
  }
}

/**
 * Example future provider — kept as a stub for reference. Wire real
 * requests here once GA / a stats endpoint is available.
 *
 * class GoogleAnalyticsStatsProvider implements StatsProvider {
 *   async fetch(): Promise<SiteStats> { ... }
 * }
 */

let cachedProvider: StatsProvider | null = null;

export function getStatsProvider(): StatsProvider {
  if (!cachedProvider) cachedProvider = new ZeroStatsProvider();
  return cachedProvider;
}

/** Override the provider at runtime (tests, future GA integration). */
export function setStatsProvider(provider: StatsProvider) {
  cachedProvider = provider;
}

export async function fetchSiteStats(): Promise<SiteStats> {
  return getStatsProvider().fetch();
}
