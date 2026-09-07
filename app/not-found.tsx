import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/logo";

export default function NotFound() {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <LogoMark className="h-8 w-8" />
        </div>
      </div>
      <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        404 · Not found
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        We couldn&rsquo;t find that page
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The link may be out of date, or the company profile has moved. Try a
        search — it&rsquo;s usually faster than guessing.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
        <Link href="/search" className={cn(buttonVariants())}>
          <Search className="h-4 w-4" />
          Search companies
        </Link>
      </div>
    </section>
  );
}
