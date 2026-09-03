import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SportCardSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
