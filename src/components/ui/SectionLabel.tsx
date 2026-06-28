import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

type SectionLabelTone = "on-light" | "on-dark";

interface SectionLabelProps {
  children: React.ReactNode;
  tone?: SectionLabelTone;
  className?: string;
  delay?: number;
}

export function SectionLabel({
  children,
  tone = "on-light",
  className,
  delay = 0,
}: SectionLabelProps) {
  return (
    <RevealOnScroll
      as="p"
      delay={delay}
      className={cn(
        "section-label",
        tone === "on-dark" ? "section-label--on-dark" : "section-label--on-light",
        className,
      )}
    >
      {children}
    </RevealOnScroll>
  );
}
