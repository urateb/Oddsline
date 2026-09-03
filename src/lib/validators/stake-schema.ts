import { z } from 'zod';

import type { BetSlipConfig } from '@/types/sportsbook';

const STAKE_PATTERN = /^\d+(\.\d{1,2})?$/;

export type StakeLimits = Pick<BetSlipConfig, 'minStake' | 'maxStake'>;

export function createStakeSchema(limits: StakeLimits) {
  return z
    .string()
    .trim()
    .min(1, 'Stake is required')
    .refine(
      (value) => STAKE_PATTERN.test(value),
      'Enter a valid amount (numbers only, up to 2 decimal places)',
    )
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .min(limits.minStake, `Minimum stake is €${limits.minStake.toFixed(2)}`)
        .max(
          limits.maxStake,
          `Maximum stake is €${limits.maxStake.toFixed(2)}`,
        ),
    );
}

export function createStakeFormSchema(limits: StakeLimits) {
  return z.object({ stake: createStakeSchema(limits) });
}

export type StakeFormSchema = ReturnType<typeof createStakeFormSchema>;
export type StakeFormInput = z.input<StakeFormSchema>;
export type StakeFormOutput = z.output<StakeFormSchema>;
