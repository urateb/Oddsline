import { Suspense } from 'react';

import {
  SportsLobby,
  SportsLobbySkeleton,
} from '@/features/sportsbook/sports-lobby';

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Oddsline</h1>
        <p className="text-sm text-muted-foreground">
          Choose a sport to view live and upcoming events.
        </p>
      </div>
      <Suspense fallback={<SportsLobbySkeleton />}>
        <SportsLobby />
      </Suspense>
    </main>
  );
}
