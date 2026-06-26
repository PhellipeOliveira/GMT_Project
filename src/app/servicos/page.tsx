import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { RevealText } from "@/components/ui/RevealText";
import { agentes, pacotes, avulsos, type Servico } from "@/data/servicos";
import { SERVICOS_HERO_THUMBS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Automação e IA, pacotes de marketing e serviços avulsos. Conheça em detalhe toda a oferta da GMT para fazer o seu negócio crescer.",
};

function toItems(lista: Servico[]): AccordionItem[] {
  return lista.map((s) => ({
    id: s.slug,
    titulo: s.nome,
    subtitulo: s.headline || undefined,
    href: `/servicos/${s.slug}`,
    itens: s.funcionalidades,
    cor: s.corPlaceholder,
  }));
}

const CATEGORIAS = [
  {
    id: "automacao-ia",
    label: "Automação & IA",
    descricao: "15 agentes inteligentes que trabalham pelo seu negócio, 24h por dia.",
    items: toItems(agentes),
  },
  {
    id: "pacotes-marketing",
    label: "Pacotes de Marketing",
    descricao: "3 pacotes para iniciar, crescer ou dominar a sua presença digital.",
    items: toItems(pacotes),
  },
  {
    id: "servicos-avulsos",
    label: "Serviços Avulsos",
    descricao: "6 áreas de especialização para necessidades pontuais.",
    items: toItems(avulsos),
  },
];

export default function ServicosPage() {
  return (
    <>
      <div className="section-light">
        <section className="flex flex-col px-5 pt-28 md:px-[5vw] md:pt-[11vw]">
          <div className="flex flex-col gap-6 md:flex-row md:gap-[5vw]">
            <div className="md:w-1/3">
              <p className="type-label text-gmt-muted">Os nossos serviços</p>
              <RevealText as="h1" className="type-h2 mt-4">
                Serviços
              </RevealText>
            </div>
            <div className="md:w-2/3">
              <RevealText as="p" className="type-h3 max-w-3xl">
                Agência especialista em automações, inteligência artificial e
                marketing digital para pequenas empresas — tudo num só parceiro.
              </RevealText>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-[5vw]">
            {SERVICOS_HERO_THUMBS.map((id) => (
              <PlaceholderMedia
                key={id}
                id={id}
                descricao="thumbnail · 3:2"
                cor="#1E293B"
                className="rounded-lg md:rounded-[1vw]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ))}
          </div>
        </section>

        {CATEGORIAS.map((cat) => (
          <section
            key={cat.id}
            className="mt-10 px-5 md:mt-[8vw] md:px-[5vw]"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-[1vw]">
              <RevealText as="h2" className="type-category">
                {cat.label}
              </RevealText>
              <p className="type-body max-w-md text-gmt-muted">{cat.descricao}</p>
            </div>
            <div className="mt-6">
              <Accordion items={cat.items} />
            </div>
          </section>
        ))}
      </div>

      <section className="section-cta mt-20 px-5 py-20 text-center md:mt-[8vw] md:px-[5vw] md:py-[8vw]">
        <RevealText as="h2" className="type-h3 mx-auto max-w-2xl">
          Não sabe por onde começar?
        </RevealText>
        <p className="type-body mt-4 text-gmt-muted">
          Agende uma reunião gratuita e desenhamos o plano certo para si.
        </p>
        <Link href="/contacto" className="btn-submit mt-8">
          Agendar reunião
        </Link>
      </section>
    </>
  );
}
