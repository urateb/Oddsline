import { cn } from '@/lib/utils';

export interface OddslineLogoProps {
  /** Rendered size in pixels (width and height). */
  size?: number;
  /** Layout overrides. */
  className?: string;
  /**
   * Accessible name when the logo is used alone.
   * Omit (or leave empty) when adjacent text already names the brand.
   */
  title?: string;
}

/** Oddsline brand mark — O with a live odds sparkline. */
export function OddslineLogo({
  size = 28,
  className,
  title,
}: OddslineLogoProps) {
  const isDecorative = !title;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={cn('shrink-0', className)}
      aria-hidden={isDecorative ? true : undefined}
      role={isDecorative ? undefined : 'img'}
    >
      {title ? <title>{title}</title> : null}
      <rect width="32" height="32" rx="7" fill="#0f1419" />
      <circle
        cx="16"
        cy="16"
        r="8.25"
        stroke="#ffffff"
        strokeWidth="3.25"
        fill="none"
      />
      <path
        d="M9.5 20.5 L13.75 15.25 L17 17.5 L23.5 9"
        stroke="#a3e635"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
