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
 * Sequência de comportamento:
 *
 * 1. Secção entra pela base do viewport (progress = 0).
 *    O frame (35% × 45vh) já está visível — sem fade, opacity sempre 1.
 *    O slideshow corre continuamente.
 *
 * 2. Progress 0 → 0.4 (pre-sticky):
 *    Frame sobe naturalmente com o scroll da página (sem crescer).
 *    O sticky container ainda não "grudou" — o container sobe com a página.
 *
 * 3. Progress = 0.4 (sticky kicks in):
 *    A secção está com o topo no topo do viewport.
 *    O frame está exactamente centrado. A partir daqui, a escala começa.
 *
 * 4. Progress 0.4 → 1 (scaling):
 *    Frame cresce de 35% → 100vw / 45vh → 100vh, controlado pelo scroll.
 *    Background do container passa de branco → preto perto do fim.
 *
 * 5. Reversível: scroll para cima inverte tudo automaticamente.
 *
 * Porquê SECTION_VH = 250 e SCALE_START = 100 / 250 = 0.4:
 *   Com offset ["start end","end end"], o progress vai de 0 (topo da secção
 *   na base do viewport) a 1 (base da secção na base do viewport).
 *   O sticky no top-0 ativa quando scrollY = containerTop, ou seja,
 *   depois de 100vh de scroll desde progress 0, que é 100/250 = 0.4.
 */
const SECTION_VH = 250;
const SCALE_START = 100 / SECTION_VH; // ≈ 0.4

export function ExpandingFrame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Começa quando o TOPO da secção toca a BASE do viewport
    // Termina quando a BASE da secção toca a BASE do viewport
    offset: ["start end", "end end"],
  });

  // Tamanho do frame — fixo até SCALE_START, depois escala até 100%
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

  // Border radius apenas durante a fase de escala
  const borderRadius = useTransform(
    scrollYProgress,
    [SCALE_START, SCALE_START + 0.45],
    ["16px", "0px"],
  );

  // Background do container: branco → preto perto do fim da escala
  // Sem overlay animada — apenas a cor de fundo do container muda
  const bgColor = useTransform(
    scrollYProgress,
    [0.82, 1],
    ["#ffffff", "#000000"],
  );

  // Slideshow contínuo, independente da animação de escala
  useEffect(() => {
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % FRAME_IMAGES.length),
      700,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      ref={containerRef}
      className="not-prose relative"
      style={{ height: `${SECTION_VH}vh` }}
    >
      {/* Container sticky: fica no topo do viewport depois de SCALE_START.
          Antes disso, sobe naturalmente com o scroll (comportamento normal de sticky). */}
      <motion.div
        style={{ backgroundColor: bgColor }}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        {/* Frame: opacity sempre 1, sem fade, sem aparecimento gradual */}
        <motion.div
          style={{ width: frameWidth, height: frameHeight, borderRadius }}
          className="relative overflow-hidden"
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
      </motion.div>
    </div>
  );
}
