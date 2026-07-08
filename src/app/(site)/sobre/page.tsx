import type { Metadata } from "next";
import { Target } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { RevealSequence } from "@/components/ui/reveal-sequence";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DIFERENCIAIS, ICONES_DIFERENCIAIS } from "@/data/diferenciais";
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
              <SectionHeader
                eyebrow="Sobre a GMT"
                title={
                  <>
                    Agência especialista em automações, inteligência artificial e
                    marketing digital, dedicada a ajudar pequenas empresas a crescer e a
                    destacar-se no mundo digital.
                  </>
                }
                tone="on-light"
                eyebrowAs="p"
                eyebrowClassName="type-label text-gmt-muted"
                titleAs="h1"
                titleClassName="type-h2 mt-6 max-w-3xl"
              />
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

      {/* ══ 3 — Manifesto + valores (bloco preto contínuo) ═════════════ */}
      <section className="section-cta not-prose px-5 py-[6vw] md:px-[5vw]">
        <div className="text-center">
          <RevealOnScroll as="p" className="type-manifesto mx-auto max-w-4xl !text-white">
            O nosso compromisso é simples. Ajudar o seu negócio a crescer online com
            soluções profissionais eficazes e acessíveis.
          </RevealOnScroll>
        </div>

        <div className="mx-auto mt-[5vw] grid max-w-5xl grid-cols-1 gap-x-[4vw] gap-y-[5vw] sm:grid-cols-2">
          {DIFERENCIAIS.map((titulo, i) => {
            const Icone = ICONES_DIFERENCIAIS[i] ?? Target;
            return (
              <RevealOnScroll key={titulo} variant="media" delay={i * 0.06}>
                <div className="flex flex-col items-center gap-4 text-center md:gap-5">
                  <Icone
                    size={30}
                    strokeWidth={1.5}
                    className="shrink-0 text-white"
                    aria-hidden
                  />
                  <p className="type-body-lg !text-white">{titulo}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>
    </>
  );
}
