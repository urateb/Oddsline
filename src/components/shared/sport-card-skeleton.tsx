export function SportCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[5/4] h-full flex-col justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-xs"
    >
      <div className="flex items-start justify-between">
        <div className="size-11 animate-pulse rounded-xl bg-muted" />
        <div className="size-4 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-11 animate-pulse rounded-lg bg-muted" />
          <div className="h-11 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
