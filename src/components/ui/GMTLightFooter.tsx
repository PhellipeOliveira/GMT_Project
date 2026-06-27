"use client";

import { useRef, useEffect } from "react";

/**
 * Secção decorativa de transição para o footer da Home.
 *
 * Efeito "lanterna": texto "GMT" gigante preto sobre fundo preto.
 * Ao mover o rato, um gradiente radial (mask-image CSS) revela
 * uma versão iluminada do texto centrada no cursor.
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

    // Dispositivos touch — iluminação estática no centro
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouch) {
      reveal.style.setProperty("--mx", "50%");
      reveal.style.setProperty("--my", "50%");
      reveal.style.opacity = "0.55";
      return;
    }

    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const { left, top } = container.getBoundingClientRect();
        reveal.style.setProperty("--mx", `${e.clientX - left}px`);
        reveal.style.setProperty("--my", `${e.clientY - top}px`);
      });
    };

    const onEnter = () => {
      reveal.style.opacity = "1";
    };

    const onLeave = () => {
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

  // Partilhado pelas duas camadas de texto — mesmo tamanho e família
  const textStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(8rem, 33vw, 36rem)",
    fontWeight: 500,
    lineHeight: 0.85,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: 0,
    padding: 0,
    userSelect: "none",
  };

  return (
    <section
      ref={containerRef}
      aria-label="GMT"
      className="not-prose relative overflow-hidden bg-black py-12 md:py-20"
    >
      {/* ── Camada base: texto quase invisível ──────────────────────── */}
      <p
        aria-hidden
        className="text-center"
        style={{ ...textStyle, color: "#111111" }}
      >
        GMT
      </p>

      {/* ── Camada reveal: mascarada ao cursor ──────────────────────── */}
      <div
        ref={revealRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={
          {
            // Opacidade inicial — será modificada pelo JS
            opacity: 0,
            // Transição suave de entrada/saída
            transition: "opacity 0.5s ease",

            // CSS variables iniciais (serão sobrescritas pelo JS no primeiro mousemove)
            "--mx": "50%",
            "--my": "50%",

            // A máscara lê var(--mx) e var(--my) que são atualizadas via JS
            // sem re-renderização React — instantâneo via rAF
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
        <p
          className="text-center"
          style={{ ...textStyle, color: "#d4d4d4" }}
        >
          GMT
        </p>
      </div>
    </section>
  );
}
