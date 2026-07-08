import type { Servico } from "@/data/servicos";
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
  "cardapio-inteligente": "AG-03",
  "reputacao-reviews": "AG-04",
  "relatorio-semanal": "AG-05",
  "agendamento-universal": "AG-06",
  "follow-up-clientes": "AG-07",
  "cobranca-automatica": "AG-09",
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

const AVULSO_HOME_CARD_BY_SLUG: Record<string, string> = {
  "criacao-conteudo-avulso": "SERV-AV-01",
  "publicidade-digital": "SERV-AV-02",
  "branding-estrategia": "SERV-AV-03",
  websites: "SERV-AV-04",
  "inteligencia-artificial": "SERV-AV-05",
  "analytics-otimizacao": "SERV-AV-06",
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

export function getServicoHomeCardId(servico: Servico): string {
  return AVULSO_HOME_CARD_BY_SLUG[servico.slug] ?? "SERV-AV-01";
}

/** Hero Sec0 — thumb 3:2 do serviço (AG/MKT/AV) com crop no banner; ver `getServicoThumbId`. */
export function getServicoHeroId(servico: Servico): string {
  return getServicoThumbId(servico);
}

