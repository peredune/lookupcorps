import { Search, ShieldCheck, CheckCheck, Building2, Globe2, TrendingUp } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { ExampleChips } from "@/components/example-chips";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-glow absolute inset-0" />
        <div className="absolute inset-0 bg-editorial-grid opacity-70" />

        {/* Floating decoration cards, echoing the reference */}
        <FloatingCards />

        <div className="container relative z-10 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Live data · OpenCorporates · SEC EDGAR · Companies House
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl md:leading-[1.05]">
              Access a global source of{" "}
              <span className="text-primary">Corporate Records</span> and{" "}
              <span className="text-primary">Public Filings</span>
            </h1>
            <p className="mt-6 text-base text-muted-foreground md:text-lg">
              Strengthen trust in your partnerships and supply chain. Search any
              company by name, ticker or domain.
            </p>

            <div className="mt-10">
              <SearchBar size="hero" autoFocus />
            </div>

            <ExampleChips className="mt-6" />
          </div>
        </div>
      </section>

      {/* Three steps */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Three steps to verify your data
            </h2>
            <p className="mt-4 text-muted-foreground">
              Start with a company name or ticker. Our layer over the world&rsquo;s
              open registries returns instant, structured results — logos,
              officers, filings, financials.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              n="01"
              icon={<Search className="h-5 w-5" />}
              title="Enter search"
              body="Type the company name, ticker, or website into the search bar. Autocomplete surfaces the strongest match as you type."
            />
            <Step
              n="02"
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Review results"
              body="Explore matching companies with jurisdiction, status and identifiers, backed by internationally accredited data."
            />
            <Step
              n="03"
              icon={<CheckCheck className="h-5 w-5" />}
              title="Verify details"
              body="Check location, filings, officers and the recognised authority behind each record — all on one page."
            />
          </div>
        </div>
      </section>

      {/* Coverage strip */}
      <section className="border-t border-border/60">
        <div className="container py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <Stat icon={<Globe2 className="h-5 w-5" />} kpi="200M+" label="Companies indexed across 130+ jurisdictions" />
            <Stat icon={<Building2 className="h-5 w-5" />} kpi="6" label="Free public data sources unified into one profile" />
            <Stat icon={<TrendingUp className="h-5 w-5" />} kpi="24h" label="Server-side cache so free-tier quotas last" />
          </div>
        </div>
      </section>
    </>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-[0_10px_30px_-15px_hsl(var(--primary)/0.25)]">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="font-mono text-xs text-muted-foreground">{n}</span>
      </div>
      <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function Stat({
  icon,
  kpi,
  label,
}: {
  icon: React.ReactNode;
  kpi: string;
  label: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-tight text-foreground">
          {kpi}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function FloatingCards() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <MiniCard className="absolute left-[8%] top-[22%] hidden md:block rotate-[-6deg]" swatch="bg-primary/70" width="w-28" />
      <MiniCard className="absolute right-[10%] top-[18%] hidden md:block rotate-[4deg]" swatch="bg-success/70" width="w-24" />
      <MiniCard className="absolute left-[4%] bottom-[18%] hidden lg:block rotate-[3deg]" swatch="bg-primary/40" width="w-32" tall />
      <MiniCard className="absolute right-[6%] bottom-[22%] hidden lg:block rotate-[-4deg]" swatch="bg-primary/60" width="w-28" tall />
    </div>
  );
}

function MiniCard({
  className,
  swatch,
  width,
  tall,
}: {
  className?: string;
  swatch: string;
  width: string;
  tall?: boolean;
}) {
  return (
    <div
      className={
        `${className} ${width} rounded-md border border-border bg-card p-2 shadow-[0_10px_30px_-15px_hsl(var(--foreground)/0.15)]`
      }
    >
      {tall ? (
        <>
          <div className="h-10 w-full rounded-sm bg-muted/70" />
          <div className={`mt-2 h-1.5 w-2/3 rounded-full ${swatch}`} />
          <div className="mt-1.5 h-1 w-1/2 rounded-full bg-muted" />
        </>
      ) : (
        <>
          <div className={`h-1.5 w-1/3 rounded-full ${swatch}`} />
          <div className="mt-2 h-1 w-full rounded-full bg-muted" />
          <div className="mt-1.5 h-1 w-2/3 rounded-full bg-muted" />
        </>
      )}
    </div>
  );
}
