import sportsbookData from '@/data/sportsbook-mock-data.json';
import type {
  Event,
  Market,
  Selection,
  SportsbookData,
} from '@/types/sportsbook';

const { oddsSimulation } = sportsbookData as SportsbookData;

interface SimulatorEntry {
  events: Event[];
  suspendedUntil: Map<string, number>;
}

const simulators = new Map<string, SimulatorEntry>();

function cloneEvents(events: Event[]): Event[] {
  return events.map((event) => ({
    ...event,
    score: event.score ? { ...event.score } : null,
    matchClock: event.matchClock ? { ...event.matchClock } : null,
    markets: event.markets.map((market) => ({
      ...market,
      selections: market.selections.map((selection) => ({ ...selection })),
    })),
  }));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function tickSelection(selection: Selection): Selection {
  const maxDelta = selection.odds * oddsSimulation.maxOddsChange * 0.3;
  const delta = randomBetween(-maxDelta, maxDelta);
  const nextOdds = Math.max(
    1.01,
    Math.round((selection.odds + delta) * 100) / 100,
  );

  if (nextOdds === selection.odds) {
    return selection;
  }

  return {
    ...selection,
    previousOdds: selection.odds,
    odds: nextOdds,
    trend: nextOdds < selection.odds ? 'shortening' : 'drifting',
  };
}

function tickMarket(
  market: Market,
  suspendedUntil: Map<string, number>,
  now: number,
): Market {
  const suspendedExpiry = suspendedUntil.get(market.id);
  const isCurrentlySuspended =
    suspendedExpiry !== undefined && suspendedExpiry > now;

  if (isCurrentlySuspended) {
    return market.suspended ? market : { ...market, suspended: true };
  }

  if (suspendedExpiry !== undefined) {
    suspendedUntil.delete(market.id);
  }

  if (Math.random() < oddsSimulation.suspensionProbability) {
    const duration = randomBetween(
      oddsSimulation.suspensionDurationMs.min,
      oddsSimulation.suspensionDurationMs.max,
    );
    suspendedUntil.set(market.id, now + duration);
    return { ...market, suspended: true };
  }

  const nextSelections = market.selections.map(tickSelection);
  const hasChanged = nextSelections.some(
    (selection, index) => selection !== market.selections[index],
  );

  if (!hasChanged && !market.suspended) {
    return market;
  }

  return { ...market, suspended: false, selections: nextSelections };
}

function tickEvent(
  event: Event,
  suspendedUntil: Map<string, number>,
  now: number,
): Event {
  if (event.status !== 'live') {
    return event;
  }

  const nextMarkets = event.markets.map((market) =>
    tickMarket(market, suspendedUntil, now),
  );
  const hasChanged = nextMarkets.some(
    (market, index) => market !== event.markets[index],
  );

  return hasChanged ? { ...event, markets: nextMarkets } : event;
}

export function getSimulatedEvents(
  sportId: string,
  baseline: Event[],
): Event[] {
  const existing = simulators.get(sportId);

  if (!existing) {
    const entry: SimulatorEntry = {
      events: cloneEvents(baseline),
      suspendedUntil: new Map(),
    };
    simulators.set(sportId, entry);
    return entry.events;
  }

  const now = Date.now();
  const nextEvents = existing.events.map((event) =>
    tickEvent(event, existing.suspendedUntil, now),
  );
  const hasChanged = nextEvents.some(
    (event, index) => event !== existing.events[index],
  );

  if (hasChanged) {
    existing.events = nextEvents;
  }

  return existing.events;
}
