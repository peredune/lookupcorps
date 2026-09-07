"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  { name: "Apple", id: "us-apple-inc" },
  { name: "Tesla", id: "us-tesla-inc" },
  { name: "Stripe", id: "us-stripe-inc" },
  { name: "OpenAI", id: "us-openai-inc" },
  { name: "Shopify", id: "ca-shopify-inc" },
];

export function ExampleChips({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      <span className="text-xs uppercase tracking-wider text-muted-foreground pr-1">
        Try
      </span>
      {EXAMPLES.map((ex) => (
        <Link
          key={ex.id}
          href={`/search?q=${encodeURIComponent(ex.name)}`}
          className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-foreground/80 backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
        >
          {ex.name}
        </Link>
      ))}
    </div>
  );
}
