import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Minimalist microscope mark — thin strokes, currentColor for theming.
 * Sized by className (default h-6 w-6). Wrapped as a Link when as="link".
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      aria-hidden="true"
    >
      {/* Eyepiece + arm angled to feel like a real microscope */}
      <path d="M7 3.5h4" />
      <path d="M9 3.5v3.5" />
      <path d="M8 7h2a2 2 0 0 1 2 2v4.5" />
      {/* Objective barrel */}
      <path d="M9 13.5h4.5v3.5H9z" />
      {/* Stage */}
      <path d="M6 17.5h11" />
      <path d="M6 17.5v2.5h11v-2.5" />
      {/* Base */}
      <path d="M5 20.5h13" />
      {/* Accent focus dot on eyepiece */}
      <circle cx="9" cy="5.25" r="0.75" className="fill-current opacity-70" strokeWidth="0" />
    </svg>
  );
}

export function Logo({
  className,
  wordmarkClassName,
  href = "/",
}: {
  className?: string;
  wordmarkClassName?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-foreground",
        className,
      )}
      aria-label="LookupCorps home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        <LogoMark className="h-5 w-5" />
      </span>
      <span
        className={cn(
          "text-[15px] font-semibold tracking-tight",
          wordmarkClassName,
        )}
      >
        LookupCorps
      </span>
    </Link>
  );
}
