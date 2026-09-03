import Link from 'next/link';

import { OddslineLogo } from '@/components/shared/oddsline-logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { BetSlipTrigger } from '@/features/bet-slip/bet-slip-panel';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-background/60 sm:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold tracking-tight"
      >
        <OddslineLogo size={28} />
        <span>Oddsline</span>
      </Link>
      <div className="flex items-center gap-2">
        <BetSlipTrigger />
        <ThemeToggle />
      </div>
    </header>
  );
}
