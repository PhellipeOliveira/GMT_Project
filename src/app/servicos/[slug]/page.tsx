import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { servicos, getServicoBySlug } from "@/data/servicos";
import { getCaseBySlug } from "@/data/portfolio";
import { getFamiliaProcessBg, getServicoHeroId } from "@/lib/media";

// Processo GMT (copy institucional "COMO FUNCIONA") — partilhado por todos os serviços.
const PROCESSO = [
  {
    numero: "01",
    titulo: "Reunião inicial",
    resumo:
      "Conversa gratuita e sem compromisso para conhecer o negócio e os objetivos.",
  },
  {
    numero: "02",
    titulo: "Proposta personalizada",
    resumo:
      "Serviços recomendados, cronograma e investimento adaptados às necessidades.",
  },
  {
    numero: "03",
    titulo: "Planeamento estratégico",
    resumo: "Estratégia, calendário e objetivos definidos em conjunto.",
  },
  {
    numero: "04",
    titulo: "Execução & implementação",
    resumo: "Conteúdo, ferramentas e campanhas com qualidade profissional.",
  },
  {
    numero: "05",
    titulo: "Acompanhamento & otimização",
    resumo: "Análise contínua, otimização e relatórios regulares.",
  },
];

export function generateStaticParams() {
  return servicos.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const servico = getServicoBySlug(slug);
  if (!servico) return { title: "Serviço não encontrado" };
  return {
    title: servico.nome,
    description: servico.headline || servico.solucao || servico.nome,
  };
}

