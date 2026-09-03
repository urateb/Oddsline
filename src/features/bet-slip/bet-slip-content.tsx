'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MousePointerClick } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BetSlipCard } from '@/components/shared/bet-slip-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateReturns, formatCurrency } from '@/lib/odds';
import {
  createStakeFormSchema,
  type StakeFormInput,
  type StakeFormOutput,
  type StakeLimits,
} from '@/lib/validators/stake-schema';
import { cn } from '@/lib/utils';
import { useBetSlipStore } from '@/stores/bet-slip-store';

export interface BetSlipContentProps {
  limits: StakeLimits;
  currencySymbol: string;
}

export function BetSlipContent({
  limits,
  currencySymbol,
}: BetSlipContentProps) {
  const selections = useBetSlipStore((state) => state.selections);
  const betType = useBetSlipStore((state) => state.betType);
  const setBetType = useBetSlipStore((state) => state.setBetType);
  const removeSelection = useBetSlipStore((state) => state.removeSelection);
  const clear = useBetSlipStore((state) => state.clear);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StakeFormInput, unknown, StakeFormOutput>({
    resolver: zodResolver(createStakeFormSchema(limits)),
    defaultValues: { stake: '' },
  });

  const stakeInput = useWatch({ control, name: 'stake' });
  const parsedStake = Number(stakeInput);
  const hasPreviewableStake =
    stakeInput !== '' && Number.isFinite(parsedStake) && parsedStake > 0;

  const effectiveBetType = selections.length > 1 ? betType : 'single';
  const returns = calculateReturns(
    selections.map((selection) => selection.odds),
    hasPreviewableStake ? parsedStake : 0,
    effectiveBetType,
  );

  function onSubmit() {
    setConfirmOpen(true);
  }

  function handleConfirm() {
    toast.success('Bet placed', {
      description: `${selections.length} selection${selections.length === 1 ? '' : 's'} · Stake ${formatCurrency(returns.totalStake, currencySymbol)}`,
    });
    clear();
    reset();
    setConfirmOpen(false);
  }

  if (selections.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <MousePointerClick className="size-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">
            Your slip is empty
          </p>
          <p className="max-w-[16rem] text-sm text-muted-foreground">
            Tap any odds on the board to start building a bet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {selections.length > 1 && (
          <div
            className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1"
            role="group"
            aria-label="Bet type"
          >
            <Button
              type="button"
              size="sm"
              variant={betType === 'accumulator' ? 'default' : 'ghost'}
              className="h-8"
              aria-pressed={betType === 'accumulator'}
              onClick={() => setBetType('accumulator')}
            >
              Accumulator
            </Button>
            <Button
              type="button"
              size="sm"
              variant={betType === 'single' ? 'default' : 'ghost'}
              className="h-8"
              aria-pressed={betType === 'single'}
              onClick={() => setBetType('single')}
            >
              Singles
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {selections.map((selection) => (
            <BetSlipCard
              key={selection.selectionId}
              selection={selection}
              onRemove={() => removeSelection(selection.selectionId)}
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-t border-border bg-background/90 px-4 py-4 backdrop-blur"
        noValidate
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stake" className="text-xs text-muted-foreground">
              Stake ({currencySymbol})
            </Label>
            <Input
              id="stake"
              inputMode="decimal"
              autoComplete="off"
              placeholder={`${limits.minStake.toFixed(2)} – ${limits.maxStake.toFixed(2)}`}
              className="h-10 font-medium tabular-nums"
              aria-invalid={Boolean(errors.stake)}
              aria-describedby={errors.stake ? 'stake-error' : undefined}
              {...register('stake')}
            />
            {errors.stake && (
              <p
                id="stake-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.stake.message}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-muted/70 px-3 py-2.5">
            <dl className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Total stake</dt>
                <dd className="font-medium tabular-nums">
                  {formatCurrency(returns.totalStake, currencySymbol)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-medium">Potential returns</dt>
                <dd
                  className={cn(
                    'font-semibold tabular-nums',
                    returns.potentialReturns > 0 &&
                      'text-emerald-600 dark:text-emerald-400',
                  )}
                >
                  {formatCurrency(returns.potentialReturns, currencySymbol)}
                </dd>
              </div>
            </dl>
          </div>

          <Button type="submit" className="h-11 w-full">
            Place bet
          </Button>
        </div>
      </form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm your bet</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;re about to place a{' '}
              {effectiveBetType === 'accumulator' ? 'combined' : 'single'} bet
              on {selections.length} selection
              {selections.length === 1 ? '' : 's'} for a total stake of{' '}
              {formatCurrency(returns.totalStake, currencySymbol)}. Potential
              returns:{' '}
              {formatCurrency(returns.potentialReturns, currencySymbol)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm bet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
