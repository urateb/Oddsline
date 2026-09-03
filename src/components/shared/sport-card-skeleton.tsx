export function SportCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full items-center gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-xs"
    >
      <div className="size-12 shrink-0 animate-pulse rounded-xl bg-muted" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="h-5 w-28 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="size-4 shrink-0 animate-pulse rounded bg-muted" />
    </div>
  );
}
