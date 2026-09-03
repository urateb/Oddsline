'use client';

import { Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { formatOdds } from '@/lib/odds';
import { cn } from '@/lib/utils';

export interface OddsButtonProps {
  /** Short selection label, e.g. `"1"`, `"X"`, `"Over"`. */
  label: string;
  /** Current decimal odds. */
  odds: number;
  /** Whether this selection is currently in the bet slip. */
  isSelected?: boolean;
  /** Disables the button and shows a lock icon while the market is suspended. */
  suspended?: boolean;
  /** Called on click; never called while suspended. */
  onToggle?: () => void;
  /** Overrides the default generated accessible label. */
  'aria-label'?: string;
  /** Layout overrides. */
  className?: string;
}

const FLASH_DURATION_MS = 900;
type FlashDirection = 'shorten' | 'drift' | null;

export function OddsButton({
  label,
  odds,
  isSelected = false,
  suspended = false,
  onToggle,
  className,
  ...rest
}: OddsButtonProps) {
  const [flash, setFlash] = useState<FlashDirection>(null);
  const previousOddsRef = useRef(odds);

  useEffect(() => {
    if (previousOddsRef.current === odds) {
      return;
    }

    const direction: FlashDirection =
      odds < previousOddsRef.current ? 'shorten' : 'drift';
    previousOddsRef.current = odds;

    if (isSelected) {
      return;
    }

    setFlash(direction);

    const timeout = setTimeout(() => setFlash(null), FLASH_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [odds, isSelected]);

  const visibleFlash = isSelected ? null : flash;

  const ariaLabel =
    rest['aria-label'] ??
    `${label}, odds ${formatOdds(odds)}${suspended ? ', suspended' : ''}`;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={ariaLabel}
      disabled={suspended}
      data-flash={visibleFlash ?? undefined}
      data-selected={isSelected || undefined}
      data-suspended={suspended || undefined}
      onClick={suspended ? undefined : onToggle}
      className={cn(
        'flex min-w-16 flex-1 flex-col items-center gap-0.5 rounded-md border px-2 py-1.5 text-center transition-colors duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        suspended
          ? 'cursor-not-allowed border-border bg-muted/50 text-muted-foreground'
          : isSelected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-secondary text-secondary-foreground hover:border-primary/50 hover:bg-muted',
        !suspended &&
          visibleFlash === 'shorten' &&
          'border-green-500 bg-green-500/30 dark:bg-green-500/25',
        !suspended &&
          visibleFlash === 'drift' &&
          'border-red-500 bg-red-500/30 dark:bg-red-500/25',
        className,
      )}
    >
      {suspended ? (
        <Lock className="size-3.5" aria-hidden="true" />
      ) : (
        <>
          <span className="text-[11px] font-medium uppercase opacity-80">
            {label}
          </span>
          <span className="text-sm font-semibold tabular-nums">
            {formatOdds(odds)}
          </span>
        </>
      )}
    </button>
  );
}
