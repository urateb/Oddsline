import sportsbookData from '@/data/sportsbook-mock-data.json';
import { fetchOddsApiEvents } from '@/lib/odds-api/client';
import { ODDS_API_SPORT_KEYS, hasOddsApiKey } from '@/lib/odds-api/config';
import {
  competitionFromOddsApi,
  mapOddsApiEvent,
} from '@/lib/odds-api/map';
import type {
  BetSlipConfig,
  Competition,
  Event,
  ResponsibleGambling,
  Sport,
  SportsbookData,
} from '@/types/sportsbook';

const data = sportsbookData as SportsbookData;

async function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sportById(sportId: string): Sport | undefined {
  return data.sports.find((sport) => sport.id === sportId);
}

export function isLiveOddsSource(slug: string): boolean {
  return hasOddsApiKey() && Boolean(ODDS_API_SPORT_KEYS[slug]);
}

async function fetchLiveEventsForSport(sport: Sport): Promise<{
  events: Event[];
  competition: Competition | null;
} | null> {
  const sportKey = ODDS_API_SPORT_KEYS[sport.slug];
  if (!hasOddsApiKey() || !sportKey) {
    return null;
  }

  try {
    const apiEvents = await fetchOddsApiEvents(sportKey);
    const events = apiEvents
      .map((apiEvent) => mapOddsApiEvent(apiEvent, sport.id))
      .filter((event): event is Event => event !== null)
      .slice(0, 20);

    if (events.length === 0) {
      return null;
    }

    const title = apiEvents[0]?.sport_title ?? sport.name;
    return {
      events,
      competition: competitionFromOddsApi(sportKey, title, sport.id),
    };
  } catch (error) {
    console.warn(
      `[oddsline] live odds unavailable for ${sport.slug}, using mock`,
      error,
    );
    return null;
  }
}

export async function getSports(): Promise<Sport[]> {
  await delay(50);

  const sports = [...data.sports].sort((a, b) => a.order - b.order);

  if (!hasOddsApiKey()) {
    return sports;
  }

  const withCounts = await Promise.all(
    sports.map(async (sport) => {
      const live = await fetchLiveEventsForSport(sport);
      if (!live) {
        return sport;
      }

      const liveEventCount = live.events.filter(
        (event) => event.status === 'live',
      ).length;
      const upcomingEventCount = live.events.filter(
        (event) => event.status === 'upcoming',
      ).length;

      return {
        ...sport,
        liveEventCount,
        upcomingEventCount,
      };
    }),
  );

  return withCounts;
}

export async function getSportBySlug(slug: string): Promise<Sport | undefined> {
  await delay(50);
  const sports = await getSports();
  return sports.find((sport) => sport.slug === slug);
}

export async function getCompetitionsBySport(
  sportId: string,
): Promise<Competition[]> {
  const sport = sportById(sportId);
  if (!sport) {
    return [];
  }

  const live = await fetchLiveEventsForSport(sport);
  if (live?.competition) {
    return [live.competition];
  }

  await delay(50);
  return data.competitions.filter(
    (competition) => competition.sportId === sportId,
  );
}

export async function getEventsBySport(sportId: string): Promise<Event[]> {
  const sport = sportById(sportId);
  if (!sport) {
    return [];
  }

  const live = await fetchLiveEventsForSport(sport);
  if (live) {
    return live.events;
  }

  await delay(50);
  return data.events.filter((event) => event.sportId === sportId);
}

export async function getEventById(
  eventId: string,
): Promise<Event | undefined> {
  await delay(50);

  return data.events.find((event) => event.id === eventId);
}

export async function getBetSlipConfig(): Promise<BetSlipConfig> {
  await delay(50);

  return data.betSlipConfig;
}

export async function getResponsibleGambling(): Promise<ResponsibleGambling> {
  await delay(50);

  return data.responsibleGambling;
}

export async function getBoardStats() {
  const sports = await getSports();
  const eventLists = await Promise.all(
    sports.map((sport) => getEventsBySport(sport.id)),
  );
  const events = eventLists.flat();

  return {
    sports: sports.length,
    live: events.filter((event) => event.status === 'live').length,
    upcoming: events.filter((event) => event.status === 'upcoming').length,
    markets: events.reduce((total, event) => total + event.markets.length, 0),
  };
}

export function getDataSourceLabel(slug: string): 'live' | 'mock' {
  return isLiveOddsSource(slug) ? 'live' : 'mock';
}
