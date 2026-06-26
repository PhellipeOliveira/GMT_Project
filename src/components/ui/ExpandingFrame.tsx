"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PlaceholderMedia } from "./PlaceholderMedia";

const FRAME_IMAGES = [
  { id: "HER-02", descricao: "approach portrait" },
  { id: "HER-03", descricao: "approach thumb A" },
  { id: "HER-04", descricao: "approach thumb B" },
  { id: "HER-05", descricao: "approach thumb C" },
];

/**
 * Secção de transição: frame começa pequeno (~36%) e expande até 100vw × 100vh
 * enquanto o utilizador faz scroll. A sobreposição branca desvanece, revelando
 * o fundo preto que persiste nas secções seguintes.
 */
export function ExpandingFrame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameWidth = useTransform(scrollYProgress, [0, 1], ["36%", "100%"]);
  const frameHeight = useTransform(scrollYProgress, [0, 1], ["50vh", "100vh"]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.9], ["20px", "0px"]);
  const overlayOpacity = useTransform(scrollYProgress, [0.55, 0.95], [1, 0]);

  useEffect(() => {
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % FRAME_IMAGES.length),
      750,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={containerRef} className="not-prose relative h-[200vh] bg-black">
      {/* Sobreposição branca — desvanece ao fazer scroll */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="pointer-events-none absolute inset-0 z-10 bg-white"
      />

      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          style={{ width: frameWidth, height: frameHeight, borderRadius }}
          className="relative z-20 overflow-hidden"
        >
          {FRAME_IMAGES.map((img, i) => (
            <div
              key={img.id}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: i === activeIdx ? 1 : 0 }}
            >
              <PlaceholderMedia
                id={img.id}
                descricao={img.descricao}
                cor="#111827"
                fill
                sizes="100vw"
                reveal={false}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
