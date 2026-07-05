import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { servicos, getServicoBySlug, getAdjacentServicos } from "@/data/servicos";
import { getServicoHeroId } from "@/lib/media";

/** Slots de mídia da Sec3 — Como funciona (ver `docs/PLANO_MESTRE_DE_MIDIA.md` § CF-01…05). */
const COMO_FUNCIONA_SLOTS = [
  { id: "CF-01", titulo: "Reunião inicial", descricao: "card mídia posição 1", cor: "#1E293B" },
  { id: "CF-02", titulo: "Proposta personalizada", descricao: "card mídia posição 2", cor: "#134E4A" },
  { id: "CF-03", titulo: "Planeamento estratégico", descricao: "card mídia posição 3", cor: "#1A3A5F" },
  { id: "CF-04", titulo: "Execução & implementação", descricao: "card mídia posição 4", cor: "#3B0764" },
  { id: "CF-05", titulo: "Acompanhamento & otimização", descricao: "card mídia posição 5", cor: "#0F172A" },
] as const;

const HERO_NAV_LINK =
  "type-label inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/20 px-5 py-3 font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30";

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

  return (
    <>
      {/* ===== Sec 0 — Hero do serviço (full-bleed 70–80vh) ===== */}
      <section
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
            <div className="flex flex-col items-center gap-2">
              <RevealOnScroll
                as="h1"
                className="type-hero type-hero--fullscreen mx-auto max-w-4xl !text-white !leading-[1.05] [&>div]:!leading-[1.05]"
              >
                {servico.nome}
              </RevealOnScroll>
              {servico.headline && (
                <RevealOnScroll
                  as="p"
                  className="mx-auto max-w-2xl text-[clamp(1.125rem,2.5vw,1.75rem)] leading-snug text-white"
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

        {/* ===== Sec 2 — O que inclui (funcionalidades) ===== */}
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

        {/* ===== Sec 3 — Como funciona (5 slots CF-01…05) ===== */}
        <section
          className={`px-5 pt-16 md:px-[5vw] md:pt-[8vw] ${
            servico.casosDeUso.length === 0 ? "pb-16 md:pb-[8vw]" : ""
          }`}
        >
          <RevealOnScroll as="h2" className="type-label text-gmt-muted">
            Como funciona
          </RevealOnScroll>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {COMO_FUNCIONA_SLOTS.map((slot, i) => (
              <RevealOnScroll key={slot.id} variant="media" delay={i * 0.08}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gmt-border md:aspect-[2/3]">
                  <PlaceholderMedia
                    id={slot.id}
                    descricao={slot.descricao}
                    cor={slot.cor}
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    reveal={false}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                    <span className="rounded-lg bg-white/75 px-4 py-2.5 text-center text-gmt-text backdrop-blur-md type-body-lg">
                      {slot.titulo}
                    </span>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* ===== Sec 4 — Casos de uso ===== */}
        {servico.casosDeUso.length > 0 && (
          <section className="px-5 pt-16 pb-16 md:px-[5vw] md:pt-[8vw] md:pb-[8vw]">
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
      </div>
    </>
  );
}
