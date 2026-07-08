"use client";

import type { ElementType, ReactNode } from "react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

type SectionHeaderTone = "on-light" | "on-dark";

export interface SectionHeaderProps {
  /**
   * Eyebrow (label) da secção.
   *
   * Use para indicar a **categoria** da secção (ex.: "Serviços", "Portfólio",
   * "Contacto", "O processo"). Nesta fase o componente é um *drop-in replacement*,
   * portanto não valida nem altera texto automaticamente.
   */
  eyebrow?: ReactNode;
  /**
   * Título principal da secção.
   *
   * Use para comunicar a **mensagem** da secção (ex.: "O que fazemos",
   * "Trabalhos recentes", "Vamos conversar").
   */
  title: ReactNode;
  /**
   * Tom do cabeçalho (`on-light` / `on-dark`).
   *
   * Serve apenas como *default* de cor quando não estás a passar `eyebrowClassName`.
   * Para preservar o visual exactamente como existe em cada página, preferir
   * passar explicitamente as classes (fase 1).
   */
  tone?: SectionHeaderTone;
  /**
   * Quando `true`, renderiza eyebrow no formato "barra + label em linha".
   *
   * Isto permite substituir o padrão "Kicker" (barra accent + `.type-label`)
   * sem reescrever markup nas páginas.
   */
  accentBar?: boolean;
  /**
   * Tag/elemento do eyebrow.
   *
   * Fase 1: usar para preservar a tag actual (ex.: o projecto tem lugares onde o
   * "label" estava num `h2` por motivos históricos — isto será corrigido na fase 2).
   */
  eyebrowAs?: ElementType;
  /**
   * Tag/elemento do título.
   *
   * Fase 1: usar para preservar `h1`/`h2` actuais por página (a semântica será
   * padronizada na fase 2).
   */
  titleAs?: ElementType;
  /** Classes CSS aplicadas ao eyebrow (no modo não-`accentBar`). */
  eyebrowClassName?: string;
  /** Classes CSS aplicadas ao título. */
  titleClassName?: string;
  /**
   * Classes do wrapper externo.
   *
   * No modo `accentBar`, aplica-se ao wrapper do eyebrow (barra+label),
   * preservando o markup do padrão existente.
   */
  className?: string;
  /** Delay adicional do reveal do eyebrow. */
  eyebrowDelay?: number;
  /** Delay adicional do reveal do título. */
  titleDelay?: number;
}

function defaultEyebrowColor(tone: SectionHeaderTone) {
  return tone === "on-dark" ? "text-white" : "text-gmt-text";
}

/**
 * `SectionHeader` — Cabeçalho editorial unificado (eyebrow + título).
 *
 * Objetivo: consolidar a arquitectura de cabeçalhos do projecto num único
 * componente reutilizável, **sem alterar** o resultado visual nesta fase.
 *
 * - Fase 1 (actual): componente pensado como *drop-in replacement*.
 *   Usa `RevealOnScroll` (e portanto funciona bem dentro de `RevealSequence`)
 *   e permite manter o markup/classes existentes por página via props.
 * - Fase 2 (futura): padronização semântica (um `h1` por página, secções em `h2`,
 *   eyebrow não-heading) + limpeza de componentes antigos.
 *
 * ### Exemplo (piloto /contacto)
 *
 * ```tsx
 * <SectionHeader
 *   eyebrow="Contacto"
 *   title="Vamos conversar"
 *   tone="on-light"
 *   eyebrowAs="h2"
 *   eyebrowClassName="type-section-title text-gmt-text block text-left"
 *   titleAs="h1"
 *   titleClassName="type-h2 mt-6 max-w-3xl"
 * />
 * ```
 *
 * ### Exemplo (variante com barra)
 *
 * ```tsx
 * <SectionHeader
 *   accentBar
 *   eyebrow="O processo"
 *   title="Como funciona"
 *   titleAs="h2"
 *   titleClassName="type-section-title"
 * />
 * ```
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
          eyebrowClassName ?? defaultEyebrowColor(tone),
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
