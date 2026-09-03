'use client';

import { useMemo } from 'react';

import { EventRow } from '@/components/shared/event-row';
import type { Competition, Event } from '@/types/sportsbook';

import { useSportEvents } from './use-sport-events';

export interface EventsListProps {
  sportId: string;
  sportSlug: string;
  initialEvents: Event[];
  competitions: Competition[];
  dataSource: 'live' | 'mock';
}

export function EventsList({
  sportId,
  sportSlug,
  initialEvents,
  competitions,
  dataSource,
}: EventsListProps) {
  const { data: events } = useSportEvents({
    sportId,
    sportSlug,
    initialEvents,
    dataSource,
  });

  const competitionsById = useMemo(
    () =>
      new Map(competitions.map((competition) => [competition.id, competition])),
    [competitions],
  );

  const groups = useMemo(() => {
    const grouped = new Map<string, Event[]>();
    for (const event of events) {
      const eventsForCompetition = grouped.get(event.competitionId) ?? [];
      eventsForCompetition.push(event);
      grouped.set(event.competitionId, eventsForCompetition);
    }
    return Array.from(grouped.entries());
  }, [events]);

  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No events scheduled for this sport right now.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      {groups.map(([competitionId, competitionEvents]) => (
        <section
          key={competitionId}
          aria-labelledby={`competition-${competitionId}`}
        >
          <h2
            id={`competition-${competitionId}`}
            className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          >
            {competitionsById.get(competitionId)?.name ?? 'Competition'}
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {competitionEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
