import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { RevealText } from "@/components/ui/RevealText";
import { RevealItem } from "@/components/ui/RevealItem";
import { portfolio, getCaseBySlug } from "@/data/portfolio";

export function generateStaticParams() {
  return portfolio.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caso = getCaseBySlug(slug);
  if (!caso) return { title: "Case não encontrado" };
  return { title: caso.nome, description: caso.resumo };
}

export default async function PortfolioItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caso = getCaseBySlug(slug);
  if (!caso) notFound();

  return (
    <>
      <section className="flex flex-col gap-[3vw] px-5 pt-28 md:flex-row md:px-[5vw] md:pt-[11vw]">
        <aside className="flex flex-col self-start md:sticky md:top-24 md:w-2/5">
          <Link
            href="/portfolio"
            className="type-label text-gmt-muted transition-colors hover:text-gmt-text"
          >
            ← Portfolio
          </Link>

          <RevealText as="h1" className="type-h2 mt-5">
            {caso.nome}
          </RevealText>

          <div className="mt-5 flex flex-wrap gap-2">
            {caso.tags.map((tag) => (
              <span
                key={tag}
                className="type-body rounded-lg bg-white/10 px-3 py-1 text-gmt-text backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <RevealText as="p" className="type-body-lg my-8 text-gmt-muted">
            {caso.resumo}
          </RevealText>

          <dl className="flex flex-col gap-4 border-t border-gmt-border pt-6">
            <div>
              <dt className="type-label text-gmt-muted">Localização</dt>
              <dd className="type-body mt-1 text-gmt-text">{caso.local}</dd>
            </div>
            <div>
              <dt className="type-label text-gmt-muted">Indústria</dt>
              <dd className="type-body mt-1 text-gmt-text">{caso.industria}</dd>
            </div>
            <div>
              <dt className="type-label text-gmt-muted">Serviços</dt>
              <dd className="type-body mt-1 text-gmt-text">{caso.servicos}</dd>
            </div>
          </dl>

          <Link
            href="/contacto"
            className="type-body type-medium mt-8 inline-flex w-full justify-center rounded-lg bg-gmt-accent px-6 py-3 text-white transition-colors hover:bg-gmt-accent-2"
          >
            Falar sobre um projeto
          </Link>
        </aside>

        <div className="flex flex-col gap-4 md:w-3/5 md:gap-[1.5vw]">
          {caso.galeria.map((img, i) => (
            <RevealItem key={img.id} easing="portfolio" delay={i * 0.05}>
              <PlaceholderMedia
                id={img.id}
                descricao={`${img.legenda ?? "galeria"} · ${img.proporcao.replace("/", ":")}`}
                proporcao={img.proporcao}
                cor={caso.corPlaceholder}
                className="rounded-lg md:rounded-[1vw]"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </RevealItem>
          ))}
        </div>
      </section>

      <section className="mt-20 px-5 md:mt-[8vw] md:px-[5vw]">
        <h2 className="type-label text-gmt-muted">Próximo projeto</h2>
        <ul className="mt-6 border-t border-gmt-border">
          {[0, 1].map((i) => (
            <li key={i} className="border-b border-gmt-border">
              <div className="flex items-center gap-5 py-8 opacity-50 md:gap-[2vw]">
                <PlaceholderMedia
                  id={`PF-NX${i + 1}`}
                  descricao="3:2"
                  proporcao="3/2"
                  cor="#1E293B"
                  className="w-20 shrink-0 rounded-md md:w-28"
                />
                <div className="flex-1">
                  <h3 className="type-h3">Em breve</h3>
                  <p className="type-body mt-1 text-gmt-muted">
                    Novo case em produção
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 px-5 py-20 text-center md:mt-[8vw] md:px-[5vw] md:py-[8vw]">
        <RevealText as="h2" className="type-h3 mx-auto max-w-2xl">
          Pronto para automatizar o seu negócio?
        </RevealText>
        <p className="type-body mt-4 text-gmt-muted">
          Reunião gratuita e sem compromisso.
        </p>
        <Link
          href="/contacto"
          className="type-body type-medium mt-8 inline-block rounded-full bg-gmt-accent px-8 py-3 text-white transition-colors hover:bg-gmt-accent-2"
        >
          Agendar agora
        </Link>
      </section>
    </>
  );
}
