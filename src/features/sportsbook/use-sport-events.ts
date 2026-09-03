'use client';

import { useQuery } from '@tanstack/react-query';

import type { Event } from '@/types/sportsbook';

import { getSimulatedEvents } from './odds-simulator';

const LIVE_POLL_INTERVAL_MS: [min: number, max: number] = [1000, 3000];

function randomInterval([min, max]: [number, number]): number {
  return Math.round(min + Math.random() * (max - min));
}

interface UseSportEventsOptions {
  sportId: string;
  initialEvents: Event[];
}

export function useSportEvents({
  sportId,
  initialEvents,
}: UseSportEventsOptions) {
  const hasLiveEvents = initialEvents.some((event) => event.status === 'live');

  return useQuery({
    queryKey: ['sport-events', sportId],
    queryFn: () => getSimulatedEvents(sportId, initialEvents),
    initialData: initialEvents,
    staleTime: Infinity,
    refetchInterval: hasLiveEvents
      ? () => randomInterval(LIVE_POLL_INTERVAL_MS)
      : false,
  });
}
