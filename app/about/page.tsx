import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Database, Lock, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "LookupCorps unifies the world's open corporate registries — OpenCorporates, SEC EDGAR, Companies House and Wikipedia — into one clean company profile.",
};

export default function AboutPage() {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
          About
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          One clean profile, from every open registry.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          LookupCorps is a free layer over the world&rsquo;s open corporate
          data. We take four different registries, deduplicate them, enrich
          them with editorial context and public-company financials, and put
          the whole thing behind one search bar.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Feature
            icon={<Database className="h-5 w-5" />}
            title="Public sources, unified"
            body="OpenCorporates for global registries, SEC EDGAR for US filings, Companies House for UK companies, Wikipedia for editorial context and Clearbit for logos."
          />
          <Feature
            icon={<Zap className="h-5 w-5" />}
            title="Fast by default"
            body="A server-side cache with a 24h TTL protects every free-tier quota and keeps repeat lookups instant."
          />
          <Feature
            icon={<Lock className="h-5 w-5" />}
            title="Keys stay server-side"
            body="Every third-party call goes through our own API routes. API tokens never touch the browser."
          />
          <Feature
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Graceful when data is thin"
            body="Sections without data don't render as empty shells — they hide, so every profile feels intentional."
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Link href="/search" className={cn(buttonVariants())}>
            Try a search
          </Link>
          <Link
            href="https://github.com/peredune/lookupcorps"
            className={cn(buttonVariants({ variant: "outline" }))}
            target="_blank"
            rel="noreferrer noopener"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
