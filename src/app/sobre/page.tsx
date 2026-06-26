import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { RevealText } from "@/components/ui/RevealText";
import { RevealItem } from "@/components/ui/RevealItem";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Agência especialista em automações, inteligência artificial e marketing digital, dedicada a ajudar pequenas empresas a crescer no mundo digital.",
};

const COUNTERS = [
  { valor: "15", label: "agentes de IA prontos a trabalhar", largo: true },
  { valor: "24", label: "serviços disponíveis", largo: false },
  { valor: "70/30", label: "automação · marketing", largo: false },
];

const VALORES = [
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

export default function SobrePage() {
  return (
    <>
      <div className="section-light">
      <section className="flex flex-col gap-12 px-5 pt-28 md:flex-row md:gap-[5vw] md:px-[5vw] md:pt-[11vw]">
        <div className="md:w-1/2">
          <p className="type-label text-gmt-muted">Sobre a GMT</p>
          <RevealText as="h1" className="type-h2 mt-6 max-w-3xl">
            Agência especialista em automações, inteligência artificial e
            marketing digital, dedicada a ajudar pequenas empresas a crescer e a
            destacar-se no mundo digital.
          </RevealText>
          <RevealText as="p" className="type-body-lg mt-8 max-w-lg text-gmt-muted">
            Objetivo claro: gerar resultados reais. Cada negócio, por mais
            pequeno que seja, merece uma presença digital profissional e eficaz.
          </RevealText>
        </div>

        <div className="grid aspect-square w-full grid-cols-2 grid-rows-2 gap-2 md:w-2/5">
          {COUNTERS.map((c, i) => (
            <RevealItem key={c.label} delay={i * 0.08}>
              <div
                className={`flex flex-col justify-end rounded-[1vw] border border-gmt-border bg-gmt-bg-alt p-5 ${
                  c.largo ? "col-span-2" : ""
                }`}
              >
                <span className="font-mono text-5xl leading-none text-gmt-text md:text-[10vw]">
                  {c.valor}
                </span>
                <span className="type-label mt-3 text-gmt-muted">{c.label}</span>
              </div>
            </RevealItem>
          ))}
        </div>
      </section>

      <section className="mt-20 px-5 md:mt-[8vw] md:px-[5vw]">
        <PlaceholderMedia
          id="ABT-01"
          descricao="média institucional · 2:1"
          cor="#1E293B"
          className="rounded-lg md:rounded-[1vw]"
          sizes="(max-width: 768px) 100vw, 90vw"
        />
      </section>
      </div>

      <section className="mt-20 md:mt-[8vw]">
        <div className="relative">
          <PlaceholderMedia
            id="ABT-02"
            descricao="fullscreen manifesto · 16:9"
            cor="#1E293B"
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center px-5 text-center md:px-[5vw]">
            <RevealText as="p" className="type-h3 max-w-3xl italic">
              “O nosso compromisso é simples: ajudar o seu negócio a crescer
              online com soluções profissionais, eficazes e acessíveis.”
            </RevealText>
          </div>
        </div>
      </section>

      <section className="section-footer-zone bg-[#101010] py-20 md:py-[8vw]">
        <div className="flex flex-col gap-12 px-5 md:flex-row md:gap-[5vw] md:px-[5vw]">
          <div className="md:w-1/2">
            <RevealText as="h2" className="type-label text-gmt-muted">
              Porquê escolher-nos
            </RevealText>
          </div>
          <div className="flex flex-col gap-8 md:w-1/2 md:gap-[3vw]">
            {VALORES.map((v, i) => (
              <RevealItem key={v.titulo} delay={i * 0.05}>
                <div>
                  <h3 className="type-h3">{v.titulo}</h3>
                  <p className="type-body mt-2 text-white/40">{v.texto}</p>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="section-cta px-5 py-20 text-center md:px-[5vw] md:py-[8vw]">
        <RevealText as="h2" className="type-h3 mx-auto max-w-2xl">
          Pronto para começar?
        </RevealText>
        <p className="type-body mt-4 text-gmt-muted">
          Agende uma reunião gratuita e sem compromisso.
        </p>
        <Link href="/contacto" className="btn-submit mt-8">
          Agendar reunião
        </Link>
      </section>
    </>
  );
}
