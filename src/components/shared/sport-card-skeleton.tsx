export function SportCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-square h-full flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs"
    >
      <div className="flex items-start justify-between">
        <div className="size-14 animate-pulse rounded-2xl bg-muted" />
        <div className="size-4 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-6 w-28 animate-pulse rounded-md bg-muted" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-14 animate-pulse rounded-xl bg-muted" />
          <div className="h-14 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
