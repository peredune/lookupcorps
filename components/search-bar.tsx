"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchHit } from "@/lib/types";

type SearchBarProps = {
  size?: "hero" | "compact";
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
};

export function SearchBar({
  size = "hero",
  initialQuery = "",
  autoFocus,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [q, setQ] = React.useState(initialQuery);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [hits, setHits] = React.useState<SearchHit[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const abortRef = React.useRef<AbortController | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Debounced fetch
  React.useEffect(() => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/suggest?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { hits: SearchHit[] };
        setHits(data.hits ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setHits([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  // Close on outside click
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const submit = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || hits.length === 0) {
      if (e.key === "Enter") submit(q);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % hits.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? hits.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && hits[activeIndex]) {
        router.push(`/company/${hits[activeIndex].id}`);
        setOpen(false);
      } else {
        submit(q);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const isHero = size === "hero";

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      role="combobox"
      aria-expanded={open && hits.length > 0}
      aria-owns="search-suggestions"
      aria-haspopup="listbox"
    >
      <div
        className={cn(
          "group flex items-center gap-3 rounded-full border bg-background transition-all",
          "border-border shadow-[0_1px_0_hsl(var(--foreground)/0.02),0_10px_30px_-12px_hsl(var(--primary)/0.15)]",
          "focus-within:border-primary/50 focus-within:shadow-[0_1px_0_hsl(var(--foreground)/0.02),0_16px_44px_-14px_hsl(var(--primary)/0.35)]",
          isHero
            ? "h-14 pl-5 pr-2 md:h-16 md:pl-6 md:pr-3"
            : "h-11 pl-4 pr-2",
        )}
      >
        <Search
          className={cn(
            "text-muted-foreground shrink-0",
            isHero ? "h-5 w-5" : "h-4 w-4",
          )}
        />
        <input
          type="text"
          inputMode="search"
          spellCheck={false}
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Enter a company name, ticker, or domain"
          className={cn(
            "flex-1 bg-transparent outline-none placeholder:text-muted-foreground/70",
            isHero ? "text-base md:text-lg" : "text-sm",
          )}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
        <button
          type="button"
          onClick={() => submit(q)}
          aria-label="Search"
          className={cn(
            "shrink-0 rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isHero ? "h-11 w-11 md:h-12 md:w-12" : "h-8 w-8",
            "grid place-items-center",
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className={isHero ? "h-5 w-5" : "h-4 w-4"} />
          )}
        </button>
      </div>

      {open && q.trim().length >= 2 && (hits.length > 0 || loading) && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl animate-fade-in"
        >
          {loading && hits.length === 0 && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching…
            </div>
          )}
          {hits.map((hit, i) => (
            <Link
              key={hit.id}
              href={`/company/${hit.id}`}
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                i === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/60",
              )}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                {(hit.name ?? "??").slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">
                  {hit.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {[hit.jurisdictionLabel, hit.ticker && `${hit.ticker}`, hit.snippet]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
              {hit.ticker && (
                <span className="hidden sm:inline font-mono text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  {hit.ticker}
                </span>
              )}
            </Link>
          ))}
          {!loading && hits.length > 0 && (
            <button
              type="button"
              onClick={() => submit(q)}
              className="flex w-full items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground hover:bg-accent/60"
            >
              <span>See all results for &ldquo;{q}&rdquo;</span>
              <span className="inline-flex items-center gap-1">
                <CornerDownLeft className="h-3 w-3" /> Enter
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
