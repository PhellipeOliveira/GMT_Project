"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const line1ContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.1,
    },
  },
};

const line2ContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.65,
      staggerChildren: 0.065,
    },
  },
};

const charVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: "blur(3px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.25,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
};

const blinkVariants: Variants = {
  stable: { opacity: 1 },
  blink: {
    opacity: [1, 0.08, 1, 0.08, 1, 0.08, 1],
    transition: {
      duration: 0.75,
      times: [0, 0.15, 0.3, 0.5, 0.65, 0.82, 1],
      ease: "easeInOut",
    },
  },
};

function splitToChars(text: string) {
  return text.split("").map((char, i) => ({
    char: char === " " ? "\u00A0" : char,
    key: `${char}-${i}`,
  }));
}

const LINE_1 = "GMT";
const LINE_2 = "Growth Marketing Technology";

export function HeroTitle() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.5 });
  const revealControls = useAnimation();
  const blinkControls = useAnimation();
  const hasAnimated = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || reducedMotion) return;

    if (!hasAnimated.current) {
      revealControls.start("visible");
      hasAnimated.current = true;
    } else {
      blinkControls.start("blink").then(() => {
        blinkControls.start("stable");
      });
    }
  }, [isInView, revealControls, blinkControls, reducedMotion]);

  const line1Chars = splitToChars(LINE_1);
  const line2Chars = splitToChars(LINE_2);

  if (reducedMotion) {
    return (
      <div
        ref={sectionRef}
        className="flex flex-col items-center gap-4"
        aria-label="GMT – Growth Marketing Technology"
      >
        <h1 className="type-hero-brand select-none">GMT</h1>
        <p className="type-hero-subtitle w-[60%] text-center select-none">
          Growth Marketing Technology
        </p>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="flex flex-col items-center gap-4"
      aria-label="GMT – Growth Marketing Technology"
    >
      <motion.div
        variants={blinkVariants}
        initial="stable"
        animate={blinkControls}
        className="flex flex-col items-center gap-4"
      >
        <motion.h1
          variants={line1ContainerVariants}
          initial="hidden"
          animate={revealControls}
          className="type-hero-brand select-none"
        >
          {line1Chars.map(({ char, key }) => (
            <motion.span
              key={key}
              variants={charVariants}
              className="inline-block"
              style={{ willChange: "transform" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={line2ContainerVariants}
          initial="hidden"
          animate={revealControls}
          className="type-hero-subtitle w-[60%] text-center select-none"
        >
          {line2Chars.map(({ char, key }) => (
            <motion.span
              key={key}
              variants={charVariants}
              className="inline-block"
              style={{ willChange: "transform" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>
    </div>
  );
}
