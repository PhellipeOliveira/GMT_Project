"use client";

import type { ElementType, ReactNode } from "react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

type SectionHeaderTone = "on-light" | "on-dark";

export interface SectionHeaderProps {
  /** Categoria da secção — não deve repetir o título (fase 2). */
  eyebrow?: ReactNode;
  /** Mensagem principal da secção. */
  title: ReactNode;
  tone?: SectionHeaderTone;
  /** Barra accent + eyebrow em linha (padrão Kicker em `/servicos/[slug]`). */
  accentBar?: boolean;
  /** Elemento HTML do eyebrow — fase 1: preserva tags actuais por página. */
  eyebrowAs?: ElementType;
  /** Elemento HTML do título — fase 1: preserva h1/h2 actuais. */
  titleAs?: ElementType;
  eyebrowClassName?: string;
  titleClassName?: string;
  className?: string;
  eyebrowDelay?: number;
  titleDelay?: number;
}

function toneTitleColor(tone: SectionHeaderTone) {
  return tone === "on-dark" ? "text-white" : "text-gmt-text";
}

/**
 * Cabeçalho editorial unificado — eyebrow + título.
 *
 * Fase 1: reproduz exactamente o markup/classes das implementações anteriores
 * (`SectionLabel`, `Kicker`, pares manuais). Props `eyebrowAs`, `titleAs` e
 * `*ClassName` permitem preservar h1/h2 e tipografia actuais por página.
 */
export function SectionHeader({
  eyebrow,
  title,
  tone = "on-light",
  accentBar = false,
  eyebrowAs = "p",
  titleAs = "h2",
  eyebrowClassName,
  titleClassName,
  className,
  eyebrowDelay = 0,
  titleDelay = 0,
}: SectionHeaderProps) {
  const hasEyebrow = eyebrow != null && eyebrow !== "";

  const eyebrowReveal = hasEyebrow ? (
    accentBar ? (
      <RevealOnScroll
        variant="media"
        delay={eyebrowDelay}
        className={cn("mb-5 flex items-center gap-3", className)}
      >
        <span className="h-px w-8 shrink-0 bg-gmt-accent" aria-hidden />
        <span className={cn("type-label text-gmt-text", eyebrowClassName)}>
          {eyebrow}
        </span>
      </RevealOnScroll>
    ) : (
      <RevealOnScroll
        as={eyebrowAs}
        delay={eyebrowDelay}
        className={cn(
          eyebrowClassName,
          !eyebrowClassName?.includes("text-") && toneTitleColor(tone),
        )}
      >
        {eyebrow}
      </RevealOnScroll>
    )
  ) : null;

  const titleReveal = (
    <RevealOnScroll as={titleAs} delay={titleDelay} className={titleClassName}>
      {title}
    </RevealOnScroll>
  );

  if (accentBar) {
    return (
      <>
        {eyebrowReveal}
        {titleReveal}
      </>
    );
  }

  if (!hasEyebrow) {
    return titleReveal;
  }

  return (
    <div className={className}>
      {eyebrowReveal}
      {titleReveal}
    </div>
  );
}
