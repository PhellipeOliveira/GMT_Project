/**
 * HOME — estrutura de secções (pós-refactor 2026)
 *
 * DOC_TODO (não actualizar agora — segunda etapa):
 * - docs/guia/PARTE_01_HOME.md
 * - docs/GUIA_EDICAO_SITE.md (secção Home)
 * - docs/TIPOGRAFIA_PAGINAS.md (rótulos `.section-label`)
 * - src/data/media-spec.ts (cards overlay SERV-AV-*)
 */
import Link from "next/link";
import { Target } from "lucide-react";
import { HeroSection } from "@/components/hero/HeroSection";
import { DIFERENCIAIS, ICONES_DIFERENCIAIS } from "@/data/diferenciais";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ExpandingFrame } from "@/components/ui/ExpandingFrame";
import { ServiceOverlayCard } from "@/components/home/ServiceOverlayCard";
import { HomePortfolioRow } from "@/components/home/HomePortfolioRow";
import { avulsos } from "@/data/servicos";
import { getCaseBySlug } from "@/data/portfolio";

const SERV_IMAGE_IDS = [
  "SERV-AV-01",
  "SERV-AV-02",
  "SERV-AV-03",
  "SERV-AV-04",
  "SERV-AV-05",
  "SERV-AV-06",
];

export default function HomePage() {
  const nara = getCaseBySlug("nara");

  return (
    <>
      {/* ══ 1 ── HERO ════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ══ 2 ── O QUE FAZEMOS ══════════════════════════════════════ */}
      <section className="not-prose bg-white px-5 py-20 text-left md:px-[5vw] md:py-[8vw]">
        <SectionLabel className="block w-full text-left">O que fazemos</SectionLabel>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {avulsos.map((servico, i) => (
            <RevealOnScroll key={servico.slug} variant="media" delay={i * 0.08}>
              <ServiceOverlayCard
                servico={servico}
                imageId={SERV_IMAGE_IDS[i] ?? "SERV-AV-01"}
              />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll variant="media" delay={0.16}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/servicos"
              className="type-label inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-white transition-colors duration-300 hover:bg-black/80"
            >
              Ver todos os serviços →
            </Link>
          </div>
        </RevealOnScroll>
      </section>

      {/* ══ 3 ── POR QUE A GMT ═══════════════════════════════════════ */}
      <section className="not-prose bg-gmt-bg-alt px-5 py-20 text-left md:px-[5vw] md:py-[8vw]">
        <SectionLabel className="block w-full text-left">Por que a GMT</SectionLabel>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {DIFERENCIAIS.map((titulo, i) => {
            const Icone = ICONES_DIFERENCIAIS[i] ?? Target;
            return (
              <RevealOnScroll key={titulo} variant="media" delay={i * 0.06}>
                <div className="flex items-start gap-4">
                  <Icone
                    size={20}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-gmt-text"
                    aria-hidden
                  />
                  <p className="type-body text-gmt-text">{titulo}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* ══ 4 ── TRANSIÇÃO EXPANSIVA (branco → preto) ═══════════════ */}
      <ExpandingFrame />

      {/* ══ 5 ── TRABALHOS RECENTES ══════════════════════════════════ */}
      <section className="section-cta px-5 py-20 md:px-[5vw] md:py-[8vw]">
        <SectionLabel tone="on-dark">Trabalhos recentes</SectionLabel>

        <div className="mt-12">
          {nara && (
            <HomePortfolioRow
              placeholderId="PF-01"
              nome={nara.nome}
              cor={nara.corPlaceholder}
              slug={nara.slug}
              resumo={nara.resumo}
            />
          )}
        </div>

        <RevealOnScroll variant="media" delay={0.16}>
          <div className="mt-16 flex justify-center">
            <Link
              href="/portfolio"
              className="type-label inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
            >
              Ver portfólio completo →
            </Link>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
