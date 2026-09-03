'use client';

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
      <aside className="sticky top-0 hidden h-screen w-80 shrink-0 flex-col border-l border-border lg:flex">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-semibold">Bet Slip</h2>
          {selectionCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {selectionCount} selection{selectionCount === 1 ? '' : 's'}
            </span>
          )}
        </div>
        <BetSlipContent
          limits={limits}
          currencySymbol={config.currencySymbol}
        />
      </aside>

      {selectionCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background p-3 lg:hidden">
          <Button className="w-full" onClick={() => setOpen(true)}>
            Bet Slip ({selectionCount})
          </Button>
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="flex h-[85vh] flex-col lg:hidden"
        >
          <SheetHeader>
            <SheetTitle>Bet Slip</SheetTitle>
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
