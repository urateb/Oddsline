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
        'group relative flex aspect-[5/4] h-full flex-col justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-[border-color,background-color,box-shadow,transform]',
        'hover:border-primary/40 hover:bg-accent/30 hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex size-11 items-center justify-center rounded-xl text-2xl ring-1',
            wellClass,
          )}
          aria-hidden="true"
        >
          {sport.icon}
        </span>
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold tracking-tight">
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

        <dl className="grid grid-cols-2 gap-1.5 text-sm">
          <div className="rounded-lg bg-muted/60 px-2.5 py-1.5">
            <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">
              Live
            </dt>
            <dd className="text-sm font-semibold tabular-nums">
              {sport.liveEventCount}
            </dd>
          </div>
          <div className="rounded-lg bg-muted/60 px-2.5 py-1.5">
            <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">
              Upcoming
            </dt>
            <dd className="text-sm font-semibold tabular-nums">
              {sport.upcomingEventCount}
            </dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
