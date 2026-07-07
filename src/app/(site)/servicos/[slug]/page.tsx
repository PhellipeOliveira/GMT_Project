import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ComoFuncionaTimeline } from "@/components/servicos/ComoFuncionaTimeline";
import { servicos, getServicoBySlug, getAdjacentServicos } from "@/data/servicos";
import { getServicoHeroId } from "@/lib/media";

const HERO_NAV_LINK =
  "type-label inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/20 px-5 py-3 font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30";

/** Eyebrow visível de secção: barra de destaque + rótulo escuro (não cinzento). */
function Kicker({ children }: { children: string }) {
  return (
    <RevealOnScroll variant="media" className="mb-5 flex items-center gap-3">
      <span className="h-px w-8 shrink-0 bg-gmt-accent" aria-hidden />
      <span className="type-label text-gmt-text">{children}</span>
    </RevealOnScroll>
  );
}

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

  const heroId = getServicoHeroId(servico);
  const { prev, next } = getAdjacentServicos(slug);

  const mostrarSolucao = Boolean(servico.solucao) && servico.tipo !== "pacote";
  const prefacioInclui = servico.tipo === "pacote" ? servico.solucao : "";

  return (
    <>
      {/* ===== Sec 0 — Hero (banner · thumb AG/MKT/AV + gradiente + título branco) ===== */}
      <section
        data-nav-tone="dark"
        className="not-prose relative h-[80vh] w-full overflow-hidden md:h-[70vh]"
        style={{ backgroundColor: servico.corPlaceholder }}
      >
        <PlaceholderMedia
          id={heroId}
          descricao={`${servico.nome} · hero`}
          cor={servico.corPlaceholder}
          fill
          priority
          sizes="100vw"
          reveal={false}
          className="size-full [&_img]:min-h-full [&_img]:min-w-full [&_img]:scale-[1.02] [&_img]:object-cover [&_img]:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10">
          <div className="flex h-full flex-col items-center justify-center px-5 text-center text-white md:px-[5vw]">
            <div className="flex flex-col items-center gap-3">
              <RevealOnScroll
                as="h1"
                className="type-hero type-hero--fullscreen mx-auto max-w-4xl !text-white !leading-[1.05] [&>div]:!leading-[1.05]"
              >
                {servico.nome}
              </RevealOnScroll>
              {servico.headline && (
                <RevealOnScroll
                  as="p"
                  className="mx-auto max-w-2xl text-[clamp(1.125rem,2.5vw,1.75rem)] leading-snug text-white/90"
                  delay={0.08}
                >
                  {servico.headline}
                </RevealOnScroll>
              )}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-12 md:px-[5vw] md:pb-[5vw]">
            <RevealOnScroll variant="media">
              <Link href={`/servicos/${prev.slug}`} className={HERO_NAV_LINK}>
                ← Serviço anterior
              </Link>
            </RevealOnScroll>
            <RevealOnScroll variant="media" delay={0.08}>
              <Link href={`/servicos/${next.slug}`} className={HERO_NAV_LINK}>
                Próximo serviço →
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <div className="section-light not-prose">
        {/* ===== Sec 1 — O desafio (hook prominente) ===== */}
        {servico.problema && (
          <section className="px-5 pt-20 md:px-[5vw] md:pt-[7vw]">
            <div className="mx-auto max-w-5xl">
              <Kicker>O desafio</Kicker>
              <RevealOnScroll as="p" className="type-section-title max-w-4xl">
                {servico.problema}
              </RevealOnScroll>
            </div>
          </section>
        )}

        {/* ===== Sec 2 — A solução + benefícios ===== */}
        {(mostrarSolucao || servico.beneficios.length > 0) && (
          <section className="px-5 pt-16 md:px-[5vw] md:pt-[6vw]">
            <div className="mx-auto max-w-5xl border-t border-gmt-border pt-16 md:pt-[5vw]">
              <div className="flex flex-col gap-10 md:flex-row md:gap-[5vw]">
                <div className="md:w-1/3">
                  <Kicker>A solução</Kicker>
                  <RevealOnScroll as="h2" className="type-section-title">
                    Como resolvemos
                  </RevealOnScroll>
                </div>
                <div className="md:w-2/3">
                  {mostrarSolucao && (
                    <RevealOnScroll as="p" className="type-body-lg text-gmt-muted">
                      {servico.solucao}
                    </RevealOnScroll>
                  )}
                  {servico.beneficios.length > 0 && (
                    <ul
                      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${
                        mostrarSolucao ? "mt-10" : ""
                      }`}
                    >
                      {servico.beneficios.map((b, i) => (
                        <li key={b}>
                          <RevealOnScroll variant="media" delay={i * 0.08}>
                            <div className="flex items-start gap-3 rounded-xl border border-gmt-border bg-gmt-bg-alt p-5">
                              <Check size={18} className="mt-0.5 shrink-0 text-gmt-accent" />
                              <span className="type-body text-gmt-text">{b}</span>
                            </div>
                          </RevealOnScroll>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===== Sec 3 — O que inclui (funcionalidades) ===== */}
        <section className="px-5 pt-16 md:px-[5vw] md:pt-[6vw]">
          <div className="mx-auto max-w-5xl border-t border-gmt-border pt-16 md:pt-[5vw]">
            <div className="flex flex-col gap-10 md:flex-row md:gap-[5vw]">
              <div className="md:w-1/3">
                <Kicker>Em detalhe</Kicker>
                <RevealOnScroll as="h2" className="type-section-title">
                  O que inclui
                </RevealOnScroll>
              </div>
              <div className="md:w-2/3">
                {prefacioInclui && (
                  <RevealOnScroll as="p" className="type-body mb-8 text-gmt-muted">
                    {prefacioInclui}
                  </RevealOnScroll>
                )}
                <ul className="flex flex-col divide-y divide-gmt-border border-t border-gmt-border">
                  {servico.funcionalidades.map((f, i) => (
                    <li key={f}>
                      <RevealOnScroll variant="media" delay={i * 0.06}>
                        <span className="type-body-lg flex items-baseline gap-4 py-5 text-gmt-text">
                          <span className="font-mono text-sm text-gmt-muted">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{f}</span>
                        </span>
                      </RevealOnScroll>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Sec 4 — Como funciona (timeline) ===== */}
        <section className="px-5 pt-16 md:px-[5vw] md:pt-[6vw]">
          <div className="mx-auto max-w-6xl border-t border-gmt-border pt-16 md:pt-[5vw]">
            <Kicker>O processo</Kicker>
            <RevealOnScroll as="h2" className="type-section-title">
              Como funciona
            </RevealOnScroll>
            <ComoFuncionaTimeline />
          </div>
        </section>

        {/* ===== Sec 5 — Para quem é ===== */}
        <section className="px-5 pt-16 pb-20 md:px-[5vw] md:pt-[6vw] md:pb-[8vw]">
          <div className="mx-auto max-w-5xl border-t border-gmt-border pt-16 md:pt-[5vw]">
            <div className="flex flex-col gap-10 md:flex-row md:gap-[5vw]">
              <div className="md:w-1/3">
                <Kicker>Ideal para</Kicker>
                <RevealOnScroll as="h2" className="type-section-title">
                  Para quem é
                </RevealOnScroll>
              </div>
              <div className="md:w-2/3">
                {servico.casosDeUso.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {servico.casosDeUso.map((c, i) => (
                      <RevealOnScroll key={c} variant="media" delay={i * 0.08}>
                        <span className="tag-pill">{c}</span>
                      </RevealOnScroll>
                    ))}
                  </div>
                ) : (
                  <RevealOnScroll as="p" className="type-body-lg text-gmt-muted">
                    Pequenas e médias empresas que querem resultados reais, com um
                    parceiro que trata de tudo de ponta a ponta.
                  </RevealOnScroll>
                )}
                <RevealOnScroll variant="media" delay={0.16}>
                  <Link
                    href="/contacto"
                    className="type-label mt-10 inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-white transition-colors duration-300 hover:bg-black/80"
                  >
                    Falar sobre este serviço →
                  </Link>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
