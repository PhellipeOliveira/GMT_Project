"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { splitTextIntoLines } from "@/lib/split-text-lines";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { useRevealSequence } from "@/components/ui/reveal-sequence";

// Entrada suave — desaceleração longa no fim (sensação de “nascer”)
export const REVEAL_EASE_OUT = [0.25, 1, 0.35, 1] as const;
export const REVEAL_DURATION = 2.75;
/** Pausa entre o fim de uma linha e o início da seguinte. */
export const REVEAL_LINE_GAP = 0.12;
/** Pausa entre blocos encadeados (label → título → parágrafo). */
export const REVEAL_BLOCK_GAP = 0.18;
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

function useChainedDelay(extraDelay: number, lineCount: number | null) {
  const sequence = useRevealSequence();
  const id = useId();
  const indexRef = useRef<number | null>(null);

  if (sequence && indexRef.current === null) {
    indexRef.current = sequence.register(id);
  }

  const index = indexRef.current;

  useEffect(() => {
    if (!sequence || index === null || lineCount === null) return;
    sequence.reportLines(index, lineCount);
  }, [sequence, index, lineCount]);

  const chainDelay =
    sequence && index !== null ? sequence.getDelay(index) : 0;

  return chainDelay + extraDelay;
}

function RevealMask({
  children,
  y,
  delay = 0,
  className,
  lineCount = 1,
}: {
  children: ReactNode;
  y: number;
  delay?: number;
  className?: string;
  lineCount?: number;
}) {
  const resolvedDelay = useChainedDelay(delay, lineCount);

  return (
    <div className={cn("overflow-hidden", className)}>
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
    </div>
  );
}

function RevealTextLines({
  text,
  as: Tag = "div",
  className,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const reducedMotion = useReducedMotion();
  const resolvedDelay = useChainedDelay(delay, lines?.length ?? null);

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const update = () => {
      measure.className = className ?? "";
      measure.style.width = `${container.offsetWidth}px`;
      setLines(splitTextIntoLines(measure, text));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, [text, className]);

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  if (!lines) {
    return (
      <div ref={containerRef}>
        <Tag className={className} aria-hidden>
          {text}
        </Tag>
        <div
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute h-0 overflow-hidden whitespace-normal"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Tag className={className} aria-label={text}>
        {lines.map((line, i) => (
          <div key={`${i}-${line}`} className="overflow-hidden">
            <motion.div
              initial={{ y: REVEAL_TEXT_Y }}
              whileInView={{ y: 0 }}
              viewport={VIEWPORT}
              transition={{
                duration: REVEAL_DURATION,
                ease: REVEAL_EASE_OUT,
                delay:
                  resolvedDelay + i * (REVEAL_DURATION + REVEAL_LINE_GAP),
              }}
              aria-hidden={lines.length > 1 ? true : undefined}
            >
              {line}
            </motion.div>
          </div>
        ))}
      </Tag>
    </div>
  );
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

  if (reducedMotion) {
    if (isTextString && resolvedVariant === "text") {
      const Tag = as ?? "div";
      return <Tag className={className}>{children}</Tag>;
    }
    return <div className={className}>{children}</div>;
  }

  if (resolvedVariant === "text" && isTextString) {
    return (
      <RevealTextLines
        text={children}
        as={as}
        className={className}
        delay={delay}
      />
    );
  }

  const y = resolvedVariant === "media" ? REVEAL_MEDIA_Y : REVEAL_TEXT_Y;

  return (
    <RevealMask y={y} delay={delay} className={className} lineCount={1}>
      {children}
    </RevealMask>
  );
}
