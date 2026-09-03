import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import type { BetSlipBetType, BetSlipSelection } from '@/types/bet-slip';
import type { PlacedBet } from '@/types/placed-bet';

export type { PlacedBet };

interface BetsFile {
  bets: PlacedBet[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'bets-store.json');

function readStore(): BetsFile {
  if (!existsSync(STORE_PATH)) {
    return { bets: [] };
  }

  try {
    const raw = readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as BetsFile;
    return { bets: Array.isArray(parsed.bets) ? parsed.bets : [] };
  } catch {
    return { bets: [] };
  }
}

function writeStore(store: BetsFile): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

export function listBets(): PlacedBet[] {
  return readStore()
    .bets.slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function createBet(input: {
  betType: BetSlipBetType;
  stake: number;
  totalStake: number;
  potentialReturns: number;
  currencySymbol: string;
  selections: BetSlipSelection[];
}): PlacedBet {
  const store = readStore();
  const bet: PlacedBet = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'open',
    ...input,
  };
  store.bets.unshift(bet);
  writeStore(store);
  return bet;
}
