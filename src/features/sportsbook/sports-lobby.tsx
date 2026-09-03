import { SportCard } from '@/components/shared/sport-card';
import { SportCardSkeleton } from '@/components/shared/sport-card-skeleton';

import { getSports } from './api';

export async function SportsLobby() {
  const sports = await getSports();

  return (
    <div
      role="list"
      aria-label="Sports"
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
    >
      {sports.map((sport) => (
        <div role="listitem" key={sport.id} className="min-w-0">
          <SportCard sport={sport} />
        </div>
      ))}
    </div>
  );
}

export function SportsLobbySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <SportCardSkeleton key={index} />
      ))}
    </div>
  );
}
