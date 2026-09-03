export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}

export function formatCurrency(amount: number, symbol = '€'): string {
  return `${symbol}${amount.toFixed(2)}`;
}

export function combineOdds(oddsList: number[]): number {
  return oddsList.reduce((product, odds) => product * odds, 1);
}

export interface ReturnsBreakdown {
  totalStake: number;
  potentialReturns: number;
  potentialProfit: number;
}

export function calculateReturns(
  oddsList: number[],
  stake: number,
  betType: 'single' | 'accumulator',
): ReturnsBreakdown {
  if (oddsList.length === 0 || !Number.isFinite(stake) || stake <= 0) {
    return { totalStake: 0, potentialReturns: 0, potentialProfit: 0 };
  }

  if (betType === 'accumulator') {
    const potentialReturns = stake * combineOdds(oddsList);
    return {
      totalStake: stake,
      potentialReturns,
      potentialProfit: potentialReturns - stake,
    };
  }

  const totalStake = stake * oddsList.length;
  const potentialReturns = oddsList.reduce(
    (sum, odds) => sum + stake * odds,
    0,
  );
  return {
    totalStake,
    potentialReturns,
    potentialProfit: potentialReturns - totalStake,
  };
}
