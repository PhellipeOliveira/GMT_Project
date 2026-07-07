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

/** Espera fontes + layout estável (incl. barra de URL mobile) antes de medir. */
function whenLayoutReady(cb: () => void) {
  const run = () => requestAnimationFrame(() => requestAnimationFrame(cb));
  if (document.fonts?.ready) {
    document.fonts.ready.then(run);
  } else {
    run();
  }
}

/** Magnitudes de voo das letras proporcionais ao viewport (mobile/tablet/desktop). */
function letterFlyRange() {
  const w = window.innerWidth;
  const h = window.visualViewport?.height ?? window.innerHeight;
  return {
    x: Math.min(w * 0.45, 700),
    y: Math.min(h * 0.3, 500),
  };
}

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  // "pending" cobre o 1º paint (evita flash da hero); depois corre ou termina.
  const [phase, setPhase] = useState<"pending" | "run" | "done">("pending");

  useEffect(() => {
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

      // Elementos reais já no DOM (por baixo do overlay) — fonte da verdade.
      const realTitle = document.querySelector<HTMLElement>(
        ".gmt-brand--hero:not(.preloader-title)",
      );
      const realSub = document.querySelector<HTMLElement>(
        ".type-hero-subtitle:not(.preloader-sub)",
      );

      if (!realTitle || !realSub) {
        unlock();
        return;
      }

      const tBounds = realTitle.getBoundingClientRect();
      const sBounds = realSub.getBoundingClientRect();

      ctx = gsap.context(() => {
        const q = gsap.utils.selector(root);
        const p1 = q(".pl-p1");
        const p2 = q(".pl-p2");
        const p3 = q(".pl-p3");
        const p4 = q(".pl-p4");
        const plSub = q(".pl-sub")[0] as HTMLElement | undefined;
        const subChars = q(".pl-sub span");
        const gmtWrap = q(".pl-gmt-wrap")[0] as HTMLElement | undefined;

        if (!plSub || !gmtWrap) {
          unlock();
          return;
        }

        // DOM Twins: o <h1> do preloader é clone literal do <h1> real. Aplicamos
        // o rect medido DIRECTAMENTE no h1 (sem wrappers/flex) — igual ao <p> do
        // subtítulo, que alinha na perfeição. Assim as letras assentam nos mesmos
        // píxeis (a baseline da fonte não é distorcida por divs intermédias).
        gsap.set(gmtWrap, {
          position: "absolute",
          top: tBounds.top,
          left: tBounds.left,
          width: tBounds.width,
          height: tBounds.height,
          margin: 0,
          x: 0,
          y: 0,
        });
        gsap.set(plSub, {
          position: "absolute",
          top: sBounds.top,
          left: sBounds.left,
          width: sBounds.width,
          height: sBounds.height,
          margin: 0,
          x: 0,
          y: 0,
        });

        const fly = letterFlyRange();

        gsap.set(p1, { yPercent: 100 });
        gsap.set(p2, { xPercent: 100 });
        gsap.set(p3, { xPercent: -100 });
        gsap.set(p4, { yPercent: -100 });
        gsap.set(subChars, { opacity: 0, x: 0, y: 0, color: "#ffffff" });
        gsap.set(gmtWrap, {
          opacity: 0,
          scale: 5.5,
          filter: "blur(10px)",
          transformOrigin: "center center",
        });

        const tl = gsap.timeline({ onComplete: unlock });

        tl.to(p1, { yPercent: 0, duration: 0.6, ease: "power4.inOut" }, 0.2)
          .to(p2, { xPercent: 0, duration: 0.6, ease: "power4.inOut" }, "-=0.15")
          .to(p3, { xPercent: 0, duration: 0.6, ease: "power4.inOut" }, "-=0.15")
          .to(p4, { yPercent: 0, duration: 0.6, ease: "power4.inOut" }, "-=0.15")
          .fromTo(
            subChars,
            {
              x: () => gsap.utils.random(-fly.x, fly.x),
              y: () => gsap.utils.random(-fly.y, fly.y),
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
            "+=0.12",
          )
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
            "+=0.12",
          )
          .to(gmtWrap, { scale: 0.98, duration: 0.12, ease: "power2.out" })
          // Repouso = scaleX 1.03 / scaleY 1: como o GSAP passa a controlar o
          // transform do próprio h1, replicamos aqui o scaleX(1.03) que o
          // .gmt-brand real aplica por CSS → gémeos idênticos ao píxel.
          .to(gmtWrap, {
            scaleX: 1.03,
            scaleY: 1,
            duration: 0.18,
            ease: "back.out(2.8)",
          })
          .to(root, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.4");
      }, root);
    };

    whenLayoutReady(build);

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
      <div className="pl-p1 absolute inset-0 z-[20] bg-white" />
      <div className="pl-p2 absolute inset-0 z-[30] bg-black" />
      <div className="pl-p3 absolute inset-0 z-[40] bg-white" />
      <div className="pl-p4 absolute inset-0 z-[50] bg-black" />

      {/* Texto final (DOM Twins): h1 e p soltos, posição via
          getBoundingClientRect() aplicada DIRECTAMENTE no elemento — sem
          wrappers/flex que distorçam a baseline da fonte. */}
      <div className="absolute inset-0 z-[60] pointer-events-none">
        <h1
          className="pl-gmt-wrap preloader-title hero-line gmt-brand gmt-brand--hero m-0 p-0 text-center leading-none text-white"
          style={{ opacity: 0, transformOrigin: "center center", willChange: "transform, opacity" }}
        >
          GMT
        </h1>

        <p className="pl-sub preloader-sub hero-line type-hero-subtitle select-none text-center text-white">
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
  );
}
