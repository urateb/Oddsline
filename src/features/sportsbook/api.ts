import sportsbookData from '@/data/sportsbook-mock-data.json';
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

export async function getSports(): Promise<Sport[]> {
  await delay();

  return [...data.sports].sort((a, b) => a.order - b.order);
}

export async function getSportBySlug(slug: string): Promise<Sport | undefined> {
  await delay();

  return data.sports.find((sport) => sport.slug === slug);
}

export async function getCompetitionsBySport(
  sportId: string,
): Promise<Competition[]> {
  await delay();

  return data.competitions.filter(
    (competition) => competition.sportId === sportId,
  );
}

export async function getEventsBySport(sportId: string): Promise<Event[]> {
  await delay();

  return data.events.filter((event) => event.sportId === sportId);
}

export async function getEventById(
  eventId: string,
): Promise<Event | undefined> {
  await delay();

  return data.events.find((event) => event.id === eventId);
}

export async function getBetSlipConfig(): Promise<BetSlipConfig> {
  await delay();

  return data.betSlipConfig;
}

export async function getResponsibleGambling(): Promise<ResponsibleGambling> {
  await delay();

  return data.responsibleGambling;
}

export async function getBoardStats() {
  await delay(50);

  const live = data.events.filter((event) => event.status === 'live').length;
  const upcoming = data.events.filter(
    (event) => event.status === 'upcoming',
  ).length;
  const markets = data.events.reduce(
    (total, event) => total + event.markets.length,
    0,
  );

  return {
    sports: data.sports.length,
    live,
    upcoming,
    markets,
  };
}
