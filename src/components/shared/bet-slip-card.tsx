import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatOdds } from '@/lib/odds';
import { cn } from '@/lib/utils';
import type { BetSlipSelection } from '@/types/bet-slip';

export interface BetSlipCardProps {
  /** Selection to display (event, market, odds). */
  selection: BetSlipSelection;
  /** Called when the remove button is clicked. */
  onRemove: () => void;
  /** Layout overrides. */
  className?: string;
}

export function BetSlipCard({
  selection,
  onRemove,
  className,
}: BetSlipCardProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 rounded-xl border border-border/80 bg-background p-3 shadow-xs',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-[11px] tracking-wide text-muted-foreground uppercase">
          {selection.marketName}
        </span>
        <span className="truncate text-sm font-semibold tracking-tight">
          {selection.selectionName}
          <span className="ml-1 font-medium text-muted-foreground">
            ({selection.label})
          </span>
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {selection.eventName}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="rounded-md bg-muted px-2 py-1 text-sm font-semibold tabular-nums">
          {formatOdds(selection.odds)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`Remove ${selection.selectionName} from bet slip`}
          onClick={onRemove}
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
