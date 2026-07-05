import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { RevealSequence } from "@/components/ui/reveal-sequence";
import { portfolio } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Trabalho recente da GMT. Criámos integralmente o NARA — branding, website, chatbots inteligentes e campanhas publicitárias.",
};

const HERO_GRID_SINGLE = "grid-cols-2";
const HERO_GRID_MULTI = "grid-cols-2 md:grid-cols-4";
const HERO_THUMB_SINGLE = "col-span-2 row-span-2";
const HERO_SIZES_SINGLE = "(max-width: 768px) 100vw, 45vw";
const HERO_SIZES_MULTI = "(max-width: 768px) 50vw, 12vw";

export default function PortfolioPage() {
  const singleCase = portfolio.length === 1;

  return (
    <>
      <section className="px-5 pt-28 md:px-[5vw] md:pt-[11vw]">
        <div className="flex flex-col gap-10 md:flex-row md:gap-[5vw]">
          <div className="md:w-1/2">
            <RevealSequence>
              <RevealOnScroll as="p" className="type-label text-gmt-muted">
                Trabalho recente
              </RevealOnScroll>
              <RevealOnScroll as="h1" className="type-h2 mt-4">
                Portfolio
              </RevealOnScroll>
              <RevealOnScroll as="p" className="type-body-lg mt-6 max-w-xl text-gmt-muted">
                Criámos integralmente o NARA — uma plataforma tecnológica que
                atende profissionais em vários países. Do branding e website a
                chatbots inteligentes e campanhas publicitárias, todo o ecossistema
                digital foi desenvolvido pela agência.
              </RevealOnScroll>
            </RevealSequence>
          </div>

          <div
            className={`grid gap-3 md:w-1/2 ${singleCase ? HERO_GRID_SINGLE : HERO_GRID_MULTI}`}
          >
            {portfolio.map((c, i) => (
              <RevealOnScroll
                key={c.slug}
                variant="media"
                delay={i * 0.08}
                className={singleCase ? HERO_THUMB_SINGLE : undefined}
              >
                <PlaceholderMedia
                  id="PF-02"
                  descricao={`${c.nome} · 9:16`}
                  cor={c.corPlaceholder}
                  className="rounded-lg"
                  sizes={singleCase ? HERO_SIZES_SINGLE : HERO_SIZES_MULTI}
                  reveal={false}
                />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 px-5 md:mt-[8vw] md:px-[5vw]">
        <ul className="border-t border-gmt-border">
          {portfolio.map((c, i) => (
            <li key={c.slug} className="border-b border-gmt-border">
              <RevealOnScroll variant="media" delay={i * 0.08}>
                <Link
                  href={`/portfolio/${c.slug}`}
                  className="group flex items-center gap-5 py-16 md:gap-[2vw] md:py-[8vw]"
                >
                  <span className="font-mono type-body text-gmt-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                <div className="relative h-[calc(5rem*16/9)] w-20 shrink-0 overflow-hidden rounded-md md:h-[calc(7rem*16/9)] md:w-28">
                  <PlaceholderMedia
                    id="PF-02"
                    descricao="9:16"
                    cor={c.corPlaceholder}
                    fill
                    sizes="112px"
                    reveal={false}
                  />
                </div>
                  <div className="flex-1">
                    <h3 className="type-h3 group-hover:text-gmt-accent">
                      {c.nome}
                    </h3>
                    <p className="type-body mt-1 text-gmt-muted">{c.local}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.tags.map((tag) => (
                        <span key={tag} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-gmt-muted transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
