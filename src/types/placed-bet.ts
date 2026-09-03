import type { BetSlipBetType, BetSlipSelection } from '@/types/bet-slip';

export interface PlacedBet {
  id: string;
  createdAt: string;
  betType: BetSlipBetType;
  stake: number;
  totalStake: number;
  potentialReturns: number;
  currencySymbol: string;
  status: 'open' | 'settled';
  selections: BetSlipSelection[];
}
