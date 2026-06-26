"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Botão flutuante global "Agendar reunião".
 *
 * Aparece: quando o utilizador scrollou além de 80% da altura do viewport
 *          (equivalente a ter saído quase completamente da Hero section).
 * Desaparece: quando está a menos de 220px do fundo da página (zona do Footer).
 *
 * Integrado no layout global → funciona em todas as páginas.
 */
export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function check() {
      const scrollY = window.scrollY;
      const viewH = window.innerHeight;
      const pageH = document.documentElement.scrollHeight;

      const pastHero = scrollY > viewH * 0.8;
      const nearFooter = scrollY + viewH >= pageH - 220;

      setVisible(pastHero && !nearFooter);
    }

    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          // pointer-events-none no wrapper para não bloquear cliques
          // pointer-events-auto no Link para restaurar interactividade
          className="pointer-events-none fixed bottom-8 left-1/2 z-[60] -translate-x-1/2"
        >
          <Link
            href="/contacto"
            className="group pointer-events-auto flex items-center gap-2.5 rounded-full bg-black/80 px-6 py-3.5 text-sm font-medium tracking-wide text-white backdrop-blur-md transition-colors duration-300 hover:bg-black"
          >
            Agendar reunião
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
