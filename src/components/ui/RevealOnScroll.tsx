"use client";

import { useId, useRef, type ElementType, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { useRevealSequence } from "@/components/ui/reveal-sequence";

// Entrada suave e uniforme — texto e mídia sobem como um único bloco
// (translateY + opacity), com desaceleração longa no fim ("nascer").
export const REVEAL_EASE_OUT = [0.25, 1, 0.35, 1] as const;
export const REVEAL_DURATION = 2.0;
/** Stagger entre blocos irmãos dentro de <RevealSequence> (0 = simultâneo). */
export const REVEAL_BLOCK_GAP = 0;
export const REVEAL_TEXT_Y = 28;
export const REVEAL_MEDIA_Y = 20;

const VIEWPORT = { once: true, margin: "-4% 0px" as const };

type RevealVariant = "text" | "media";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  as?: ElementType;
}

/** Delay encadeado quando dentro de <RevealSequence> + delay manual da prop. */
function useChainedDelay(extraDelay: number) {
  const sequence = useRevealSequence();
  const id = useId();
  const indexRef = useRef<number | null>(null);

  if (sequence && indexRef.current === null) {
    indexRef.current = sequence.register(id);
  }

  const index = indexRef.current;
  const chainDelay = sequence && index !== null ? sequence.getDelay(index) : 0;

  return chainDelay + extraDelay;
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  variant,
  as,
}: RevealOnScrollProps) {
  const reducedMotion = useReducedMotion();
  const isTextString = typeof children === "string";
  const resolvedVariant = variant ?? (isTextString ? "text" : "media");
  const resolvedDelay = useChainedDelay(delay);

  const Wrapper = (as ?? "div") as ElementType;

  if (reducedMotion) {
    return <Wrapper className={className}>{children}</Wrapper>;
  }

  const y = resolvedVariant === "media" ? REVEAL_MEDIA_Y : REVEAL_TEXT_Y;

  return (
    <Wrapper className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ y, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={VIEWPORT}
        transition={{
          duration: REVEAL_DURATION,
          ease: REVEAL_EASE_OUT,
          delay: resolvedDelay,
        }}
      >
        {children}
      </motion.div>
    </Wrapper>
  );
}
