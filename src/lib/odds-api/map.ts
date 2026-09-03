import type { Competition, Event, Market, Selection, Team } from '@/types/sportsbook';

import type { OddsApiEvent, OddsApiOutcome } from './types';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toTeam(name: string): Team {
  return {
    id: `team_${slugify(name)}`,
    name,
    shortName: name.length > 14 ? `${name.slice(0, 12)}…` : name,
    logo: '',
  };
}

function outcomeLabel(outcome: OddsApiOutcome, home: string, away: string): string {
  if (outcome.name === home) return '1';
  if (outcome.name === away) return '2';
  if (outcome.name.toLowerCase() === 'draw') return 'X';
  return outcome.name.slice(0, 1).toUpperCase();
}

function mapSelections(
  eventId: string,
  home: string,
  away: string,
  outcomes: OddsApiOutcome[],
): Selection[] {
  return outcomes.map((outcome) => ({
    id: `sel_${eventId}_${slugify(outcome.name)}`,
    name: outcome.name,
    label: outcomeLabel(outcome, home, away),
    odds: Number(outcome.price.toFixed(2)),
    previousOdds: Number(outcome.price.toFixed(2)),
    trend: 'stable' as const,
  }));
}

export function mapOddsApiEvent(
  apiEvent: OddsApiEvent,
  sportId: string,
): Event | null {
  const bookmaker = apiEvent.bookmakers[0];
  const market = bookmaker?.markets.find((item) => item.key === 'h2h');
  if (!market || market.outcomes.length < 2) {
    return null;
  }

  const commence = new Date(apiEvent.commence_time).getTime();
  const isLive = commence <= Date.now();
  const hasDraw = market.outcomes.some(
    (outcome) => outcome.name.toLowerCase() === 'draw',
  );

  const mappedMarket: Market = {
    id: `mkt_${apiEvent.id}_h2h`,
    name: 'Match Winner',
    type: hasDraw ? '1X2' : 'MONEY_LINE',
    suspended: false,
    selections: mapSelections(
      apiEvent.id,
      apiEvent.home_team,
      apiEvent.away_team,
      market.outcomes,
    ),
  };

  return {
    id: apiEvent.id,
    sportId,
    competitionId: `comp_${apiEvent.sport_key}`,
    status: isLive ? 'live' : 'upcoming',
    homeTeam: toTeam(apiEvent.home_team),
    awayTeam: toTeam(apiEvent.away_team),
    score: null,
    matchClock: isLive
      ? { minute: 0, period: 'Live', isRunning: true }
      : null,
    startTime: apiEvent.commence_time,
    markets: [mappedMarket],
  };
}

export function competitionFromOddsApi(
  sportKey: string,
  sportTitle: string,
  sportId: string,
): Competition {
  return {
    id: `comp_${sportKey}`,
    name: sportTitle,
    sportId,
    country: '',
    countryCode: '',
  };
}
