"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PlaceholderMedia } from "./PlaceholderMedia";

const HOME_FRAME_IMAGES = [
  { id: "HER-02", descricao: "approach portrait" },
  { id: "HER-03", descricao: "approach thumb A" },
  { id: "HER-04", descricao: "approach thumb B" },
  { id: "HER-05", descricao: "approach thumb C" },
];

export interface ExpandingFrameImage {
  id: string;
  descricao: string;
  cor?: string;
}

interface ExpandingFrameProps {
  images?: ExpandingFrameImage[];
  fallbackColor?: string;
  slideIntervalMs?: number;
}

/**
 * Sequência de comportamento:
 *
 * 1. Secção entra pela base do viewport (progress = 0).
 * 2. Progress 0 → SCALE_START: frame sobe até ao centro (sem crescer).
 * 3. Progress = SCALE_START: sticky activa; expansão e transição de fundo começam.
 * 4. Progress SCALE_START → 1: frame cresce; fundo branco → preto no início.
 */
const SECTION_VH = 250;
const SCALE_START = 100 / SECTION_VH; // ≈ 0.4

export function ExpandingFrame({
  images = HOME_FRAME_IMAGES,
  fallbackColor = "#111827",
  slideIntervalMs = 700,
}: ExpandingFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const frameWidth = useTransform(
    scrollYProgress,
    [SCALE_START, 1],
    ["35%", "100%"],
  );
  const frameHeight = useTransform(
    scrollYProgress,
    [SCALE_START, 1],
    ["45vh", "100vh"],
  );
  const borderRadius = useTransform(
    scrollYProgress,
    [SCALE_START, SCALE_START + 0.45],
    ["16px", "0px"],
  );
  const bgColor = useTransform(
    scrollYProgress,
    [SCALE_START, SCALE_START + 0.12],
    ["#ffffff", "#000000"],
  );

  useEffect(() => {
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % images.length),
      slideIntervalMs,
    );
    return () => clearInterval(id);
  }, [images.length, slideIntervalMs]);

  return (
    <div
      ref={containerRef}
      className="not-prose relative"
      style={{ height: `${SECTION_VH}vh` }}
    >
      <motion.div
        style={{ backgroundColor: bgColor }}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{ width: frameWidth, height: frameHeight, borderRadius }}
          className="relative overflow-hidden"
        >
          {images.map((img, i) => (
            <div
              key={img.id}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: i === activeIdx ? 1 : 0 }}
            >
              <PlaceholderMedia
                id={img.id}
                descricao={img.descricao}
                cor={img.cor ?? fallbackColor}
                fill
                sizes="100vw"
                reveal={false}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
