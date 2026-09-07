import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/section";
import { formatDate } from "@/lib/utils";
import type { CompanyDetail } from "@/lib/types";

export function OverviewSection({ company }: { company: CompanyDetail }) {
  const facts: Array<{ label: string; value: React.ReactNode | null }> = [
    { label: "Jurisdiction", value: company.jurisdictionLabel },
    {
      label: "Incorporated",
      value: formatDate(company.incorporationDate),
    },
    { label: "Registration", value: company.companyNumber ? <span className="font-mono">{company.companyNumber}</span> : null },
    { label: "CIK", value: company.cik ? <span className="font-mono">{company.cik}</span> : null },
    { label: "Ticker", value: company.ticker ? <span className="font-mono">{company.ticker}</span> : null },
    { label: "Registered address", value: company.address },
  ].filter((f) => Boolean(f.value));

  const wiki = company.wiki;

  if (!wiki?.extract && facts.length === 0) return null;

  return (
    <Section eyebrow="Overview" title="About">
      <Card className="p-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            {wiki?.extract ? (
              <p className="text-sm leading-relaxed text-foreground/90 md:text-[15px]">
                {wiki.extract}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No editorial summary available for this entity yet.
              </p>
            )}
            {wiki?.wikipediaUrl && (
              <a
                href={wiki.wikipediaUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Read on Wikipedia <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {facts.length > 0 && (
            <dl className="grid gap-3 md:border-l md:border-border md:pl-6">
              {facts.map((f) => (
                <div key={f.label} className="grid gap-0.5">
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="text-sm text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </Card>
    </Section>
  );
}
