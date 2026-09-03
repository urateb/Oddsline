'use client';

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
import type { BetSlipConfig } from '@/types/sportsbook';

import { BetSlipContent } from './bet-slip-content';

export interface BetSlipPanelProps {
  config: Pick<BetSlipConfig, 'minStake' | 'maxStake' | 'currencySymbol'>;
}

export function BetSlipPanel({ config }: BetSlipPanelProps) {
  const selectionCount = useBetSlipStore((state) => state.selections.length);
  const isOpen = useUiStore((state) => state.isBetSlipOpen);
  const setOpen = useUiStore((state) => state.setBetSlipOpen);

  const limits = { minStake: config.minStake, maxStake: config.maxStake };

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[22rem] shrink-0 flex-col border-l border-border bg-muted/20 lg:flex">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3.5 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Ticket className="size-4" aria-hidden="true" />
            </span>
            <h2 className="font-semibold tracking-tight">Bet slip</h2>
          </div>
          {selectionCount > 0 ? (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground tabular-nums">
              {selectionCount}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Empty</span>
          )}
        </div>
        <BetSlipContent
          limits={limits}
          currencySymbol={config.currencySymbol}
        />
      </aside>

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
          side="bottom"
          className="flex h-[88vh] flex-col gap-0 p-0 lg:hidden"
        >
          <SheetHeader className="border-b border-border px-4 py-3 text-left">
            <SheetTitle className="flex items-center gap-2">
              <Ticket className="size-4" aria-hidden="true" />
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
