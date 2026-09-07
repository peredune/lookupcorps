import { cn } from "@/lib/utils";

/** Consistent section shell: eyebrow + title + optional aside + content. */
export function Section({
  eyebrow,
  title,
  aside,
  children,
  className,
}: {
  eyebrow?: string;
  title?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("scroll-mt-24", className)}>
      {(eyebrow || title || aside) && (
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.16em] text-primary/80">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                {title}
              </h2>
            )}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}
