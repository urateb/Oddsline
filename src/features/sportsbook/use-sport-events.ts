'use client';

import { useQuery } from '@tanstack/react-query';

import type { Event } from '@/types/sportsbook';

import { getSimulatedEvents } from './odds-simulator';

const LIVE_POLL_INTERVAL_MS: [min: number, max: number] = [1000, 3000];
const REAL_ODDS_POLL_MS = 30_000;

function randomInterval([min, max]: [number, number]): number {
  return Math.round(min + Math.random() * (max - min));
}

interface UseSportEventsOptions {
  sportId: string;
  sportSlug: string;
  initialEvents: Event[];
  dataSource: 'live' | 'mock';
}

async function fetchSportEvents(slug: string): Promise<Event[]> {
  const response = await fetch(`/api/sports/${slug}/events`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to refresh events');
  }
  const payload = (await response.json()) as { events: Event[] };
  return payload.events;
}

export function useSportEvents({
  sportId,
  sportSlug,
  initialEvents,
  dataSource,
}: UseSportEventsOptions) {
  const hasLiveEvents = initialEvents.some((event) => event.status === 'live');
  const useLiveFeed = dataSource === 'live';

  return useQuery({
    queryKey: ['sport-events', sportId, dataSource],
    queryFn: () =>
      useLiveFeed
        ? fetchSportEvents(sportSlug)
        : Promise.resolve(getSimulatedEvents(sportId, initialEvents)),
    initialData: initialEvents,
    staleTime: useLiveFeed ? REAL_ODDS_POLL_MS : Infinity,
    refetchInterval: useLiveFeed
      ? REAL_ODDS_POLL_MS
      : hasLiveEvents
        ? () => randomInterval(LIVE_POLL_INTERVAL_MS)
        : false,
  });
}
