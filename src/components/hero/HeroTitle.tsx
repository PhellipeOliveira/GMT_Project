"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Título final da hero (estado de repouso).
 *
 * A animação de entrada (divs geométricas + letras + impacto "GMT") é da
 * responsabilidade do <Preloader/>, que sobrepõe um overlay idêntico e nesta
 * exacta posição — por isso aqui o título já está no sítio final e só recebe a
 * animação de SCROLL (deslize parcial + barra "APRESENTAMOS").
 *
 * prefers-reduced-motion: lido directamente via matchMedia para decidir, sem
 * flash, se registamos ou não o ScrollTrigger. O markup é sempre o estado final.
 */
export function HeroTitle() {
  const rootRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Elemento real (não selector string) para não colidir com o escopo do
      // gsap.context — a section #hero é ancestral deste root, não descendente.
      const heroEl = rootRef.current?.closest<HTMLElement>("#hero");
      if (!heroEl) return;

      const bar = document.getElementById("hero-bar");
      const barText = document.getElementById("hero-bar-text");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Deslize parcial: "GMT" para a direita, subtítulo para a esquerda.
      tl.to(brandRef.current, { xPercent: 38, ease: "none", duration: 1 }, 0);
      tl.to(subtitleRef.current, { xPercent: -38, ease: "none", duration: 1 }, 0);

      if (bar) {
        // A barra surge no arranque do scroll e faz um único ciclo de cor.
        tl.to(bar, { opacity: 1, ease: "none", duration: 0.12 }, 0);
        tl.to(bar, { backgroundColor: "#ffffff", ease: "none", duration: 1 }, 0);
      }
      if (barText) {
        tl.to(barText, { color: "#000000", ease: "none", duration: 1 }, 0);
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-center gap-6"
      aria-label="GMT – Growth Marketing Technology"
    >
      <h1
        ref={brandRef}
        className="hero-line gmt-brand gmt-brand--hero text-center text-white"
      >
        GMT
      </h1>
      <p
        ref={subtitleRef}
        className="hero-line type-hero-subtitle select-none text-center text-white"
      >
        Growth Marketing Technology
      </p>
    </div>
  );
}
