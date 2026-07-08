"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PlaceholderMedia } from "./PlaceholderMedia";

const HOME_FRAME_IMAGES = [
  { id: "HER-02", descricao: "frame expansivo slide 1" },
  { id: "HER-03", descricao: "frame expansivo slide 2" },
  { id: "HER-04", descricao: "frame expansivo slide 3" },
  { id: "HER-05", descricao: "frame expansivo slide 4" },
  { id: "HER-06", descricao: "frame expansivo slide 5" },
  { id: "HER-07", descricao: "frame expansivo slide 6" },
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
  /**
   * Altura total da secção em unidades de viewport height.
   * Default mantém o ritmo actual (200vh).
   */
  sectionVh?: number;
  /**
   * Pré-roll (em vh) antes da expansão começar.
   * Default mantém o ritmo actual (60vh).
   */
  preRollVh?: number;
  /**
   * Progresso (0–1) onde a expansão termina e inicia o "tail".
   * Default mantém o ritmo actual (0.85).
   */
  scaleEnd?: number;
}

/**
 * Sequência de comportamento:
 *
 * 1. Secção entra pela base do viewport (progress = 0).
 * 2. Progress 0 → SCALE_START: frame sobe até ao centro (sem crescer).
 * 3. Progress = SCALE_START: sticky activa; expansão e transição de fundo começam.
 * 4. Progress SCALE_START → SCALE_END: frame cresce (35% → 75% largura, 16:9); fundo branco → preto no início.
 * 5. Progress SCALE_END → 1: "tail" para estabilizar antes da transição.
 */
const FRAME_WIDTH_START = "35%";
const FRAME_WIDTH_END = "75%";

export function ExpandingFrame({
  images = HOME_FRAME_IMAGES,
  fallbackColor = "#111827",
  slideIntervalMs = 700,
  sectionVh = 200,
  preRollVh = 60,
  scaleEnd = 0.85,
}: ExpandingFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Derivados (mantêm a proporção visual dentro da janela de expansão)
  const scaleStart = preRollVh / sectionVh;
  const expansionRange = scaleEnd - scaleStart;
  const bgEnd = scaleStart + expansionRange * 0.2;
  const radiusEnd = scaleStart + expansionRange * 0.75;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const frameWidth = useTransform(
    scrollYProgress,
    [scaleStart, scaleEnd, 1],
    [FRAME_WIDTH_START, FRAME_WIDTH_END, FRAME_WIDTH_END],
  );
  const borderRadius = useTransform(
    scrollYProgress,
    [scaleStart, radiusEnd, scaleEnd, 1],
    ["16px", "0px", "0px", "0px"],
  );
  const bgColor = useTransform(
    scrollYProgress,
    [scaleStart, bgEnd, scaleEnd, 1],
    ["#ffffff", "#000000", "#000000", "#000000"],
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
      style={{ height: `${sectionVh}vh` }}
    >
      <motion.div
        style={{ backgroundColor: bgColor }}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{ width: frameWidth, borderRadius }}
          className="relative aspect-video overflow-hidden"
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
