import Link from "next/link";
import { LogoMark } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-16">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <LogoMark className="h-4 w-4" />
          </span>
          <span>
            <span className="font-medium text-foreground">LookupCorps</span> ·
            Verify any company, instantly.
          </span>
        </div>

        <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:gap-6">
          <p>
            Powered by{" "}
            <FootLink href="https://opencorporates.com">OpenCorporates</FootLink>,{" "}
            <FootLink href="https://www.sec.gov/edgar">SEC EDGAR</FootLink>,{" "}
            <FootLink href="https://developer.company-information.service.gov.uk/">
              Companies House
            </FootLink>
            ,{" "}
            <FootLink href="https://en.wikipedia.org">Wikipedia</FootLink> and{" "}
            <FootLink href="https://clearbit.com/logo">Clearbit</FootLink>.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FootLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
    >
      {children}
    </Link>
  );
}
