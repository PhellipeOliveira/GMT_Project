import Link from "next/link";
import {
  PenTool,
  Megaphone,
  Palette,
  Globe,
  Bot,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { HeroSection } from "@/components/hero/HeroSection";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { RevealText } from "@/components/ui/RevealText";
import { RevealItem } from "@/components/ui/RevealItem";
import { avulsos } from "@/data/servicos";
import { getCaseBySlug } from "@/data/portfolio";

const ICONES_AVULSOS: Record<string, LucideIcon> = {
  "criacao-conteudo-avulso": PenTool,
  "publicidade-digital": Megaphone,
  "branding-estrategia": Palette,
  websites: Globe,
  "inteligencia-artificial": Bot,
  "analytics-otimizacao": BarChart3,
};

const DIFERENCIAIS = [
  {
    titulo: "Experiência comprovada",
    texto:
      "Criámos todo o ecossistema digital do NARA — resultados reais, não teoria.",
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
    texto:
      "Parceria focada no crescimento do negócio, não apenas mais um serviço.",
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
      <HeroSection />

      <section className="bg-gmt-bg-alt px-5 py-20 md:px-[5vw] md:py-[7vw]">
        <p className="type-label text-gmt-muted">O que fazemos</p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {avulsos.map((servico, i) => {
            const Icone = ICONES_AVULSOS[servico.slug] ?? Globe;
            return (
              <RevealItem key={servico.slug} easing="services" delay={i * 0.05}>
                <Link
                  href={`/servicos/${servico.slug}`}
                  className="group flex items-start gap-5 rounded-lg border border-gmt-border bg-gmt-bg p-6 hover:border-gmt-accent"
                >
                  <span className="rounded-lg border border-gmt-border p-3 text-gmt-text">
                    <Icone size={22} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="type-body text-gmt-text">{servico.nome}</h3>
                    <p className="type-body mt-1 text-gmt-muted">
                      {servico.funcionalidades[0]}
                    </p>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </div>
      </section>

      <section className="bg-gmt-bg px-5 py-20 md:px-[5vw] md:py-[7vw]">
        <div className="flex flex-col gap-12 md:flex-row md:gap-[5vw]">
          <div className="w-full md:w-3/8">
            <p className="type-label text-gmt-muted">Porquê a GMT</p>
            <RevealText as="h2" className="type-h3 mt-5 max-w-xl">
              Cada negócio, por mais pequeno que seja, merece uma presença
              digital profissional e eficaz.
            </RevealText>
            <ul className="mt-8 flex flex-col gap-5">
              {DIFERENCIAIS.map((d, i) => (
                <li key={d.titulo}>
                  <RevealItem delay={i * 0.05}>
                    <h3 className="type-body text-gmt-text">{d.titulo}</h3>
                    <p className="type-body mt-1 text-gmt-muted">{d.texto}</p>
                  </RevealItem>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 md:flex-1">
            <PlaceholderMedia
              id="HER-02"
              descricao="approach portrait"
              cor="#1E293B"
              className="col-span-2 rounded-lg sm:col-span-1 sm:row-span-2"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <PlaceholderMedia
              id="HER-03"
              descricao="approach thumb A"
              cor="#1E293B"
              className="rounded-lg"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            <PlaceholderMedia
              id="HER-04"
              descricao="approach thumb B"
              cor="#1E293B"
              className="rounded-lg"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            <PlaceholderMedia
              id="HER-05"
              descricao="approach thumb C"
              cor="#1E293B"
              className="col-span-2 rounded-lg sm:col-span-1"
              sizes="(max-width: 768px) 100vw, 20vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-gmt-bg-alt px-5 py-20 md:px-[5vw] md:py-[7vw]">
        <p className="type-label text-gmt-muted">Trabalho recente</p>
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
          <PortfolioCard placeholderId="PF-02a" nome="Projeto" cor="#1E293B" emBreve delay={0.1} />
          <PortfolioCard placeholderId="PF-02b" nome="Projeto" cor="#1E293B" emBreve delay={0.2} />
        </div>
      </section>

      <section className="section-cta px-5 py-24 text-center md:px-[5vw] md:py-[8vw]">
        <RevealText as="h2" className="type-h3 mx-auto max-w-2xl">
          Pronto para automatizar o seu negócio?
        </RevealText>
        <p className="type-body mt-4 text-gmt-muted">
          Reunião gratuita e sem compromisso.
        </p>
        <Link href="/contacto" className="btn-submit mt-8">
          Agendar agora
        </Link>
      </section>
    </>
  );
}
