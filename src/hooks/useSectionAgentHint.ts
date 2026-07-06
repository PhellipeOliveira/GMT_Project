"use client";

import { useEffect, useState } from "react";

/**
 * Observa elementos com `data-agent-hint="..."` e devolve o hint da seção
 * mais visível no viewport. Retorna `null` quando nenhuma seção anotada
 * está visível — nesse caso o chamador usa o label da rota como fallback.
 *
 * SSR-safe: só ativa o IntersectionObserver no cliente.
 */
export function useSectionAgentHint(): string | null {
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-agent-hint]"),
    );
    if (nodes.length === 0) return;

    // Mantém a razão de interseção de cada seção para eleger a mais visível.
    const ratios = new Map<HTMLElement, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target as HTMLElement,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let best: HTMLElement | null = null;
        let bestRatio = 0;
        for (const [el, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = el;
            bestRatio = ratio;
          }
        }

        const next = best?.dataset.agentHint?.trim() || null;
        setHint((prev) => (prev === next ? prev : next));
      },
      // Vários thresholds para escolher bem qual seção domina o viewport.
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return hint;
}
