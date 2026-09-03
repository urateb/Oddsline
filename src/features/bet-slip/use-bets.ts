'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { PlaceBetInput } from '@/lib/bets/schema';
import type { PlacedBet } from '@/types/placed-bet';

const BETS_QUERY_KEY = ['bets'] as const;

async function fetchBets(): Promise<PlacedBet[]> {
  const response = await fetch('/api/bets', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to load bets');
  }
  const payload = (await response.json()) as { bets: PlacedBet[] };
  return payload.bets;
}

async function postBet(input: PlaceBetInput): Promise<PlacedBet> {
  const response = await fetch('/api/bets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(payload?.error ?? 'Failed to place bet');
  }

  const payload = (await response.json()) as { bet: PlacedBet };
  return payload.bet;
}

export function useOpenBets(enabled: boolean) {
  return useQuery({
    queryKey: BETS_QUERY_KEY,
    queryFn: fetchBets,
    enabled,
    staleTime: 10_000,
  });
}

export function usePlaceBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postBet,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BETS_QUERY_KEY });
    },
  });
}
