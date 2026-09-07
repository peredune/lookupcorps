import { FileText, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/section";
import { formatDate } from "@/lib/utils";
import type { Filing } from "@/lib/types";

export function FilingsList({ filings }: { filings: Filing[] }) {
  if (!filings.length) return null;
  return (
    <Section
      eyebrow="Records"
      title="Recent filings"
      aside={
        <span className="text-xs text-muted-foreground">
          Latest {Math.min(filings.length, 12)} filings on record
        </span>
      }
    >
      <Card className="overflow-hidden">
        <ul>
          {filings.slice(0, 12).map((f) => (
            <li
              key={f.id}
              className="flex items-start gap-4 border-b border-border/70 px-6 py-4 last:border-b-0"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <p className="text-sm font-medium text-foreground">
                    {f.title}
                  </p>
                  {f.form && (
                    <span className="font-mono text-[11px] uppercase text-muted-foreground">
                      {f.form}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(f.date)} ·{" "}
                  {f.source === "edgar" ? "SEC EDGAR" : "Companies House"}
                </p>
              </div>
              {f.url && (
                <a
                  href={f.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
                >
                  Open <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </Section>
  );
}
