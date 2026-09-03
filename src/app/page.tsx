import { Suspense } from 'react';

import { OddslineLogo } from '@/components/shared/oddsline-logo';
import {
  SportsLobby,
  SportsLobbySkeleton,
} from '@/features/sportsbook/sports-lobby';

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <OddslineLogo size={36} />
          <h1 className="text-2xl font-semibold tracking-tight">Oddsline</h1>
        </div>
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
