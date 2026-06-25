"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RevealEasing = "default" | "services" | "portfolio";

const EASING: Record<RevealEasing, [number, number, number, number]> = {
  default: [0.65, 0.05, 0.1, 1],
  services: [0.76, 0, 0.24, 1],
  portfolio: [0.22, 1, 0.36, 1],
};

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  easing?: RevealEasing;
  delay?: number;
}

export function RevealItem({
  children,
  className,
  easing = "default",
  delay = 0,
}: RevealItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{
          duration: 0.6,
          ease: EASING[easing],
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
