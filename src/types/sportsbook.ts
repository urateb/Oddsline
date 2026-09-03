export interface Sport {
  id: string;
  name: string;
  slug: string;
  icon: string;
  liveEventCount: number;
  upcomingEventCount: number;
  order: number;
}

export interface Competition {
  id: string;
  name: string;
  sportId: string;
  country: string;
  countryCode: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
}

export interface Score {
  home: number;
  away: number;
  detail?: string;
}

export interface MatchClock {
  minute: number;
  period: string;
  isRunning: boolean;
}

export type MarketType =
  '1X2' | 'MONEY_LINE' | 'OVER_UNDER' | 'YES_NO' | 'SPREAD';

export type OddsTrend = 'shortening' | 'drifting' | 'stable';

export interface Selection {
  id: string;
  name: string;
  label: string;
  odds: number;
  previousOdds: number;
  trend: OddsTrend;
}

export interface Market {
  id: string;
  name: string;
  type: MarketType;
  suspended: boolean;
  selections: Selection[];
}

export type EventStatus = 'live' | 'upcoming';

export interface Event {
  id: string;
  sportId: string;
  competitionId: string;
  status: EventStatus;

  homeTeam: Team;
  awayTeam: Team;

  score: Score | null;
  matchClock: MatchClock | null;

  startTime: string;

  markets: Market[];
}

export interface BetType {
  id: string;
  name: string;
  description: string;
}

export interface BetSlipConfig {
  minStake: number;
  maxStake: number;
  maxSelections: number;
  maxPayout: number;
  currency: string;
  currencySymbol: string;
  betTypes: BetType[];
}

export interface DepositLimit {
  min: number;
  max: number;
}

export interface SelfExclusionOption {
  id: string;
  label: string;
}

export interface ResponsibleGamblingMessages {
  banner: string;
  sessionReminder: string;
  depositLimitReached: string;
}

export interface ResponsibleGambling {
  sessionTimerEnabled: boolean;
  sessionTimerIntervalMinutes: number;

  depositLimits: {
    daily: DepositLimit;
    weekly: DepositLimit;
    monthly: DepositLimit;
  };

  selfExclusionOptions: SelfExclusionOption[];

  messages: ResponsibleGamblingMessages;

  helplineUrl: string;
  helplinePhone: string;
  minimumAge: number;
}

export interface OddsUpdateInterval {
  min: number;
  max: number;
}

export interface OddsSimulation {
  description: string;

  updateIntervalMs: {
    live: OddsUpdateInterval;
    upcoming: OddsUpdateInterval;
  };

  maxOddsChange: number;

  suspensionProbability: number;

  suspensionDurationMs: OddsUpdateInterval;
}

export interface SportsbookData {
  sports: Sport[];
  competitions: Competition[];
  events: Event[];

  betSlipConfig: BetSlipConfig;

  responsibleGambling: ResponsibleGambling;

  oddsSimulation: OddsSimulation;
}
