import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolveCompanyDetail } from "@/lib/api/detail";
import { CompanyHeader } from "@/components/company-header";
import { OverviewSection } from "@/components/overview-section";
import { OfficersTable } from "@/components/officers-table";
import { FilingsList } from "@/components/filings-list";
import { PublicSnapshotCard } from "@/components/public-snapshot";
import { SearchBar } from "@/components/search-bar";

type PageProps = { params: { id: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const company = await resolveCompanyDetail(params.id);
  if (!company) return { title: "Company not found" };
  const bits = [company.name, company.ticker, company.jurisdictionLabel]
    .filter(Boolean)
    .join(" · ");
  return {
    title: `${company.name}${company.ticker ? ` (${company.ticker})` : ""}`,
    description:
      company.wiki?.extract?.slice(0, 200) ??
      `${bits} — registry, filings and public-company details on LookupCorps.`,
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const company = await resolveCompanyDetail(params.id);
  if (!company) notFound();

  return (
    <>
      <div className="border-b border-border/60 bg-background">
        <div className="container py-6">
          <SearchBar size="compact" />
        </div>
      </div>

      <section className="container relative py-10 md:py-14">
        <CompanyHeader company={company} />

        <div className="mt-10 space-y-12">
          {company.publicSnapshot && (
            <PublicSnapshotCard snapshot={company.publicSnapshot} />
          )}
          <OverviewSection company={company} />
          <OfficersTable officers={company.officers} />
          <FilingsList filings={company.filings} />
        </div>

        {company.sources.length > 0 && (
          <div className="mt-16 flex flex-wrap items-center gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground">
            <span className="uppercase tracking-wider">Sources</span>
            {company.sources.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border px-2.5 py-0.5"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
