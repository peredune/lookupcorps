import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/section";
import type { PublicSnapshot } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

function fmtCurrency(v: number | null | undefined, currency = "USD"): string {
  if (v === null || v === undefined) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(v);
  } catch {
    return v.toFixed(2);
  }
}

export function PublicSnapshotCard({
  snapshot,
}: {
  snapshot: PublicSnapshot;
}) {
  const positive = (snapshot.changePct ?? 0) >= 0;

  return (
    <Section
      eyebrow="Public company"
      title="Market snapshot"
      aside={
        snapshot.exchange && (
          <span className="text-xs text-muted-foreground">
            {snapshot.exchange} · {snapshot.ticker}
          </span>
        )
      }
    >
      <Card className="p-6">
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <div className="font-mono text-3xl font-semibold tracking-tight md:text-4xl">
              {fmtCurrency(snapshot.price, snapshot.currency ?? "USD")}
            </div>
            {snapshot.changePct !== null && snapshot.changePct !== undefined && (
              <div
                className={`mt-1 inline-flex items-center gap-1 text-sm font-medium ${
                  positive ? "text-success" : "text-destructive"
                }`}
              >
                {positive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {positive ? "+" : ""}
                {snapshot.changePct.toFixed(2)}% today
              </div>
            )}
          </div>

          <div className="ml-auto grid flex-1 grid-cols-2 gap-6 sm:grid-cols-4 min-w-0">
            <Stat label="Market cap" value={snapshot.marketCap ? "$" + formatNumber(snapshot.marketCap) : "—"} />
            <Stat label="P/E ratio" value={snapshot.peRatio ? snapshot.peRatio.toFixed(1) : "—"} />
            <Stat label="52w high" value={fmtCurrency(snapshot.weekHigh52, snapshot.currency ?? "USD")} />
            <Stat label="52w low" value={fmtCurrency(snapshot.weekLow52, snapshot.currency ?? "USD")} />
          </div>
        </div>
      </Card>
    </Section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm text-foreground">{value}</div>
    </div>
  );
}
