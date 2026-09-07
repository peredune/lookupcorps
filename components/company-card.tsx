import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SearchHit } from "@/lib/types";
import { cn } from "@/lib/utils";

function statusBadge(status: SearchHit["status"]) {
  switch (status) {
    case "active":
      return <Badge variant="success">Active</Badge>;
    case "dissolved":
      return <Badge variant="destructive">Dissolved</Badge>;
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

function initials(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function CompanyCard({ hit }: { hit: SearchHit }) {
  return (
    <Link href={`/company/${hit.id}`} className="group block h-full">
      <Card
        className={cn(
          "flex h-full flex-col p-5 transition-all",
          "hover:border-primary/30 hover:shadow-[0_10px_30px_-15px_hsl(var(--primary)/0.25)] hover:-translate-y-0.5",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
              {initials(hit.name) || <Building2 className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {hit.name}
                </h3>
                {hit.ticker && (
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                    {hit.ticker}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {[hit.jurisdictionLabel, hit.companyNumber && `#${hit.companyNumber}`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {hit.snippet && (
          <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
            {hit.snippet}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          {statusBadge(hit.status)}
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {sourceLabel(hit.source)}
          </span>
        </div>
      </Card>
    </Link>
  );
}

function sourceLabel(s: SearchHit["source"]): string {
  switch (s) {
    case "edgar":
      return "SEC EDGAR";
    case "companies-house":
      return "Companies House";
    case "opencorporates":
      return "OpenCorporates";
    default:
      return "Curated";
  }
}
