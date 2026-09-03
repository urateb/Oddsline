'use client';

import { History } from 'lucide-react';

import { formatCurrency, formatOdds } from '@/lib/odds';
import type { PlacedBet } from '@/types/placed-bet';

import { useOpenBets } from './use-bets';

function formatPlacedAt(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

function BetCard({ bet }: { bet: PlacedBet }) {
  return (
    <article className="rounded-xl border border-border bg-card px-3 py-3">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {bet.betType === 'accumulator' ? 'Accumulator' : 'Singles'} ·{' '}
            {bet.selections.length} leg
            {bet.selections.length === 1 ? '' : 's'}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatPlacedAt(bet.createdAt)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
          {bet.status}
        </span>
      </div>

      <ul className="mb-3 space-y-1.5 border-b border-border pb-3">
        {bet.selections.map((selection) => (
          <li
            key={selection.selectionId}
            className="flex items-baseline justify-between gap-2 text-sm"
          >
            <span className="min-w-0 truncate text-muted-foreground">
              <span className="font-medium text-foreground">
                {selection.label}
              </span>{' '}
              {selection.eventName}
            </span>
            <span className="shrink-0 tabular-nums">
              {formatOdds(selection.odds)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Stake</dt>
          <dd className="font-medium tabular-nums">
            {formatCurrency(bet.totalStake, bet.currencySymbol)}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">To return</dt>
          <dd className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCurrency(bet.potentialReturns, bet.currencySymbol)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function OpenBetsList({ active }: { active: boolean }) {
  const { data: bets = [], isLoading, isError, refetch } = useOpenBets(active);

  if (isLoading) {
    return (
      <p className="px-6 py-10 text-center text-sm text-muted-foreground">
        Loading open bets…
      </p>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <p className="text-sm text-muted-foreground">Couldn’t load bets.</p>
        <button
          type="button"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => void refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  if (bets.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <History className="size-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">No open bets yet</p>
          <p className="max-w-[16rem] text-sm text-muted-foreground">
            Place a bet from your slip and it will show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
      {bets.map((bet) => (
        <BetCard key={bet.id} bet={bet} />
      ))}
    </div>
  );
}