export default async function ServicoItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const servico = getServicoBySlug(slug);
  if (!servico) notFound();

  const nara = getCaseBySlug("nara");
  const heroId = getServicoHeroId(servico);
  const processBgId = getFamiliaProcessBg(servico.familia);

  return (
    <>
      {/* ===== Sec 0 — Hero do serviço (full-bleed 70vh) ===== */}
      <section className="relative h-[80vh] w-full overflow-hidden md:h-[70vh]">
        <PlaceholderMedia
          id={heroId}
          descricao={`${servico.nome} · hero 3:1`}
          cor={servico.corPlaceholder}
          fill
          priority
          sizes="100vw"
          reveal={false}
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black via-black/40 to-transparent">
          <div className="w-full px-5 pb-12 text-white md:w-1/2 md:px-[5vw] md:pb-[5vw]">
            <RevealOnScroll variant="media">
              <Link
                href="/servicos"
                className="type-label text-white/70 transition-colors hover:text-white"
              >
                ← Serviços
              </Link>
            </RevealOnScroll>
            <RevealOnScroll as="h1" className="type-hero type-hero--fullscreen mt-4 max-w-3xl !text-white">
              {servico.nome}
            </RevealOnScroll>
            {servico.headline && (
              <RevealOnScroll as="p" className="type-body-lg mt-4 max-w-xl text-white/70" delay={0.08}>
                {servico.headline}
              </RevealOnScroll>
            )}
          </div>
        </div>
      </section>

      <div className="section-light">
      {/* ===== Sec 1 — Proposta de valor (problema + solução) ===== */}
      {(servico.problema || servico.solucao) && (
        <section className="px-5 pt-16 md:px-[5vw] md:pt-[5vw]">
          <div className="flex flex-col gap-10 md:flex-row md:gap-[5vw]">
            {servico.problema && (
              <div className="md:w-1/2">
                <RevealOnScroll as="h2" className="type-label text-gmt-muted">
                  O desafio
                </RevealOnScroll>
                <RevealOnScroll as="p" className="type-h3 mt-5">
                  {servico.problema}
                </RevealOnScroll>
              </div>
            )}
            {servico.solucao && (
              <div className="md:w-1/2">
                <RevealOnScroll as="h2" className="type-label text-gmt-muted">
                  A solução
                </RevealOnScroll>
                <RevealOnScroll as="p" className="type-body-lg mt-5 text-gmt-muted" delay={0.08}>
                  {servico.solucao}
                </RevealOnScroll>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== Sec 1b — Benefícios ===== */}
      {servico.beneficios.length > 0 && (
        <section className="px-5 pt-16 md:px-[5vw] md:pt-[5vw]">
          <RevealOnScroll as="h2" className="type-label text-gmt-muted">
            Benefícios
          </RevealOnScroll>
          <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {servico.beneficios.map((b, i) => (
              <li key={b}>
                <RevealOnScroll variant="media" delay={i * 0.08}>
                  <div className="flex items-start gap-3 rounded-lg border border-gmt-border bg-gmt-bg-alt p-5">
                    <Check size={18} className="mt-0.5 shrink-0 text-gmt-accent" />
                    <span className="type-body text-gmt-text">{b}</span>
                  </div>
                </RevealOnScroll>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ===== Sec 2 — O que fazemos (funcionalidades) ===== */}
      <section className="flex flex-col px-5 pt-16 md:px-[5vw] md:pt-[8vw]">
        <div className="flex flex-col gap-8 md:flex-row md:gap-[5vw]">
          <div className="md:w-1/3">
            <RevealOnScroll as="h2" className="type-label text-gmt-muted">
              O que inclui
            </RevealOnScroll>
          </div>
          <div className="md:w-2/3">
            {servico.solucao && servico.tipo === "pacote" && (
              <RevealOnScroll as="p" className="type-body mb-6 text-gmt-muted">
                {servico.solucao}
              </RevealOnScroll>
            )}
            <ul className="flex flex-col divide-y divide-gmt-border border-t border-gmt-border">
              {servico.funcionalidades.map((f, i) => (
                <li key={f}>
                  <RevealOnScroll variant="media" delay={i * 0.08}>
                    <span className="type-body-lg block py-4 text-gmt-text">{f}</span>
                  </RevealOnScroll>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Sec 3 — Como funciona (process cards) ===== */}
      <section className="px-5 pt-16 md:px-[5vw] md:pt-[8vw]">
        <RevealOnScroll as="h2" className="type-label text-gmt-muted">
          Como funciona
        </RevealOnScroll>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESSO.map((p, i) => (
            <RevealOnScroll key={p.numero} variant="media" delay={i * 0.08}>
              <div className="relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-gmt-border bg-white/50 p-6 md:aspect-[2/3]">
              {processBgId && (
                <PlaceholderMedia
                  id={processBgId}
                  descricao="fundo do processo"
                  cor={servico.corPlaceholder}
                  className="opacity-20"
                  fill
                  sizes="240px"
                  reveal={false}
                />
              )}
              <div className="relative z-10">
                <span className="font-mono type-body text-gmt-accent">
                  {p.numero}
                </span>
                <h3 className="type-body-lg mt-4 text-gmt-text">{p.titulo}</h3>
                <p className="type-body mt-2 text-gmt-muted">{p.resumo}</p>
              </div>
            </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ===== Sec 4 — Casos de uso ===== */}
      {servico.casosDeUso.length > 0 && (
        <section className="px-5 pt-16 md:px-[5vw] md:pt-[8vw]">
          <RevealOnScroll as="h2" className="type-label text-gmt-muted">
            Para quem é
          </RevealOnScroll>
          <div className="mt-6 flex flex-wrap gap-3">
            {servico.casosDeUso.map((c, i) => (
              <RevealOnScroll key={c} variant="media" delay={i * 0.08}>
                <span className="tag-pill">{c}</span>
              </RevealOnScroll>
            ))}
          </div>
        </section>
      )}

      {/* ===== Sec 5 — Portfolio em prática ===== */}
      {nara && (
        <section className="px-5 pt-16 md:px-[5vw] md:pt-[8vw]">
          <RevealOnScroll as="h2" className="type-label text-gmt-muted">
            Em prática
          </RevealOnScroll>
          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
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
          </div>
        </section>
      )}

      </div>

      {/* ===== Sec 6 — CTA final ===== */}
      <section className="section-cta mt-20 px-5 py-20 text-center md:mt-[8vw] md:px-[5vw] md:py-[8vw]">
        <RevealOnScroll as="h2" className="type-h3 mx-auto max-w-2xl">
          Quer este serviço no seu negócio?
        </RevealOnScroll>
        <RevealOnScroll as="p" className="type-body mt-4 text-gmt-muted" delay={0.08}>
          Agende uma reunião gratuita e sem compromisso.
        </RevealOnScroll>
        <RevealOnScroll variant="media" delay={0.16}>
          <Link href="/contacto" className="btn-submit mt-8">
            Agendar reunião
          </Link>
        </RevealOnScroll>
      </section>
    </>
  );
}
