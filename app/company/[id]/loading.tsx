import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCompany() {
  return (
    <>
      <div className="border-b border-border/60">
        <div className="container py-6">
          <Skeleton className="h-14 w-full rounded-full" />
        </div>
      </div>
      <section className="container py-10 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-5">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        <div className="mt-12 space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-4 h-5 w-40" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
