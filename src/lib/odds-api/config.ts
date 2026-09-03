/** Catalog sports we show in Oddsline → The Odds API sport keys. */
export const ODDS_API_SPORT_KEYS: Record<string, string> = {
  football: 'soccer_epl',
  basketball: 'basketball_nba',
  'ice-hockey': 'icehockey_nhl',
  cricket: 'cricket_international_t20',
  tennis: 'tennis_atp_aus_open_singles',
  // esports: no stable free-tier key — stays on mock
};

export function hasOddsApiKey(): boolean {
  return Boolean(process.env.THE_ODDS_API_KEY?.trim());
}

export function getOddsApiKey(): string | null {
  const key = process.env.THE_ODDS_API_KEY?.trim();
  return key || null;
}
