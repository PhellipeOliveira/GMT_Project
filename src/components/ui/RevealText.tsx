"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EASE_GLOBAL = [0.65, 0.05, 0.1, 1] as const;

type RevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

interface RevealTextProps {
  children: string;
  as?: RevealTag;
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.02 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_GLOBAL },
  },
};

export function RevealText({
  children,
  as: Tag = "span",
  className,
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const letters = children.split("");

  return (
    <Tag className={className}>
      <motion.span
        ref={ref}
        className="inline"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        aria-label={children}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={`${i}-${letter}`}
            variants={letterVariants}
            className="inline-block"
            style={{ willChange: isInView ? "transform" : undefined }}
            aria-hidden
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
