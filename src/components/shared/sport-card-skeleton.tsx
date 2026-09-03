export function SportCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-3.5 shadow-xs"
    >
      <div className="size-9 shrink-0 animate-pulse rounded-lg bg-muted" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
