"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

declare global {
  interface Window {
    /** Sinaliza que o scroll está bloqueado (preloader a correr). */
    __gmtScrollLocked?: boolean;
  }
}

/** Eventos partilhados com o Preloader para travar/soltar o scroll. */
export const SCROLL_LOCK_EVENT = "gmt:lock-scroll";
export const SCROLL_UNLOCK_EVENT = "gmt:unlock-scroll";

export function SmoothScroll() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Motion reduzido: scroll nativo, sem smooth e sem ScrollTrigger.
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();

    // Lenis conduz o ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);

    // RAF do Lenis conduzido pelo ticker do GSAP (sincronia total).
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Se o preloader já bloqueou antes deste efeito montar, respeitar.
    if (window.__gmtScrollLocked) {
      lenis.stop();
    }

    const handleLock = () => lenis.stop();
    const handleUnlock = () => {
      lenis.start();
      ScrollTrigger.refresh();
    };

    window.addEventListener(SCROLL_LOCK_EVENT, handleLock);
    window.addEventListener(SCROLL_UNLOCK_EVENT, handleUnlock);

    return () => {
      window.removeEventListener(SCROLL_LOCK_EVENT, handleLock);
      window.removeEventListener(SCROLL_UNLOCK_EVENT, handleUnlock);
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return null;
}
