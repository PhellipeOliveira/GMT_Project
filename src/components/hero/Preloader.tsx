"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  SCROLL_LOCK_EVENT,
  SCROLL_UNLOCK_EVENT,
} from "@/components/ui/SmoothScroll";

/** Corre apenas uma vez por sessão. */
const SESSION_KEY = "gmt:preloaded";

/** useLayoutEffect no cliente, useEffect no servidor (evita warning de SSR). */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : () => {};

/**
 * Overlay de introdução da Home.
 *
 * Abordagem (A): o preloader é totalmente auto-contido e anima a SUA cópia do
 * título, posicionada exactamente sobre o título real da hero (mesma geometria:
 * 100dvh full screen, centrado, mesmas classes tipográficas). No fim faz
 * fade-out do overlay revelando o título real idêntico por baixo → sem salto
 * nem duplo título.
 *
 * Sequência (~4s, premium/legível):
 *   1. 4 divs geométricas full-screen (~1,8s, power4.inOut) terminando a preto.
 *   2. Subtítulo letra-a-letra (SplitText): cada letra vem de MUITO longe
 *      (x ±600, y ±400) e desliza até ao sítio — vê-se claramente a chegar.
 *   3. "GMT" com impacto: scale ~8 → overshoot 1.12 → assenta em 1 (batida).
 *   4. Fade-out do overlay → hero visível.
 *
 * prefers-reduced-motion: não renderiza nada, não bloqueia scroll.
 */
export function Preloader() {
  // Estado inicial só depende de sessionStorage (consistente SSR/hidratação e
  // sem flash em navegação client-side quando já correu).
  const [active, setActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem(SESSION_KEY) !== "1";
  });

  const overlayRef = useRef<HTMLDivElement>(null);
  const introBrandRef = useRef<HTMLHeadingElement>(null);
  const brandWrapRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const panel4Ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!active) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setActive(false);
      return;
    }

    gsap.registerPlugin(SplitText);
    sessionStorage.setItem(SESSION_KEY, "1");

    // ── Bloquear scroll ──────────────────────────────────────────────────────
    const previousOverflow = document.body.style.overflow;
    window.scrollTo(0, 0);
    window.__gmtScrollLocked = true;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));

    const unlockScroll = () => {
      window.__gmtScrollLocked = false;
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new Event(SCROLL_UNLOCK_EVENT));
    };

    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      // Estados iniciais (coincidem com os transforms inline → sem flash SSR).
      gsap.set(panel1Ref.current, { yPercent: 100 });
      gsap.set(panel2Ref.current, { xPercent: 100 });
      gsap.set(panel3Ref.current, { xPercent: -100 });
      gsap.set(panel4Ref.current, { yPercent: -100 });
      gsap.set([subtitleRef.current, brandWrapRef.current], { autoAlpha: 0 });

      split = new SplitText(subtitleRef.current, { type: "chars" });

      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => {
          unlockScroll();
          setActive(false);
        },
      });

      // ── 1) Divs geométricas — lentas e legíveis (~1,8s, overlap ~0.15s) ─────
      // branco sobe → preto entra (dir→esq) → branco sai (esq→dir) → preto desce.
      tl.to(panel1Ref.current, { yPercent: 0, duration: 0.6 }, 0.0)
        .to(panel2Ref.current, { xPercent: 0, duration: 0.6 }, 0.45)
        .to(panel3Ref.current, { xPercent: 0, duration: 0.6 }, 0.9)
        .to(panel4Ref.current, { yPercent: 0, duration: 0.6 }, 1.35);

      // ── 2) Subtítulo letra-a-letra: vindo de MUITO longe, deslize puro ─────
      tl.set(subtitleRef.current, { autoAlpha: 1 }, ">-0.05");
      tl.from(
        split.chars,
        {
          x: () => gsap.utils.random(-600, 600),
          y: () => gsap.utils.random(-400, 400),
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.035,
        },
        "<",
      );

      // ── 3) "GMT" — impacto: da frente do monitor, overshoot 1.12 → 1 ───────
      tl.set(brandWrapRef.current, { autoAlpha: 1 }, ">-0.05");
      tl.fromTo(
        brandWrapRef.current,
        { scale: 8, filter: "blur(10px)" },
        {
          scale: 1.12,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out",
        },
        "<",
      ).to(brandWrapRef.current, {
        scale: 1,
        duration: 0.32,
        ease: "back.out(3)",
      });

      // ── 4) Fade-out do overlay → revela a hero real idêntica por baixo ─────
      tl.to(overlayRef.current, { autoAlpha: 0, duration: 0.4 }, ">-0.03");
    }, overlayRef);

    return () => {
      ctx.revert();
      split?.revert();
      unlockScroll();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-black"
      aria-hidden
    >
      {/* GMT inicial (tapado pelas divs) — z abaixo dos painéis */}
      <div className="preloader-stage z-10">
        <h1
          ref={introBrandRef}
          className="gmt-brand gmt-brand--hero text-center text-white"
        >
          GMT
        </h1>
      </div>

      {/* 4 painéis geométricos — estado inicial inline evita flash no 1º paint */}
      <div
        ref={panel1Ref}
        className="preloader-panel z-20 bg-white"
        style={{ transform: "translateY(100%)" }}
      />
      <div
        ref={panel2Ref}
        className="preloader-panel z-30 bg-black"
        style={{ transform: "translateX(100%)" }}
      />
      <div
        ref={panel3Ref}
        className="preloader-panel z-40 bg-white"
        style={{ transform: "translateX(-100%)" }}
      />
      <div
        ref={panel4Ref}
        className="preloader-panel z-50 bg-black"
        style={{ transform: "translateY(-100%)" }}
      />

      {/* Título final animado — mesma geometria/classe da hero real (z acima) */}
      <div className="preloader-stage z-[60]">
        <div className="flex flex-col items-center gap-6">
          <div ref={brandWrapRef} style={{ opacity: 0 }}>
            <h1 className="gmt-brand gmt-brand--hero text-center text-white">
              GMT
            </h1>
          </div>
          <p
            ref={subtitleRef}
            className="type-hero-subtitle select-none text-center text-white"
            style={{ opacity: 0 }}
          >
            Growth Marketing Technology
          </p>
        </div>
      </div>
    </div>
  );
}
