import Link from "next/link";
import {
  PenTool,
  Megaphone,
  Palette,
  Globe,
  Bot,
  BarChart3,
  Trophy,
  Layers,
  Zap,
  Users,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { HeroSection } from "@/components/hero/HeroSection";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ExpandingFrame } from "@/components/ui/ExpandingFrame";
import { GMTLightFooter } from "@/components/ui/GMTLightFooter";
import { avulsos } from "@/data/servicos";
import { getCaseBySlug } from "@/data/portfolio";

/* Mapeamento slug → ícone para os cards de serviço */
const ICONES_AVULSOS: Record<string, LucideIcon> = {
  "criacao-conteudo-avulso": PenTool,
  "publicidade-digital": Megaphone,
  "branding-estrategia": Palette,
  websites: Globe,
  "inteligencia-artificial": Bot,
  "analytics-otimizacao": BarChart3,
};

/* ID de imagem 7:5 por posição no array avulsos */
const SERV_IMAGE_IDS = [
  "SERV-AV-01",
  "SERV-AV-02",
  "SERV-AV-03",
  "SERV-AV-04",
  "SERV-AV-05",
  "SERV-AV-06",
];

/* Ícones dos diferenciais — ordem alinhada com DIFERENCIAIS */
const ICONES_DIFERENCIAIS: LucideIcon[] = [
  Trophy,
  Layers,
  Zap,
  Users,
  Target,
  TrendingUp,
];

const DIFERENCIAIS = [
  {
    titulo: "Experiência comprovada",
    texto: "Criámos todo o ecossistema digital do NARA — resultados reais, não teoria.",
  },
  {
    titulo: "Técnica + criatividade",
    texto:
      "Competências técnicas (websites, IA, analytics) e criativas (design, vídeo, copywriting) num só local.",
  },
  {
    titulo: "Tecnologia de ponta",
    texto: "Uso de IA para entregar mais qualidade em menos tempo.",
  },
  {
    titulo: "Acompanhamento próximo",
    texto: "Parceria focada no crescimento do negócio, não apenas mais um serviço.",
  },
  {
    titulo: "Foco em pequenas empresas",
    texto: "Soluções acessíveis e adaptadas à realidade local.",
  },
  {
    titulo: "Resultados mensuráveis",
    texto: "Tudo medido e reportado, com clareza sobre o retorno.",
  },
];

