"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const JURISDICTIONS = [
  { value: "all", label: "All jurisdictions" },
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
];

const STATUSES = [
  { value: "all", label: "Any status" },
  { value: "active", label: "Active" },
  { value: "dissolved", label: "Dissolved" },
  { value: "inactive", label: "Inactive" },
];

export function SearchFilters() {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete(key);
    else next.set(key, value);
    router.replace(`${path}?${next.toString()}`);
  };

  const jurisdiction = params.get("jurisdiction") ?? "all";
  const status = params.get("status") ?? "all";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterGroup
        label="Jurisdiction"
        options={JURISDICTIONS}
        value={jurisdiction}
        onChange={(v) => setParam("jurisdiction", v)}
      />
      <FilterGroup
        label="Status"
        options={STATUSES}
        value={status}
        onChange={(v) => setParam("status", v)}
      />
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative inline-flex items-center gap-2 rounded-full border border-border bg-background pl-4 pr-2 py-1.5 text-sm">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "appearance-none bg-transparent text-sm font-medium text-foreground pr-6 pl-1 py-0.5 focus:outline-none",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-background text-foreground">
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-muted-foreground"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
      </svg>
    </label>
  );
}
