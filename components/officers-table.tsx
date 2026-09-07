import { Card } from "@/components/ui/card";
import { Section } from "@/components/section";
import { formatDate } from "@/lib/utils";
import type { Officer } from "@/lib/types";

export function OfficersTable({ officers }: { officers: Officer[] }) {
  if (!officers.length) return null;
  const current = officers.filter((o) => !o.resignedOn);
  const shown = current.length ? current : officers;

  return (
    <Section eyebrow="People" title="Officers & directors">
      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)] gap-4 border-b border-border bg-muted/40 px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground md:grid">
          <div>Name</div>
          <div>Role</div>
          <div className="text-right">Appointed</div>
        </div>
        <ul>
          {shown.slice(0, 12).map((o, i) => (
            <li
              key={`${o.name}-${i}`}
              className="grid grid-cols-1 gap-1 border-b border-border/70 px-6 py-3 last:border-b-0 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)] md:gap-4 md:py-4"
            >
              <div className="font-medium text-foreground">{o.name}</div>
              <div className="text-sm text-muted-foreground">
                {o.role ?? "—"}
              </div>
              <div className="text-sm text-muted-foreground md:text-right">
                {formatDate(o.appointedOn) ?? "—"}
              </div>
            </li>
          ))}
        </ul>
        {shown.length > 12 && (
          <div className="border-t border-border px-6 py-3 text-xs text-muted-foreground">
            Showing 12 of {shown.length} officers on record.
          </div>
        )}
      </Card>
    </Section>
  );
}
