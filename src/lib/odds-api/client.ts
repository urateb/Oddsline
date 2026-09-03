import { getOddsApiKey } from './config';
import type { OddsApiEvent } from './types';

const BASE_URL = 'https://api.the-odds-api.com/v4';

export async function fetchOddsApiEvents(
  sportKey: string,
): Promise<OddsApiEvent[]> {
  const apiKey = getOddsApiKey();
  if (!apiKey) {
    throw new Error('THE_ODDS_API_KEY is not configured');
  }

  const url = new URL(`${BASE_URL}/sports/${sportKey}/odds`);
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('regions', 'eu');
  url.searchParams.set('markets', 'h2h');
  url.searchParams.set('oddsFormat', 'decimal');

  const response = await fetch(url, {
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Odds API error ${response.status}: ${body.slice(0, 200)}`,
    );
  }

  return (await response.json()) as OddsApiEvent[];
}
