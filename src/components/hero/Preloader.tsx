"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  SCROLL_LOCK_EVENT,
  SCROLL_UNLOCK_EVENT,
} from "@/components/ui/SmoothScroll";

const SESSION_KEY = "gmt:preloaded";
const SUBTITLE = "Growth Marketing Technology";

/** Split manual em spans (evita dependência de SplitText). */
function chars(text: string) {
  return text.split("").map((c, i) => ({
    ch: c === " " ? "\u00A0" : c,
    key: `${c}-${i}`,
  }));
}

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  // "pending" cobre o 1º paint (evita flash da hero); depois corre ou termina.
  const [phase, setPhase] = useState<"pending" | "run" | "done">("pending");

  useEffect(() => {
    // Decisão só no cliente: mantém "pending" no SSR e no 1º render do cliente
    // (mesmo markup → sem mismatch de hidratação nem flash da hero). Por isso o
    // setState síncrono aqui é intencional (não é um efeito cascata evitável).
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (reduced || seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      return;
    }
    setPhase("run");
  }, []);

  useEffect(() => {
    if (phase !== "run") return;
    const root = rootRef.current;
    if (!root) return;

    // Bloquear scroll (nativo + Lenis, via evento que o SmoothScroll escuta em window)
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.__gmtScrollLocked = true;
    window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));

    const unlock = () => {
      html.style.overflow = prevOverflow;
      window.__gmtScrollLocked = false;
      window.dispatchEvent(new Event(SCROLL_UNLOCK_EVENT));
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("done");
    };

    let ctx: ReturnType<typeof gsap.context> | null = null;
    let cancelled = false;

    const build = () => {
      if (cancelled || !rootRef.current) return;

      ctx = gsap.context(() => {
        const q = gsap.utils.selector(root);
        const p1 = q(".pl-p1"); // branco — sobe (baixo→cima)
        const p2 = q(".pl-p2"); // preto  — entra da direita
        const p3 = q(".pl-p3"); // branco — entra da esquerda
        const p4 = q(".pl-p4"); // preto  — desce (cima→baixo)
        const subChars = q(".pl-sub span");
        const gmtWrap = q(".pl-gmt-wrap");

        // Estados iniciais (fora do ecrã)
        gsap.set(p1, { yPercent: 100 });
        gsap.set(p2, { xPercent: 100 });
        gsap.set(p3, { xPercent: -100 });
        gsap.set(p4, { yPercent: -100 });
        // Letras invisíveis mas NO lugar (x:0,y:0) e brancas — nada espalhado
        // nem cinza antes da animação começar.
        gsap.set(subChars, { opacity: 0, x: 0, y: 0, color: "#ffffff" });
        // GMT escala a partir do próprio centro; nunca anima y/top/margin.
        gsap.set(gmtWrap, {
          opacity: 0,
          scale: 5.5,
          filter: "blur(10px)",
          transformOrigin: "center center",
        });

        const tl = gsap.timeline({ onComplete: unlock });

        // 0) Sem GMT inicial: os painéis varrem quase logo (respiro mínimo)
        tl.to(p1, { yPercent: 0, duration: 0.6, ease: "power4.inOut" }, 0.2)
          .to(p2, { xPercent: 0, duration: 0.6, ease: "power4.inOut" }, "-=0.15")
          .to(p3, { xPercent: 0, duration: 0.6, ease: "power4.inOut" }, "-=0.15")
          .to(p4, { yPercent: 0, duration: 0.6, ease: "power4.inOut" }, "-=0.15")
          // 1) Subtítulo formado letra a letra: cada letra vem de fora do ecrã
          //    (posição aleatória) e desliza até ao lugar final. Só x/y/opacity
          //    nos spans — o <p> nunca é animado, logo o subtítulo fica fixo.
          .fromTo(
            subChars,
            {
              x: () => gsap.utils.random(-700, 700),
              y: () => gsap.utils.random(-500, 500),
              opacity: 0,
              color: "#ffffff",
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              color: "#ffffff",
              duration: 0.75,
              stagger: 0.035,
              ease: "power3.out",
            },
            "+=0.12"
          )
          // 2) GMT por último, com IMPACTO: só scale/opacity/filter (sem y).
          //    Sequência explícita: 5.5 → 1.16 (overshoot) → 0.98 (recuo) →
          //    assenta. Escala a partir do próprio centro; nunca move em y.
          .fromTo(
            gmtWrap,
            { opacity: 0, scale: 5.5, filter: "blur(10px)" },
            {
              opacity: 1,
              scale: 1.16,
              filter: "blur(0px)",
              duration: 0.68,
              ease: "power4.out",
            },
            "+=0.12"
          )
          .to(gmtWrap, { scale: 0.98, duration: 0.12, ease: "power2.out" })
          // Repouso em scaleX 1.03 / scaleY 1 = exactamente o .gmt-brand em
          // repouso (CSS), para coincidir ao pixel com o <h1> da Hero real.
          .to(gmtWrap, {
            scaleX: 1.03,
            scaleY: 1,
            duration: 0.18,
            ease: "back.out(2.8)",
          })
          // 3) Fade-out do overlay → revela a hero real por baixo (só no fim)
          .to(root, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.4");
      }, root);
    };

    // Esperar as fontes antes de animar: o GMT usa Host Grotesk e o subtítulo
    // DM Sans; animar antes de carregarem provoca reflow (o subtítulo saltava
    // quando o GMT — Host Grotesk — assentava). Com o flex-col a coincidir com
    // a Hero real, esperar as fontes garante posições estáveis e sem salto.
    if (document.fonts?.ready) {
      document.fonts.ready.then(build);
    } else {
      build();
    }

    return () => {
      cancelled = true;
      ctx?.revert();
      html.style.overflow = prevOverflow;
      window.__gmtScrollLocked = false;
      window.dispatchEvent(new Event(SCROLL_UNLOCK_EVENT));
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-black [--gmt-text:#ffffff]"
      aria-hidden
    >
      {/* Painéis geométricos (cada um por cima do anterior) */}
      <div className="pl-p1 absolute inset-0 z-[20] bg-white" />
      <div className="pl-p2 absolute inset-0 z-[30] bg-black" />
      <div className="pl-p3 absolute inset-0 z-[40] bg-white" />
      <div className="pl-p4 absolute inset-0 z-[50] bg-black" />

      {/* Título final do preloader — geometria IDÊNTICA a
          HeroSection > HeroTitle: o container externo centra (flex items-center
          justify-center, como a <section>) e o interno é o MESMO bloco
          `flex flex-col items-center gap-6` com as MESMAS classes (hero-line,
          gmt-brand--hero, type-hero-subtitle). O <h1> é filho DIRECTO do flex
          (sem wrapper), tal como na Hero real → sem diferença de layout nem
          salto no fade-out. O GSAP anima o próprio <h1> (.pl-gmt-wrap): como a
          centralização é do flex (não há translate no elemento), o scale nunca
          colide com o posicionamento. */}
      <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-6">
          <h1
            className="pl-gmt-wrap hero-line gmt-brand gmt-brand--hero text-center text-white"
            style={{ opacity: 0, transformOrigin: "center center" }}
          >
            GMT
          </h1>
          <p className="pl-sub hero-line type-hero-subtitle select-none text-center text-white">
            {chars(SUBTITLE).map(({ ch, key }) => (
              <span
                key={key}
                className="inline-block text-white"
                style={{ opacity: 0, color: "#ffffff", willChange: "transform, opacity" }}
              >
                {ch}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
