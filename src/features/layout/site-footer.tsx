import Link from 'next/link';

import { OddslineLogo } from '@/components/shared/oddsline-logo';
import { getBoardStats } from '@/features/sportsbook/api';

export async function SiteFooter() {
  const stats = await getBoardStats();

  const kpis = [
    { label: 'Live events', value: stats.live },
    { label: 'Upcoming', value: stats.upcoming },
    { label: 'Open markets', value: stats.markets },
    { label: 'Sports covered', value: stats.sports },
  ] as const;

  return (
    <footer className="mt-auto border-t border-border bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 sm:py-12">
        <dl className="grid gap-8 border-b border-border pb-8 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="flex flex-col gap-1">
              <dt className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {kpi.label}
              </dt>
              <dd className="text-3xl font-semibold tracking-tight tabular-nums">
                {kpi.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex w-fit items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <OddslineLogo size={24} />
              Oddsline
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              Live sportsbook workspace — follow the board, build a slip, stay
              in control.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm sm:items-end">
            <p className="text-muted-foreground">
              Odds refresh every 1–3s on live boards
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 sm:justify-end">
              <Link
                href="/#markets"
                className="text-foreground underline-offset-4 hover:underline"
              >
                Markets
              </Link>
              <Link
                href="/sport/football"
                className="text-foreground underline-offset-4 hover:underline"
              >
                Football
              </Link>
              <a
                href="https://www.begambleaware.org/"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                BeGambleAware
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Demo product · 18+ only · Play responsibly
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
