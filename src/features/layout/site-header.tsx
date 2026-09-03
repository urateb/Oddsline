import Link from 'next/link';

import { ThemeToggle } from '@/components/shared/theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        Oddsline
      </Link>
      <ThemeToggle />
    </header>
  );
}
