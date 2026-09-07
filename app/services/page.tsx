import type { Metadata } from "next";
import Link from "next/link";
import { Search, Building2, TrendingUp, FileText, Users, Globe2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "What you can look up on LookupCorps — company registrations, officers, filings, tickers and public-company financials.",
};

const SERVICES = [
  {
    icon: <Search className="h-5 w-5" />,
    title: "Instant company search",
    body: "Search by legal name, ticker or domain — autocomplete suggests the strongest match while you type.",
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    title: "Registry profiles",
    body: "Jurisdiction, registration number, incorporation date, registered address and current status from OpenCorporates and Companies House.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Officers & directors",
    body: "See who leads a company — current appointments and roles surfaced directly from the primary registry.",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Filings",
    body: "Recent SEC filings for US public companies and full statutory filings for UK companies, with deep links to each document.",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Public-company snapshot",
    body: "Price, day change, market cap, P/E and 52-week range for tickered companies (feature-flagged on FINNHUB_API_KEY).",
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Global coverage",
    body: "200M+ companies across 130+ jurisdictions via OpenCorporates, with editorial context from Wikipedia and logos from Clearbit.",
  },
];

export default function ServicesPage() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
          Services
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          Everything you can look up
        </h1>
        <p className="mt-4 text-muted-foreground">
          Free, unified corporate intelligence for founders, journalists,
          researchers and vendor-onboarding teams.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-[0_10px_30px_-15px_hsl(var(--primary)/0.2)]"
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              {s.icon}
            </div>
            <h3 className="mt-5 font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
        <Link href="/search" className={cn(buttonVariants())}>
          Start searching
        </Link>
      </div>
    </section>
  );
}
