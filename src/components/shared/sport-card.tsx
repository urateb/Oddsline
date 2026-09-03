import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Sport } from '@/types/sportsbook';

export interface SportCardProps {
  /** Sport to render (icon, name, live/upcoming counts). Links to `/sport/[slug]`. */
  sport: Sport;
  /** Layout overrides. */
  className?: string;
}

const ICON_WELL: Record<string, string> = {
  football:
    'bg-emerald-500/10 text-emerald-700 ring-emerald-500/15 dark:text-emerald-300',
  basketball:
    'bg-orange-500/10 text-orange-700 ring-orange-500/15 dark:text-orange-300',
  tennis: 'bg-lime-500/10 text-lime-700 ring-lime-500/15 dark:text-lime-300',
  'ice-hockey':
    'bg-sky-500/10 text-sky-700 ring-sky-500/15 dark:text-sky-300',
  cricket:
    'bg-teal-500/10 text-teal-700 ring-teal-500/15 dark:text-teal-300',
  esports:
    'bg-violet-500/10 text-violet-700 ring-violet-500/15 dark:text-violet-300',
};

export function SportCard({ sport, className }: SportCardProps) {
  const hasLive = sport.liveEventCount > 0;
  const wellClass =
    ICON_WELL[sport.slug] ?? 'bg-muted text-foreground ring-border/60';

  return (
    <Link
      href={`/sport/${sport.slug}`}
      aria-label={`View ${sport.name} events — ${sport.liveEventCount} live, ${sport.upcomingEventCount} upcoming`}
      className={cn(
        'group flex items-center gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-3 shadow-xs transition-[border-color,background-color,box-shadow]',
        'hover:border-primary/35 hover:bg-accent/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg text-lg ring-1',
          wellClass,
        )}
        aria-hidden="true"
      >
        {sport.icon}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold tracking-tight">
            {sport.name}
          </span>
          {hasLive && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
              <span className="size-1 rounded-full bg-red-500" aria-hidden="true" />
              Live
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
          {sport.liveEventCount} live · {sport.upcomingEventCount} upcoming
        </p>
      </div>

      <ChevronRight
        className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
        aria-hidden="true"
      />
    </Link>
  );
}
