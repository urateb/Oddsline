export interface BetSlipSelection {
  selectionId: string;
  eventId: string;
  eventName: string;
  marketId: string;
  marketName: string;
  selectionName: string;
  label: string;
  odds: number;
}

export type BetSlipBetType = 'single' | 'accumulator';
