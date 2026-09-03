'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { Separator } from '@/components/ui/separator';
import { calculateReturns, formatCurrency } from '@/lib/odds';
import {
  createStakeFormSchema,
  type StakeFormInput,
  type StakeFormOutput,
  type StakeLimits,
} from '@/lib/validators/stake-schema';
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
      <div className="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center text-sm text-muted-foreground">
        <p>Your bet slip is empty.</p>
        <p>Click any odds to add a selection.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <div className="flex flex-col gap-2">
        {selections.map((selection) => (
          <BetSlipCard
            key={selection.selectionId}
            selection={selection}
            onRemove={() => removeSelection(selection.selectionId)}
          />
        ))}
      </div>

      {selections.length > 1 && (
        <div className="flex gap-2" role="group" aria-label="Bet type">
          <Button
            type="button"
            size="sm"
            variant={betType === 'accumulator' ? 'default' : 'outline'}
            aria-pressed={betType === 'accumulator'}
            onClick={() => setBetType('accumulator')}
          >
            Accumulator
          </Button>
          <Button
            type="button"
            size="sm"
            variant={betType === 'single' ? 'default' : 'outline'}
            aria-pressed={betType === 'single'}
            onClick={() => setBetType('single')}
          >
            Singles
          </Button>
        </div>
      )}

      <Separator />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stake">Stake ({currencySymbol})</Label>
          <Input
            id="stake"
            inputMode="decimal"
            autoComplete="off"
            placeholder={`${limits.minStake.toFixed(2)} – ${limits.maxStake.toFixed(2)}`}
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

        <dl className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Total stake</dt>
            <dd className="tabular-nums">
              {formatCurrency(returns.totalStake, currencySymbol)}
            </dd>
          </div>
          <div className="flex justify-between font-medium">
            <dt>Potential returns</dt>
            <dd className="tabular-nums">
              {formatCurrency(returns.potentialReturns, currencySymbol)}
            </dd>
          </div>
        </dl>

        <Button type="submit" className="w-full">
          Place Bet
        </Button>
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
