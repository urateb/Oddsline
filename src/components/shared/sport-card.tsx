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
    ICON_WELL[sport.slug] ??
    'bg-muted text-foreground ring-border/60';

  return (
    <Link
      href={`/sport/${sport.slug}`}
      aria-label={`View ${sport.name} events — ${sport.liveEventCount} live, ${sport.upcomingEventCount} upcoming`}
      className={cn(
        'group flex h-full items-center gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-xs transition-[border-color,background-color,box-shadow,transform]',
        'hover:border-primary/40 hover:bg-accent/40 hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl ring-1',
          wellClass,
        )}
        aria-hidden="true"
      >
        {sport.icon}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="truncate text-base font-semibold tracking-tight">
            {sport.name}
          </span>
          {hasLive && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
              <span className="relative flex size-1.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-red-500" />
              </span>
              Live
            </span>
          )}
        </div>

        <dl className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <dt className="sr-only">Live events</dt>
            <dd>
              <span className="tabular-nums font-medium text-foreground">
                {sport.liveEventCount}
              </span>{' '}
              live
            </dd>
          </div>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <div className="flex items-center gap-1">
            <dt className="sr-only">Upcoming events</dt>
            <dd>
              <span className="tabular-nums font-medium text-foreground">
                {sport.upcomingEventCount}
              </span>{' '}
              upcoming
            </dd>
          </div>
        </dl>
      </div>

      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
        aria-hidden="true"
      />
    </Link>
  );
}
