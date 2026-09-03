'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useUiStore } from '@/stores/ui-store';

export interface RgBannerProps {
  message: string;
  helplineUrl: string;
  helplinePhone: string;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

export function RgBanner({
  message,
  helplineUrl,
  helplinePhone,
}: RgBannerProps) {
  const isDismissed = useUiStore((state) => state.isRgBannerDismissed);
  const dismiss = useUiStore((state) => state.dismissRgBanner);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground sm:px-6">
      <span className="min-w-[200px] flex-1">{message}</span>
      <span className="tabular-nums" aria-label="Session duration">
        Session: {formatDuration(elapsedSeconds)}
      </span>
      <button
        type="button"
        className="underline underline-offset-2 hover:text-foreground"
        onClick={() =>
          toast.info(
            'Deposit limits are managed from your account settings (mock).',
          )
        }
      >
        Set Deposit Limit
      </button>
      <a
        href={helplineUrl}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 hover:text-foreground"
      >
        {helplinePhone}
      </a>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Dismiss responsible gambling banner"
        onClick={dismiss}
      >
        <X />
      </Button>
    </div>
  );
}
