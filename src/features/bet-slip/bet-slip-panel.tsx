'use client';

import { useEffect, useState } from 'react';
import { Ticket } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useBetSlipStore } from '@/stores/bet-slip-store';
import { useUiStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import type { BetSlipConfig } from '@/types/sportsbook';

import { BetSlipContent } from './bet-slip-content';

export interface BetSlipPanelProps {
  config: Pick<BetSlipConfig, 'minStake' | 'maxStake' | 'currencySymbol'>;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isDesktop;
}

export function BetSlipTrigger({ className }: { className?: string }) {
  const selectionCount = useBetSlipStore((state) => state.selections.length);
  const setOpen = useUiStore((state) => state.setBetSlipOpen);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn('relative gap-2', className)}
      onClick={() => setOpen(true)}
      aria-label={
        selectionCount > 0
          ? `Open bet slip, ${selectionCount} selection${selectionCount === 1 ? '' : 's'}`
          : 'Open bet slip'
      }
    >
      <Ticket className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Bet slip</span>
      {selectionCount > 0 && (
        <span className="flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground tabular-nums">
          {selectionCount}
        </span>
      )}
    </Button>
  );
}

export function BetSlipPanel({ config }: BetSlipPanelProps) {
  const selectionCount = useBetSlipStore((state) => state.selections.length);
  const isOpen = useUiStore((state) => state.isBetSlipOpen);
  const setOpen = useUiStore((state) => state.setBetSlipOpen);
  const isDesktop = useIsDesktop();

  const limits = { minStake: config.minStake, maxStake: config.maxStake };

  return (
    <>
      {selectionCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
          <Button
            className="h-11 w-full gap-2"
            onClick={() => setOpen(true)}
          >
            <Ticket className="size-4" aria-hidden="true" />
            Open bet slip
            <span className="rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums">
              {selectionCount}
            </span>
          </Button>
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent
          side={isDesktop ? 'right' : 'bottom'}
          showCloseButton
          className={cn(
            'flex flex-col gap-0 p-0',
            isDesktop
              ? 'w-full sm:max-w-md'
              : 'h-[88vh] data-[side=bottom]:h-[88vh]',
          )}
        >
          <SheetHeader className="shrink-0 border-b border-border px-4 py-3.5 text-left">
            <SheetTitle className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Ticket className="size-4" aria-hidden="true" />
              </span>
              Bet slip
              {selectionCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground tabular-nums">
                  {selectionCount}
                </span>
              )}
            </SheetTitle>
          </SheetHeader>
          <BetSlipContent
            limits={limits}
            currencySymbol={config.currencySymbol}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
