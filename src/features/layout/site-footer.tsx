import Link from 'next/link';

import { OddslineLogo } from '@/components/shared/oddsline-logo';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:gap-12">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex w-fit items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <OddslineLogo size={24} />
              Oddsline
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Live sportsbook workspace — follow the board, build a slip, stay
              in control.
            </p>
            <p className="text-xs text-muted-foreground">
              Odds refresh every 1–3s on live boards
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:justify-items-start">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                Explore
              </p>
              <nav className="flex flex-col gap-2 text-sm">
                <Link
                  href="/#markets"
                  className="w-fit text-foreground underline-offset-4 hover:underline"
                >
                  Markets
                </Link>
                <Link
                  href="/sport/football"
                  className="w-fit text-foreground underline-offset-4 hover:underline"
                >
                  Football
                </Link>
              </nav>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                Support
              </p>
              <nav className="flex flex-col gap-2 text-sm">
                <a
                  href="https://www.begambleaware.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit text-foreground underline-offset-4 hover:underline"
                >
                  BeGambleAware
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            Demo product · 18+ only · Play responsibly
          </p>
        </div>
      </div>
    </footer>
  );
}
