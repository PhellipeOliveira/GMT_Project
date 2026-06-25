import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { RevealText } from "@/components/ui/RevealText";
import { RevealItem } from "@/components/ui/RevealItem";
import { portfolio } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Trabalho recente da GMT. Criámos integralmente o NARA — branding, website, chatbots inteligentes e campanhas publicitárias.",
};

const EM_BREVE = ["PF-EB1", "PF-EB2", "PF-EB3"];

export default function PortfolioPage() {
  return (
    <>
      <section className="px-5 pt-28 md:px-[5vw] md:pt-[11vw]">
        <div className="flex flex-col gap-10 md:flex-row md:gap-[5vw]">
          <div className="md:w-1/2">
            <p className="type-label text-gmt-muted">Trabalho recente</p>
            <RevealText as="h1" className="type-h2 mt-4">
              Portfolio
            </RevealText>
            <RevealText as="p" className="type-body-lg mt-6 max-w-xl text-gmt-muted">
              Criámos integralmente o NARA — uma plataforma tecnológica que
              atende profissionais em vários países. Do branding e website a
              chatbots inteligentes e campanhas publicitárias, todo o ecossistema
              digital foi desenvolvido pela agência.
            </RevealText>
          </div>

          <div className="grid grid-cols-2 gap-3 md:w-1/2 md:grid-cols-4">
            {portfolio.map((c) => (
              <PlaceholderMedia
                key={c.slug}
                id="PF-02"
                descricao={`${c.nome} · 3:2`}
                proporcao="3/2"
                cor={c.corPlaceholder}
                className="rounded-lg"
                sizes="(max-width: 768px) 50vw, 12vw"
              />
            ))}
            {EM_BREVE.map((id) => (
              <PlaceholderMedia
                key={id}
                id={id}
                descricao="em breve · 3:2"
                proporcao="3/2"
                cor="#1E293B"
                className="rounded-lg opacity-50"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 px-5 md:mt-[8vw] md:px-[5vw]">
        <ul className="border-t border-gmt-border">
          {portfolio.map((c, i) => (
            <li key={c.slug} className="border-b border-gmt-border">
              <RevealItem easing="portfolio" delay={i * 0.05}>
                <Link
                  href={`/portfolio/${c.slug}`}
                  className="group flex items-center gap-5 py-8 md:gap-[2vw]"
                >
                  <span className="font-mono type-body text-gmt-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <PlaceholderMedia
                    id="PF-02"
                    descricao="3:2"
                    proporcao="3/2"
                    cor={c.corPlaceholder}
                    className="w-20 shrink-0 rounded-md md:w-28"
                    sizes="112px"
                  />
                  <div className="flex-1">
                    <h3 className="type-h3 group-hover:text-gmt-accent">
                      {c.nome}
                    </h3>
                    <p className="type-body mt-1 text-gmt-muted">{c.local}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="type-label rounded-full bg-white/10 px-3 py-1 text-gmt-text backdrop-blur-sm normal-case tracking-normal"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-gmt-muted transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </RevealItem>
            </li>
          ))}

          {EM_BREVE.map((id, i) => (
            <li key={id} className="border-b border-gmt-border">
              <RevealItem
                easing="portfolio"
                delay={(portfolio.length + i) * 0.05}
              >
                <div className="flex items-center gap-5 py-8 opacity-50 md:gap-[2vw]">
                <span className="font-mono type-body text-gmt-muted">
                  {String(portfolio.length + i + 1).padStart(2, "0")}
                </span>
                <PlaceholderMedia
                  id={id}
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
              </RevealItem>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 px-5 py-20 text-center md:mt-[8vw] md:px-[5vw] md:py-[8vw]">
        <RevealText as="h2" className="type-h3 mx-auto max-w-2xl">
          Quer ser o nosso próximo case?
        </RevealText>
        <p className="type-body mt-4 text-gmt-muted">
          Agende uma reunião gratuita e sem compromisso.
        </p>
        <Link
          href="/contacto"
          className="type-body type-medium mt-8 inline-block rounded-full bg-gmt-accent px-8 py-3 text-white"
        >
          Agendar reunião
        </Link>
      </section>
    </>
  );
}
