import { z } from 'zod';

export const placeBetSchema = z.object({
  betType: z.enum(['single', 'accumulator']),
  stake: z.number().positive(),
  totalStake: z.number().positive(),
  potentialReturns: z.number().nonnegative(),
  currencySymbol: z.string().min(1),
  selections: z
    .array(
      z.object({
        selectionId: z.string().min(1),
        eventId: z.string().min(1),
        eventName: z.string().min(1),
        marketId: z.string().min(1),
        marketName: z.string().min(1),
        selectionName: z.string().min(1),
        label: z.string().min(1),
        odds: z.number().positive(),
      }),
    )
    .min(1)
    .max(20),
});

export type PlaceBetInput = z.infer<typeof placeBetSchema>;
