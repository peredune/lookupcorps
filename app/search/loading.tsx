import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSearch() {
  return (
    <section className="container py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-14 w-full rounded-full" />
      </div>
      <div className="mt-8 flex items-center justify-between">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="mt-4 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-4/5" />
          </div>
        ))}
      </div>
    </section>
  );
}
