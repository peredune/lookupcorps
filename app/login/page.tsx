import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to LookupCorps.",
};

export default function LoginPage() {
  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-[0_10px_40px_-20px_hsl(var(--primary)/0.25)]">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
          <LogoMark className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Accounts are on the way. Save searches, follow companies and get
          filing alerts — sign up when the doors open.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          Waitlist opens soon
        </div>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "mt-6 w-full")}
        >
          Back to search
        </Link>
      </div>
    </section>
  );
}
