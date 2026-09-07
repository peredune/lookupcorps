"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
        Something didn&rsquo;t load
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        One of the data sources timed out or is temporarily unavailable. This
        usually resolves within a few seconds.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </section>
  );
}
