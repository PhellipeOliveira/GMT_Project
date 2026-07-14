export interface GaleriaItem {
  id: string;
  proporcao: string;
  legenda?: string;
}

export interface CaseStudy {
  slug: string;
  nome: string;
  local: string;
  industria: string;
  servicos: string;
  tags: string[];
  resumo: string;
  corPlaceholder: string;
  galeria: GaleriaItem[];
}

export const COR_PORTFOLIO = "#134E4A";

export const portfolio: CaseStudy[] = [
  {
    slug: "nara",
    nome: "NARA",
    local: "Portugal · Internacional",
    industria: "Tecnologia",
    servicos: "Website + IA",
    tags: ["Branding", "Website", "Chatbots", "Campanhas"],
    resumo:
      "Criamos integralmente o NARA — plataforma tecnológica que atende profissionais em vários países. Do branding e website a chatbots inteligentes e campanhas publicitárias.",
    corPlaceholder: COR_PORTFOLIO,
    galeria: [
      { id: "PF-03", proporcao: "16/9", legenda: "capa do case" },
      { id: "PF-04", proporcao: "16/9", legenda: "tela 1" },
      { id: "PF-05", proporcao: "16/9", legenda: "tela 2" },
      { id: "PF-06", proporcao: "16/9", legenda: "tela 3" },
      { id: "PF-07", proporcao: "16/9", legenda: "tela 4" },
    ],
  },
];

export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return portfolio.find((c) => c.slug === slug);
}
