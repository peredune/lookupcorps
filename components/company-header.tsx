"use client";

import * as React from "react";
import Image from "next/image";
import { ExternalLink, Building2, MapPin, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CompanyDetail } from "@/lib/types";

function statusBadge(status: CompanyDetail["status"]) {
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

export function CompanyHeader({ company }: { company: CompanyDetail }) {
  const candidates = React.useMemo(() => {
    const list = company.logoCandidates ?? [];
    if (list.length) return list;
    return company.logoUrl ? [company.logoUrl] : [];
  }, [company.logoCandidates, company.logoUrl]);

  const [imgIndex, setImgIndex] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const currentSrc = candidates[imgIndex];
  const hasImage = imgIndex < candidates.length;

  const onCopy = async () => {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div className="relative">
      <div className="absolute inset-x-0 -top-16 h-40 bg-gradient-to-b from-primary/[0.06] to-transparent pointer-events-none" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-5">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-card">
            {hasImage && currentSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={currentSrc}
                src={currentSrc}
                alt=""
                onError={() => setImgIndex((i) => i + 1)}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <span className="text-xl font-semibold text-muted-foreground">
                {initials(company.name) || <Building2 className="h-8 w-8" />}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {company.name}
              </h1>
              {company.ticker && (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-sm text-primary">
                  {company.ticker}
                </span>
              )}
              {statusBadge(company.status)}
            </div>

            <dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              {company.jurisdictionLabel && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{company.jurisdictionLabel}</span>
                </div>
              )}
              {company.companyNumber && (
                <div>
                  <span className="text-xs uppercase tracking-wider">
                    Reg.
                  </span>{" "}
                  <span className="font-mono text-foreground/80">
                    {company.companyNumber}
                  </span>
                </div>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {company.domain ?? company.website.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </dl>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
