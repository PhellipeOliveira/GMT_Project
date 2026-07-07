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

    const ctx = gsap.context(() => {
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
      gsap.set(subChars, { opacity: 0 });
      gsap.set(gmtWrap, { opacity: 0, scale: 8, filter: "blur(14px)" });

      const tl = gsap.timeline({ onComplete: unlock });

      // 0) Sem GMT inicial: os painéis varrem quase logo (respiro mínimo)
      tl.to(p1, { yPercent: 0, duration: 0.6, ease: "power4.inOut" }, 0.2)
        .to(p2, { xPercent: 0, duration: 0.6, ease: "power4.inOut" }, "-=0.15")
        .to(p3, { xPercent: 0, duration: 0.6, ease: "power4.inOut" }, "-=0.15")
        .to(p4, { yPercent: 0, duration: 0.6, ease: "power4.inOut" }, "-=0.15")
        // 1) Subtítulo letra a letra, de longe e aleatório
        .from(
          subChars,
          {
            x: () => gsap.utils.random(-600, 600),
            y: () => gsap.utils.random(-400, 400),
            opacity: 0,
            duration: 0.6,
            stagger: 0.035,
            ease: "power3.out",
          },
          "+=0.15"
        )
        .to(subChars, { opacity: 1, duration: 0.01 }, "<")
        // 2) GMT com impacto (vem da frente, overshoot)
        .to(
          gmtWrap,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "back.out(3)",
          },
          "+=0.1"
        )
        // 3) Fade-out do overlay → revela a hero real por baixo
        .to(root, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.45");
    }, root);

    return () => {
      ctx.revert();
      html.style.overflow = prevOverflow;
      window.__gmtScrollLocked = false;
      window.dispatchEvent(new Event(SCROLL_UNLOCK_EVENT));
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-black"
      aria-hidden
    >
      {/* Painéis geométricos (cada um por cima do anterior) */}
      <div className="pl-p1 absolute inset-0 z-[20] bg-white" />
      <div className="pl-p2 absolute inset-0 z-[30] bg-black" />
      <div className="pl-p3 absolute inset-0 z-[40] bg-white" />
      <div className="pl-p4 absolute inset-0 z-[50] bg-black" />

      {/* Título final do preloader (por cima de tudo) */}
      <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-6 px-4">
        <div className="pl-gmt-wrap inline-block" style={{ transformOrigin: "center" }}>
          <h1 className="gmt-brand gmt-brand--hero text-center text-white">GMT</h1>
        </div>
        <p className="pl-sub type-hero-subtitle text-center text-white">
          {chars(SUBTITLE).map(({ ch, key }) => (
            <span key={key} className="inline-block" style={{ willChange: "transform" }}>
              {ch}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
