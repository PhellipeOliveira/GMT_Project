"use client";

import { useRef, useEffect } from "react";

/**
 * GMT Lantern — transição visual global acima do Footer Navigation.
 *
 * Efeito "lanterna": texto "GMT" gigante preto sobre fundo preto.
 * Ao mover o rato, um gradiente radial (mask-image CSS) revela
 * uma versão iluminada do texto centrada no cursor.
 *
 * Montagem: `src/app/layout.tsx`, imediatamente **antes** de `<Footer />`,
 * em todas as páginas.
 *
 * Técnica:
 *  - Camada base  : texto #111 — invisível sobre bg-black
 *  - Camada reveal: texto #d4d4d4 mascarado por radial-gradient
 *                   centrado em var(--mx) / var(--my)
 *
 * Performance:
 *  - Sem estado React (zero re-renders após mount)
 *  - Atualização via element.style.setProperty() dentro de rAF
 *  - maskImage atualiza instantaneamente via CSS variable
 *
 * Mobile/touch: iluminação estática centrada (fallback elegante)
 */
export function GMTLightFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const reveal = revealRef.current;
    if (!container || !reveal) return;

    const resetMaskCenter = () => {
      reveal.style.setProperty("--mx", "50%");
      reveal.style.setProperty("--my", "50%");
    };

    resetMaskCenter();

    // Dispositivos touch — iluminação estática no centro
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouch) {
      reveal.style.opacity = "0.55";
      return;
    }

    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        reveal.style.setProperty("--mx", `${x}%`);
        reveal.style.setProperty("--my", `${y}%`);
      });
    };

    const onEnter = () => {
      reveal.style.opacity = "1";
    };

    const onLeave = () => {
      resetMaskCenter();
      reveal.style.opacity = "0";
    };

    container.addEventListener("mousemove", onMove, { passive: true });
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const textClass = "gmt-brand gmt-brand--footer m-0 p-0 text-center";

  return (
    <section
      ref={containerRef}
      aria-label="GMT"
      className="not-prose relative overflow-hidden bg-black py-[2.04rem] md:py-[3.4rem]"
    >
      {/* Ambas as camadas partilham o mesmo contentor centrado — alinhamento idêntico */}
      <div className="relative flex w-full items-center justify-center">
        {/* ── Camada base: texto quase invisível ──────────────────────── */}
        <p aria-hidden className={textClass} style={{ color: "#111111" }}>
          GMT
        </p>

        {/* ── Camada reveal: mascarada ao cursor ──────────────────────── */}
        <div
          ref={revealRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={
            {
              opacity: 0,
              transition: "opacity 0.5s ease",
              "--mx": "50%",
              "--my": "50%",
              maskImage: [
                "radial-gradient(",
                "  circle 20vw at var(--mx) var(--my),",
                "  rgba(255,255,255,0.95) 0%,",
                "  rgba(255,255,255,0.6)  25%,",
                "  rgba(255,255,255,0.15) 50%,",
                "  transparent            70%",
                ")",
              ].join(""),
              WebkitMaskImage: [
                "radial-gradient(",
                "  circle 20vw at var(--mx) var(--my),",
                "  rgba(255,255,255,0.95) 0%,",
                "  rgba(255,255,255,0.6)  25%,",
                "  rgba(255,255,255,0.15) 50%,",
                "  transparent            70%",
                ")",
              ].join(""),
            } as React.CSSProperties
          }
        >
          <p className={textClass} style={{ color: "#d4d4d4" }}>
            GMT
          </p>
        </div>
      </div>
    </section>
  );
}
