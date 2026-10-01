import { Skeleton } from "@/components/ui/skeleton";

export function TaskSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((col) => (
        <div key={col} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>

          <div className="space-y-3 p-2 rounded-xl bg-muted/20 border">
            {[1, 2].map((card) => (
              <div key={card} className="p-4 rounded-lg border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
