'use client';

import { memo } from 'react';

import { formatStartTime, getEventName, getMainMarket } from '@/lib/events';
import { cn } from '@/lib/utils';
import {
  selectIsSelectionActive,
  useBetSlipStore,
} from '@/stores/bet-slip-store';
import { useUiStore } from '@/stores/ui-store';
import type { Event, Selection } from '@/types/sportsbook';

import { MatchClock } from './match-clock';
import { OddsButton } from './odds-button';

export interface EventRowProps {
  /** Event to render (teams, score/time, and main-market odds). */
  event: Event;
  /** Layout overrides. */
  className?: string;
}

function EventRowImpl({ event, className }: EventRowProps) {
  const mainMarket = getMainMarket(event);
  const eventName = getEventName(event);
  const isLive = event.status === 'live';

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-b border-border/60 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <div className="h-4 text-xs text-muted-foreground">
          {isLive && event.matchClock ? (
            <MatchClock
              minute={event.matchClock.minute}
              period={event.matchClock.period}
              isRunning={event.matchClock.isRunning}
            />
          ) : (
            <span>{formatStartTime(event.startTime)}</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <span className="truncate font-medium">{event.homeTeam.name}</span>
          {isLive && event.score && (
            <span className="tabular-nums text-muted-foreground">
              {event.score.home}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <span className="truncate font-medium">{event.awayTeam.name}</span>
          {isLive && event.score && (
            <span className="tabular-nums text-muted-foreground">
              {event.score.away}
            </span>
          )}
        </div>
        {event.score?.detail && (
          <span className="text-xs text-muted-foreground">
            {event.score.detail}
          </span>
        )}
      </div>

      {mainMarket && (
        <div
          role="group"
          aria-label={`${mainMarket.name} for ${eventName}`}
          className="flex gap-2 sm:w-auto sm:shrink-0"
        >
          {mainMarket.selections.map((selection) => (
            <ConnectedOddsButton
              key={selection.id}
              selection={selection}
              suspended={mainMarket.suspended}
              eventId={event.id}
              eventName={eventName}
              marketId={mainMarket.id}
              marketName={mainMarket.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ConnectedOddsButtonProps {
  selection: Selection;
  suspended: boolean;
  eventId: string;
  eventName: string;
  marketId: string;
  marketName: string;
}

function ConnectedOddsButton({
  selection,
  suspended,
  eventId,
  eventName,
  marketId,
  marketName,
}: ConnectedOddsButtonProps) {
  const isSelected = useBetSlipStore(selectIsSelectionActive(selection.id));
  const toggleSelection = useBetSlipStore((state) => state.toggleSelection);
  const setBetSlipOpen = useUiStore((state) => state.setBetSlipOpen);

  return (
    <OddsButton
      label={selection.label}
      odds={selection.odds}
      isSelected={isSelected}
      suspended={suspended}
      onToggle={() => {
        toggleSelection({
          selectionId: selection.id,
          eventId,
          eventName,
          marketId,
          marketName,
          selectionName: selection.name,
          label: selection.label,
          odds: selection.odds,
        });
        if (!isSelected) {
          setBetSlipOpen(true);
        }
      }}
    />
  );
}

export const EventRow = memo(EventRowImpl);