export default function HomePage() {
  const nara = getCaseBySlug("nara");

  return (
    <>
      {/* ══ 0 ── HERO ════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ══ 1 ── O QUE FAZEMOS ══════════════════════════════════════ */}
      <section className="bg-white px-5 py-20 md:px-[5vw] md:py-[8vw]">
        <RevealOnScroll as="p" className="type-label text-gmt-text">
          O que fazemos
        </RevealOnScroll>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2">
          {avulsos.map((servico, i) => (
            <RevealOnScroll key={servico.slug} variant="media" delay={i * 0.08}>
              <Link
                href={`/servicos/${servico.slug}`}
                className="group block overflow-hidden rounded-2xl border border-gmt-border bg-gmt-bg transition-colors duration-300 hover:border-gmt-accent"
              >
                {/* Imagem 7:5 */}
                <PlaceholderMedia
                  id={SERV_IMAGE_IDS[i] ?? "SERV-AV-01"}
                  descricao={servico.nome}
                  cor={servico.corPlaceholder}
                  sizes="(max-width: 640px) 100vw, 45vw"
                  reveal={false}
                />
                {/* Info */}
                <div className="p-5">
                  <h3 className="type-body font-medium text-gmt-text">
                    {servico.nome}
                  </h3>
                  <p className="type-body mt-1 text-gmt-muted">
                    {servico.funcionalidades[0]}
                  </p>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        {/* Botão "Ver todos os serviços" */}
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

      {/* ══ 2 ── PORQUÊ A GMT ════════════════════════════════════════ */}
      <section className="bg-gmt-bg-alt px-5 py-20 md:px-[5vw] md:py-[8vw]">
        <RevealOnScroll as="p" className="type-label text-gmt-text">
          Porquê a GMT
        </RevealOnScroll>
        <RevealOnScroll as="h2" className="type-h3 mt-5 max-w-2xl" delay={0.08}>
          Cada negócio, por mais pequeno que seja, merece uma presença digital
          profissional e eficaz.
        </RevealOnScroll>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIFERENCIAIS.map((d, i) => {
            const Icone = ICONES_DIFERENCIAIS[i] ?? Target;
            return (
              <RevealOnScroll key={d.titulo} variant="media" delay={i * 0.08}>
                <div className="group cursor-default rounded-2xl border border-gmt-border bg-gmt-bg p-6 transition-colors duration-300 hover:bg-gmt-bg-alt">
                  <span className="block w-fit rounded-xl border border-gmt-border bg-gmt-bg-alt p-3 text-gmt-text transition-colors duration-300 group-hover:border-gmt-accent group-hover:text-gmt-accent">
                    <Icone size={22} strokeWidth={1.5} />
                  </span>
                  <h3 className="type-body mt-5 font-medium text-gmt-text">
                    {d.titulo}
                  </h3>
                  <p className="type-body mt-2 text-gmt-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {d.texto}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* ══ 3 ── FRAME EXPANSIVO (transição branco → preto) ═════════ */}
      <ExpandingFrame />

      {/* ══ 4 ── TRABALHOS RECENTES (fundo preto) ═══════════════════ */}
      <section className="section-cta px-5 py-20 md:px-[5vw] md:py-[8vw]">
        <RevealOnScroll as="p" className="type-label">
          Trabalhos recentes
        </RevealOnScroll>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          {nara && (
            <PortfolioCard
              placeholderId="PF-01"
              nome={nara.nome}
              cor={nara.corPlaceholder}
              slug={nara.slug}
              local={nara.local}
              industria={nara.industria}
              servicos={nara.servicos}
              tags={nara.tags}
            />
          )}
          <PortfolioCard
            placeholderId="PF-02a"
            nome="Projeto"
            cor="#1E293B"
            emBreve
            delay={0.08}
          />
          <PortfolioCard
            placeholderId="PF-02b"
            nome="Projeto"
            cor="#1E293B"
            emBreve
            delay={0.16}
          />
        </div>
        <RevealOnScroll variant="media" delay={0.16}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/portfolio"
              className="type-label inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
            >
              Ver portfolio completo →
            </Link>
          </div>
        </RevealOnScroll>
      </section>

      {/* ══ 5 ── TESTEMUNHAS (temporário — faixa preta) ═════════════ */}
      <section className="section-cta border-t border-white/10 px-5 py-20 text-center md:px-[5vw] md:py-[8vw]">
        <RevealOnScroll as="p" className="type-label text-white/40">
          Testemunhas
        </RevealOnScroll>
        <RevealOnScroll
          as="h2"
          className="type-h3 mx-auto mt-5 max-w-xl"
          delay={0.08}
        >
          Em breve — depoimentos dos nossos primeiros clientes.
        </RevealOnScroll>
        <RevealOnScroll variant="media" delay={0.16}>
          <Link href="/contacto" className="btn-submit mt-8">
            Agendar agora
          </Link>
        </RevealOnScroll>
      </section>

      {/* ══ 6 ── CTA FINAL ══════════════════════════════════════════ */}
      <section className="section-cta border-t border-white/10 px-5 py-24 text-center md:px-[5vw] md:py-[8vw]">
        <RevealOnScroll as="h2" className="type-h3 mx-auto max-w-2xl">
          Pronto para automatizar o seu negócio?
        </RevealOnScroll>
        <RevealOnScroll
          as="p"
          className="type-body mt-4 text-gmt-muted"
          delay={0.08}
        >
          Reunião gratuita e sem compromisso.
        </RevealOnScroll>
        <RevealOnScroll variant="media" delay={0.16}>
          <Link href="/contacto" className="btn-submit mt-8">
            Agendar agora
          </Link>
        </RevealOnScroll>
      </section>

      {/* ══ 7 ── LANTERNA GMT (decorativo, transição para o footer) ══ */}
      <GMTLightFooter />
    </>
  );
}
