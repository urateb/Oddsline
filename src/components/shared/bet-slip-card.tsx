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
        'flex items-start justify-between gap-2 rounded-md border border-border bg-card p-3',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-xs text-muted-foreground">
          {selection.eventName}
        </span>
        <span className="truncate text-sm font-medium">
          {selection.selectionName}
          <span className="ml-1 text-muted-foreground">
            ({selection.label})
          </span>
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {selection.marketName}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-semibold tabular-nums">
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
