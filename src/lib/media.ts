import type { Familia, Servico } from "@/data/servicos";
import { MEDIA_SLOTS } from "@/data/media-spec";

/** Slots em `public/videos/` (WebP por agora; MP4/WebM no futuro). */
export const VIDEO_SLOT_IDS = new Set(
  Object.values(MEDIA_SLOTS)
    .filter((s) => s.folder === "videos")
    .map((s) => s.id),
);

export const MEDIA_ASSET_IDS = new Set(Object.keys(MEDIA_SLOTS));

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

export const SERVICOS_HERO_THUMBS = ["AG-01", "MKT-02", "AV-05"] as const;

export function hasMediaAsset(id: string): boolean {
  return MEDIA_ASSET_IDS.has(id);
}

export function getMediaSrc(id: string): string {
  const slot = MEDIA_SLOTS[id];
  const folder = slot?.folder ?? (VIDEO_SLOT_IDS.has(id) ? "videos" : "images");
  return `/${folder}/${id}.webp`;
}

export function getVideoSrc(id: string): string {
  const slot = MEDIA_SLOTS[id];
  const folder = slot?.folder ?? (VIDEO_SLOT_IDS.has(id) ? "videos" : "images");
  return `/${folder}/${id}.mp4`;
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
