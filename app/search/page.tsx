import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchBar } from "@/components/search-bar";
import { CompanyCard } from "@/components/company-card";
import { SearchFilters } from "@/components/search-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { unifiedSearch } from "@/lib/api/search";
import type { SearchHit } from "@/lib/types";
import { Search, Info } from "lucide-react";

type PageProps = {
  searchParams: {
    q?: string;
    jurisdiction?: string;
    status?: string;
  };
};

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const q = searchParams.q?.trim();
  return {
    title: q ? `Results for "${q}"` : "Search",
    description: q
      ? `Companies matching "${q}" across OpenCorporates, SEC EDGAR and Companies House.`
      : "Search 200M+ companies across the world's open registries.",
  };
}

export default function SearchPage({ searchParams }: PageProps) {
  const q = searchParams.q?.trim() ?? "";
  return (
    <section className="container py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <SearchBar size="hero" initialQuery={q} />
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {q ? (
              <>
                Results for{" "}
                <span className="text-primary">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              "Start typing to search"
            )}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Backed by OpenCorporates, SEC EDGAR and Companies House.
          </p>
        </div>
        <SearchFilters />
      </div>

      <div className="mt-8">
        {q ? (
          <Suspense fallback={<ResultsSkeleton />} key={JSON.stringify(searchParams)}>
            <Results
              q={q}
              jurisdiction={searchParams.jurisdiction}
              status={searchParams.status}
            />
          </Suspense>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}

async function Results({
  q,
  jurisdiction,
  status,
}: {
  q: string;
  jurisdiction?: string;
  status?: string;
}) {
  let hits: SearchHit[] = await unifiedSearch(q, 30);
  if (jurisdiction && jurisdiction !== "all") {
    hits = hits.filter((h) => (h.jurisdiction ?? "").split("_")[0] === jurisdiction);
  }
  if (status && status !== "all") {
    hits = hits.filter((h) => h.status === status);
  }

  if (hits.length === 0) return <NoResults q={q} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {hits.map((hit) => (
        <CompanyCard key={hit.id} hit={hit} />
      ))}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-6 flex items-center justify-between">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
        <Search className="h-5 w-5" />
      </div>
      <p className="mt-4 font-medium">Enter a company name, ticker or domain</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Autocomplete surfaces results across every connected registry.
      </p>
    </div>
  );
}

function NoResults({ q }: { q: string }) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
        <Info className="h-5 w-5" />
      </div>
      <p className="mt-4 font-medium">
        No matches for &ldquo;{q}&rdquo;
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Try a shorter query, the full legal name, or the ticker symbol. If you
        expect UK results, set{" "}
        <code className="font-mono">COMPANIES_HOUSE_API_KEY</code> in{" "}
        <code className="font-mono">.env.local</code>.
      </p>
    </div>
  );
}
