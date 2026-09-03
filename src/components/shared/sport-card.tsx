import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Sport } from '@/types/sportsbook';

export interface SportCardProps {
  /** Sport to render (icon, name, live/upcoming counts). Links to `/sport/[slug]`. */
  sport: Sport;
  /** Layout overrides. */
  className?: string;
}

export function SportCard({ sport, className }: SportCardProps) {
  const hasLive = sport.liveEventCount > 0;

  return (
    <Link
      href={`/sport/${sport.slug}`}
      aria-label={`View ${sport.name} events — ${sport.liveEventCount} live, ${sport.upcomingEventCount} upcoming`}
      className={cn(
        'rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <Card className="h-full transition-colors hover:border-primary/50 hover:shadow-md">
        <CardHeader className="flex flex-row items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {sport.icon}
          </span>
          <CardTitle className="text-lg">{sport.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              {hasLive && (
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
              )}
              <dt className="sr-only">Live events</dt>
              <dd
                className={cn(
                  'font-medium',
                  hasLive
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground',
                )}
              >
                {sport.liveEventCount} live
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Upcoming events</dt>
              <dd className="text-muted-foreground">
                {sport.upcomingEventCount} upcoming
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </Link>
  );
}
