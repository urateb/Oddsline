import type { Event, Market } from '@/types/sportsbook';

const MAIN_MARKET_TYPES = new Set<Market['type']>(['1X2', 'MONEY_LINE']);

export function getMainMarket(event: Event): Market | undefined {
  return event.markets.find((market) => MAIN_MARKET_TYPES.has(market.type));
}

export function getEventName(event: Event): string {
  return `${event.homeTeam.name} vs ${event.awayTeam.name}`;
}

export function formatMatchMinute(minute: number): string | null {
  return minute > 0 ? `${minute}'` : null;
}

const startTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
});

export function formatStartTime(iso: string): string {
  return startTimeFormatter.format(new Date(iso));
}
