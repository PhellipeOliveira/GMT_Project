import type { Familia, Servico } from "@/data/servicos";

/** Slots do plano que vivem em `public/videos/` (WebP por agora, MP4/WebM depois). */
export const VIDEO_SLOT_IDS = new Set([
  "HER-01",
  "ABT-01",
  "ABT-02",
  "AGH-F1",
  "AGH-F2",
  "AGH-F3",
  "AGH-F4",
  "MKT-04",
]);

/** Inventário de assets disponíveis nas pastas `public/images` e `public/videos`. */
export const MEDIA_ASSET_IDS = new Set([
  "HER-01",
  "HER-02",
  "HER-03",
  "HER-04",
  "HER-05",
  "ABT-01",
  "ABT-02",
  "AG-01",
  "AG-02",
  "AG-03",
  "AG-04",
  "AG-05",
  "AG-06",
  "AG-07",
  "AG-08",
  "AG-09",
  "AG-10",
  "AG-11",
  "AG-12",
  "AG-13",
  "AG-14",
  "AG-15",
  "AGH-F1",
  "AGH-F2",
  "AGH-F3",
  "AGH-F4",
  "AGP-F1",
  "AGP-F2",
  "AGP-F3",
  "AGP-F4",
  "MKT-01",
  "MKT-02",
  "MKT-03",
  "MKT-04",
  "AV-01",
  "AV-02",
  "AV-03",
  "AV-04",
  "AV-05",
  "AV-06",
  "PF-01",
  "PF-02",
  "PF-03",
  "PF-04",
  "PF-05",
  "PF-06",
  "PF-07",
  "PF-08",
  "PF-09",
  "PF-10",
  "PF-11",
  "PF-12",
  "CON-01",
  "GL-01",
  "GL-02",
  "GL-03",
  "GL-04",
]);

const AGENTE_THUMB_BY_SLUG: Record<string, string> = {
  "reservas-whatsapp": "AG-01",
  "voz-telefone": "AG-02",
  "cardapio-inteligente": "AG-03",
  "reputacao-reviews": "AG-04",
  "relatorio-semanal": "AG-05",
  "agendamento-universal": "AG-06",
  "follow-up-clientes": "AG-07",
  "triagem-documentos": "AG-08",
  "cobranca-automatica": "AG-09",
  "criacao-conteudo": "AG-10",
  "monitor-concorrencia": "AG-11",
  "relatorio-performance": "AG-12",
  "qualificacao-leads": "AG-13",
  "grafos-personalizados": "AG-14",
  "onboarding-clientes": "AG-15",
};

const PACOTE_THUMB_BY_SLUG: Record<string, string> = {
  "pacote-essencial": "MKT-01",
  "pacote-crescimento": "MKT-02",
  "pacote-premium": "MKT-03",
};

const AVULSO_THUMB_BY_SLUG: Record<string, string> = {
  "criacao-conteudo-avulso": "AV-01",
  "publicidade-digital": "AV-02",
  "branding-estrategia": "AV-03",
  websites: "AV-04",
  "inteligencia-artificial": "AV-05",
  "analytics-otimizacao": "AV-06",
};

const FAMILIA_HERO: Record<Exclude<Familia, "MKT" | "AV">, string> = {
  F1: "AGH-F1",
  F2: "AGH-F2",
  F3: "AGH-F3",
  F4: "AGH-F4",
};

const FAMILIA_PROCESS_BG: Partial<Record<Familia, string>> = {
  F1: "AGP-F1",
  F2: "AGP-F2",
  F3: "AGP-F3",
  F4: "AGP-F4",
  MKT: "AGP-F3",
  AV: "AGP-F3",
};

/** Thumbnails do hero da listagem de serviços (3 áreas). */
export const SERVICOS_HERO_THUMBS = ["AG-01", "MKT-02", "AV-05"] as const;

export function hasMediaAsset(id: string): boolean {
  return MEDIA_ASSET_IDS.has(id);
}

export function getMediaSrc(id: string): string {
  const folder = VIDEO_SLOT_IDS.has(id) ? "videos" : "images";
  return `/${folder}/${id}.webp`;
}

export function getServicoThumbId(servico: Servico): string {
  if (servico.tipo === "agente") return AGENTE_THUMB_BY_SLUG[servico.slug] ?? "AG-01";
  if (servico.tipo === "pacote") return PACOTE_THUMB_BY_SLUG[servico.slug] ?? "MKT-01";
  return AVULSO_THUMB_BY_SLUG[servico.slug] ?? "AV-01";
}

export function getServicoHeroId(servico: Servico): string {
  if (servico.tipo === "agente") {
    return FAMILIA_HERO[servico.familia as keyof typeof FAMILIA_HERO];
  }
  if (servico.tipo === "pacote") return "MKT-04";
  return getServicoThumbId(servico);
}

export function getFamiliaProcessBg(familia: Familia): string | undefined {
  return FAMILIA_PROCESS_BG[familia];
}
