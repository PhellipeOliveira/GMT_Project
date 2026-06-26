import Link from "next/link";
import { cn } from "@/lib/utils";

type GmtLogoTone = "on-light" | "on-dark";

interface GmtLogoProps {
  /** `on-light` = fundo claro → texto preto; `on-dark` = fundo escuro → texto branco */
  tone?: GmtLogoTone;
  className?: string;
  asLink?: boolean;
}

export function GmtLogo({
  tone = "on-light",
  className,
  asLink = false,
}: GmtLogoProps) {
  const mark = (
    <span
      className={cn(
        "type-logo-gmt inline-block select-none",
        tone === "on-dark" ? "logo-gmt--on-dark" : "logo-gmt--on-light",
        className,
      )}
    >
      GMT
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex items-center" aria-label="GMT — início">
        {mark}
      </Link>
    );
  }

  return mark;
}
