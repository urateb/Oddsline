import { Suspense } from 'react';

import {
  SportsLobby,
  SportsLobbySkeleton,
} from '@/features/sportsbook/sports-lobby';

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 sm:gap-10 sm:p-8">
      <header className="flex max-w-2xl flex-col gap-3">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Sports markets
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Live odds. Sharper lines.
        </h1>
        <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
          Jump into a sport, follow the board as prices move, and build your
          slip in one place.
        </p>
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="sports-heading">
        <div className="flex items-end justify-between gap-3">
          <h2
            id="sports-heading"
            className="text-sm font-medium tracking-wide text-muted-foreground uppercase"
          >
            Browse sports
          </h2>
        </div>
        <Suspense fallback={<SportsLobbySkeleton />}>
          <SportsLobby />
        </Suspense>
      </section>
    </main>
  );
}
