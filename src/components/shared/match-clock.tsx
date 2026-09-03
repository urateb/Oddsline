import { formatMatchMinute } from '@/lib/events';
import { cn } from '@/lib/utils';

export interface MatchClockProps {
  /** Running minute; `0` for sports without a minute clock (e.g. tennis). */
  minute: number;
  /** Period indicator, e.g. `"2H"`, `"Set 3"`. */
  period: string;
  /** When true, shows a pulsing live indicator dot. */
  isRunning: boolean;
  /** Layout overrides. */
  className?: string;
}

export function MatchClock({
  minute,
  period,
  isRunning,
  className,
}: MatchClockProps) {
  const minuteLabel = formatMatchMinute(minute);

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400',
        className,
      )}
    >
      {isRunning && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
      )}
      <span>{[minuteLabel, period].filter(Boolean).join(' · ')}</span>
    </div>
  );
}
