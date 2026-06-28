"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ── Variantes de animação ────────────────────────────────────────────────────

const line1Container: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.1, staggerChildren: 0.1 },
  },
};

const line2Container: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.55, staggerChildren: 0.055 },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: [0.2, 0.65, 0.3, 0.9] },
  },
};

const blink: Variants = {
  stable: { opacity: 1 },
  blink: {
    opacity: [1, 0.06, 1, 0.06, 1, 0.06, 1],
    transition: {
      duration: 0.8,
      times: [0, 0.15, 0.3, 0.5, 0.65, 0.82, 1],
      ease: "easeInOut",
    },
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function splitToChars(text: string) {
  return text.split("").map((ch, i) => ({
    char: ch === " " ? "\u00A0" : ch,
    key: `${ch}-${i}`,
  }));
}

const LINE_1 = "GMT";
const LINE_2 = "Growth Marketing Technology";
const line1Chars = splitToChars(LINE_1);
const line2Chars = splitToChars(LINE_2);

// ── Componente ───────────────────────────────────────────────────────────────

export function HeroTitle() {
  const reducedMotion = useReducedMotion();
  const revealControls = useAnimation();
  const blinkControls = useAnimation();

  /**
   * inViewRef: usado apenas para detectar retorno ao hero (blink).
   * amount: 0.1 — tolera elementos muito altos (subtítulo enorme em mobile).
   */
  const inViewRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(inViewRef, { once: false, amount: 0.1 });

  /** Marca se a revelação inicial já aconteceu */
  const hasRevealed = useRef(false);
  /** Marca se já detectámos a primeira vez em view (para não piscar logo) */
  const firstInView = useRef(false);

  // ── Revelação na montagem (independente do IntersectionObserver) ──────────
  useEffect(() => {
    if (reducedMotion || hasRevealed.current) return;
    // Pequeno delay para garantir que o Framer Motion está hidratado
    const t = setTimeout(() => {
      revealControls.start("visible");
      hasRevealed.current = true;
    }, 80);
    return () => clearTimeout(t);
  }, [reducedMotion, revealControls]);

  // ── Blink ao regressar ao hero ─────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    if (!isInView) return;

    if (!firstInView.current) {
      // Primeira vez em view — apenas registar, não piscar
      firstInView.current = true;
      return;
    }

    // Regressou ao hero após ter saído
    blinkControls.start("blink").then(() => blinkControls.start("stable"));
  }, [isInView, reducedMotion, blinkControls]);

  // ── Renderização sem animação (prefers-reduced-motion) ────────────────────
  if (reducedMotion) {
    return (
      <div
      ref={inViewRef}
      className="flex flex-col items-center gap-6"
      aria-label="GMT – Growth Marketing Technology"
    >
        <h1 className="gmt-brand gmt-brand--hero text-center text-white">GMT</h1>
        <p className="type-hero-subtitle select-none text-center text-white">
          Growth Marketing Technology
        </p>
      </div>
    );
  }

  // ── Renderização animada ──────────────────────────────────────────────────
  return (
    <div
      ref={inViewRef}
      className="flex flex-col items-center gap-6"
      aria-label="GMT – Growth Marketing Technology"
    >
      <motion.div
        variants={blink}
        initial="stable"
        animate={blinkControls}
        className="flex flex-col items-center gap-6"
      >
        {/* Linha 1 — GMT */}
        <motion.h1
          variants={line1Container}
          initial="hidden"
          animate={revealControls}
          className="gmt-brand gmt-brand--hero text-center text-white"
        >
          {line1Chars.map(({ char, key }) => (
            <motion.span
              key={key}
              variants={charVariants}
              className="inline-block"
              style={{ willChange: "transform, opacity, filter" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Linha 2 — Growth Marketing Technology */}
        <motion.p
          variants={line2Container}
          initial="hidden"
          animate={revealControls}
          className="type-hero-subtitle select-none text-center text-white"
        >
          {line2Chars.map(({ char, key }) => (
            <motion.span
              key={key}
              variants={charVariants}
              className="inline-block"
              style={{ willChange: "transform, opacity, filter" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>
    </div>
  );
}
