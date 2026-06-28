import type { Metadata } from "next";
import { Target } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { RevealSequence } from "@/components/ui/reveal-sequence";
import { DIFERENCIAIS, ICONES_DIFERENCIAIS } from "@/data/diferenciais";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ExpandingFrame } from "@/components/ui/ExpandingFrame";
import { AboutCounterGrid } from "@/components/about/AboutCounterGrid";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Agência especialista em automações, inteligência artificial e marketing digital, dedicada a ajudar pequenas empresas a crescer no mundo digital.",
};

const ABOUT_SLIDESHOW = [
  { id: "ABT-01", descricao: "slideshow institucional 1", cor: "#1E293B" },
  { id: "ABT-02", descricao: "slideshow institucional 2", cor: "#134E4A" },
  { id: "ABT-03", descricao: "slideshow institucional 3", cor: "#1A3A5F" },
  { id: "ABT-04", descricao: "slideshow institucional 4", cor: "#3B0764" },
  { id: "ABT-05", descricao: "slideshow institucional 5", cor: "#0F172A" },
];

export default function SobrePage() {
  return (
    <>
      {/* ══ 1 — Introdução + contadores ═════════════════════════════ */}
      <div className="section-light">
        <section className="flex flex-col gap-12 px-5 pt-28 md:flex-row md:items-start md:justify-between md:gap-[5vw] md:px-[5vw] md:pt-[11vw]">
          <div className="md:max-w-[55%]">
            <RevealSequence>
              <RevealOnScroll as="p" className="type-label text-gmt-muted">
                Sobre a GMT
              </RevealOnScroll>
              <RevealOnScroll as="h1" className="type-h2 mt-6 max-w-3xl">
                Agência especialista em automações, inteligência artificial e
                marketing digital, dedicada a ajudar pequenas empresas a crescer e a
                destacar-se no mundo digital.
              </RevealOnScroll>
              <RevealOnScroll
                as="p"
                className="type-body-lg mt-8 max-w-lg text-gmt-muted"
              >
                Objetivo claro: gerar resultados reais. Cada negócio, por mais
                pequeno que seja, merece uma presença digital profissional e eficaz.
              </RevealOnScroll>
            </RevealSequence>
          </div>

          <AboutCounterGrid />
        </section>
      </div>

      {/* ══ 2 — Slideshow expansivo (branco → preto) ═════════════════ */}
      <ExpandingFrame
        images={ABOUT_SLIDESHOW}
        fallbackColor="#1E293B"
      />

      {/* ══ 3 — Manifesto (fundo preto, sem imagem) ═══════════════════ */}
      <section className="bg-black px-5 py-16 text-center md:px-[5vw] md:py-20">
        <RevealOnScroll as="p" className="type-h3 mx-auto max-w-3xl text-white">
          O nosso compromisso é simples. Ajudar o seu negócio a crescer online com
          soluções profissionais eficazes e acessíveis.
        </RevealOnScroll>
      </section>

      {/* ══ 4 — Nossos valores (fundo preto) ══════════════════════════ */}
      <section className="section-cta px-5 py-24 md:px-[5vw] md:py-[10vw]">
        <div className="flex flex-col gap-16 md:flex-row md:gap-[5vw]">
          <div className="hidden md:block md:w-1/2" aria-hidden />

          <div className="md:w-1/2">
            <SectionLabel tone="on-dark">Nossos valores</SectionLabel>

            <div className="mt-12 flex flex-col gap-10 md:gap-12">
              {DIFERENCIAIS.map((titulo, i) => {
                const Icone = ICONES_DIFERENCIAIS[i] ?? Target;
                return (
                  <RevealOnScroll key={titulo} variant="media" delay={i * 0.06}>
                    <div className="flex items-start gap-5">
                      <Icone
                        size={22}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0 text-white"
                        aria-hidden
                      />
                      <p className="type-body-lg text-white">{titulo}</p>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
