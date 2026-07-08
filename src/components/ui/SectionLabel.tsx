import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

type SectionLabelTone = "on-light" | "on-dark";
type SectionLabelVariant = "eyebrow" | "title";

interface SectionLabelProps {
  children: React.ReactNode;
  tone?: SectionLabelTone;
  variant?: SectionLabelVariant;
  className?: string;
  delay?: number;
}

/**
 * @deprecated Use {@link SectionHeader} from `@/components/ui/SectionHeader`.
 * Mantido durante a migração incremental (fase 1). Remoção prevista na fase 2,
 * após validação visual de todas as páginas.
 */
export function SectionLabel({
  children,
  tone = "on-light",
  variant = "eyebrow",
  className,
  delay = 0,
}: SectionLabelProps) {
  const isTitle = variant === "title";

  return (
    <RevealOnScroll
      as={isTitle ? "h2" : "p"}
      delay={delay}
      className={cn(
        isTitle ? "type-section-title" : "section-label",
        !isTitle &&
          (tone === "on-dark"
            ? "section-label--on-dark"
            : "section-label--on-light"),
        isTitle && (tone === "on-dark" ? "text-white" : "text-gmt-text"),
        className,
      )}
    >
      {children}
    </RevealOnScroll>
  );
}
