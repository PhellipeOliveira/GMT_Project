/**
 * Especificação canónica de mídia — fonte de verdade do código.
 * Derivada de `docs/referencias/site_json/design_map_*_v2.json` + auditorias.
 * O ficheiro `docs/PLANO_MESTRE_DE_MIDIA.md` espelha este inventário para produção.
 */

export type MediaContainerMode = "aspect" | "full-bleed";

export interface MediaSlotSpec {
  id: string;
  ratio: readonly [number, number];
  exportPx: { w: number; h: number };
  container: MediaContainerMode;
  vh?: "80vh" | "70vh" | "60vh";
  objectFit: "cover";
  folder: "images" | "videos";
  page: string;
  slot: string;
  designRef: string;
  safeZone?: string;
}

export type MediaSlot = MediaSlotSpec & {
  ratioCss: string;
  ratioLabel: string;
};

function spec(entry: MediaSlotSpec): MediaSlot {
  const [w, h] = entry.ratio;
  return {
    ...entry,
    ratioCss: `${w}/${h}`,
    ratioLabel: `${w}:${h}`,
  };
}

const THUMB_3_2_BASE: Omit<MediaSlotSpec, "id" | "page" | "slot"> = {
  ratio: [3, 2],
  exportPx: { w: 1200, h: 800 },
  container: "aspect",
  objectFit: "cover",
  folder: "images",
  designRef: "design_map_services_geral_v2.json → 135×90 (3:2)",
};

function thumb(id: string, slot: string): MediaSlot {
  return spec({
    id,
    ...THUMB_3_2_BASE,
    page: "Serviços Geral",
    slot,
  });
}

function galeriaPf(id: string): MediaSlot {
  return spec({
    id,
    ratio: [4, 3],
    exportPx: { w: 1600, h: 1200 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Portfolio Item",
    slot: "Galeria — tela",
    designRef: "design_map_portfolio_item_v2.json",
  });
}

export const MEDIA_SLOTS: Record<string, MediaSlot> = {
  "HER-01": spec({
    id: "HER-01",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "full-bleed",
    vh: "80vh",
    objectFit: "cover",
    folder: "videos",
    page: "Home",
    slot: "Sec0 — hero slider",
    designRef: "design_map_home_v2.json → h-[80vh] object-cover",
    safeZone: "Centro 60% — viewport largo corta topo/base.",
  }),
  "HER-02": spec({
    id: "HER-02",
    ratio: [110, 225],
    exportPx: { w: 880, h: 1800 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec2 — approach portrait principal",
    designRef: "design_map_home_v2.json → 110×225px",
  }),
  "HER-03": spec({
    id: "HER-03",
    ratio: [4, 3],
    exportPx: { w: 1200, h: 900 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec2 — approach thumb A",
    designRef: "design_map_home_v2.json → 86×64.5px (4:3)",
  }),
  "HER-04": spec({
    id: "HER-04",
    ratio: [4, 3],
    exportPx: { w: 1200, h: 900 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec2 — approach thumb B",
    designRef: "design_map_home_v2.json → 86×64.5px (4:3)",
  }),
  "HER-05": spec({
    id: "HER-05",
    ratio: [4, 3],
    exportPx: { w: 1200, h: 900 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec2 — approach thumb C",
    designRef: "design_map_home_v2.json → 86×64.5px (4:3)",
  }),
  "ABT-01": spec({
    id: "ABT-01",
    ratio: [2, 1],
    exportPx: { w: 1920, h: 960 },
    container: "aspect",
    objectFit: "cover",
    folder: "videos",
    page: "Sobre",
    slot: "Sec1 — slot de mídia",
    designRef: "design_map_about_v2.json",
  }),
  "ABT-02": spec({
    id: "ABT-02",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "full-bleed",
    vh: "60vh",
    objectFit: "cover",
    folder: "videos",
    page: "Sobre",
    slot: "Sec2 — fullscreen manifesto",
    designRef: "design_map_about_v2.json",
    safeZone: "Centro 60%",
  }),
  "CON-01": spec({
    id: "CON-01",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "full-bleed",
    objectFit: "cover",
    folder: "images",
    page: "Contacto",
    slot: "Fundo decorativo",
    designRef: "design_map_contact_v2.json",
  }),
  "AGH-F1": spec({
    id: "AGH-F1",
    ratio: [3, 1],
    exportPx: { w: 2560, h: 860 },
    container: "full-bleed",
    vh: "70vh",
    objectFit: "cover",
    folder: "videos",
    page: "Serviço Item",
    slot: "Sec0 — hero família F1",
    designRef: "design_map_services_item_v2.json → md:h-[70vh]",
    safeZone: "Centro 55%",
  }),
  "AGH-F2": spec({
    id: "AGH-F2",
    ratio: [3, 1],
    exportPx: { w: 2560, h: 860 },
    container: "full-bleed",
    vh: "70vh",
    objectFit: "cover",
    folder: "videos",
    page: "Serviço Item",
    slot: "Sec0 — hero família F2",
    designRef: "design_map_services_item_v2.json",
    safeZone: "Centro 55%",
  }),
  "AGH-F3": spec({
    id: "AGH-F3",
    ratio: [3, 1],
    exportPx: { w: 2560, h: 860 },
    container: "full-bleed",
    vh: "70vh",
    objectFit: "cover",
    folder: "videos",
    page: "Serviço Item",
    slot: "Sec0 — hero família F3",
    designRef: "design_map_services_item_v2.json",
    safeZone: "Centro 55%",
  }),
  "AGH-F4": spec({
    id: "AGH-F4",
    ratio: [3, 1],
    exportPx: { w: 2560, h: 860 },
    container: "full-bleed",
    vh: "70vh",
    objectFit: "cover",
    folder: "videos",
    page: "Serviço Item",
    slot: "Sec0 — hero família F4",
    designRef: "design_map_services_item_v2.json",
    safeZone: "Centro 55%",
  }),
  "MKT-04": spec({
    id: "MKT-04",
    ratio: [3, 1],
    exportPx: { w: 2560, h: 860 },
    container: "full-bleed",
    vh: "70vh",
    objectFit: "cover",
    folder: "videos",
    page: "Serviço Item",
    slot: "Sec0 — hero pacotes marketing",
    designRef: "design_map_services_item_v2.json",
    safeZone: "Centro 55%",
  }),
  "AGP-F1": spec({
    id: "AGP-F1",
    ratio: [2, 3],
    exportPx: { w: 1200, h: 1800 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Serviço Item",
    slot: "Sec3 — fundo card processo",
    designRef: "design_map_services_item_v2.json → aspect-2/3",
  }),
  "AGP-F2": spec({
    id: "AGP-F2",
    ratio: [2, 3],
    exportPx: { w: 1200, h: 1800 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Serviço Item",
    slot: "Sec3 — fundo card processo",
    designRef: "design_map_services_item_v2.json → aspect-2/3",
  }),
  "AGP-F3": spec({
    id: "AGP-F3",
    ratio: [2, 3],
    exportPx: { w: 1200, h: 1800 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Serviço Item",
    slot: "Sec3 — fundo card processo",
    designRef: "design_map_services_item_v2.json → aspect-2/3",
  }),
  "AGP-F4": spec({
    id: "AGP-F4",
    ratio: [2, 3],
    exportPx: { w: 1200, h: 1800 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Serviço Item",
    slot: "Sec3 — fundo card processo",
    designRef: "design_map_services_item_v2.json → aspect-2/3",
  }),
  "PF-01": spec({
    id: "PF-01",
    ratio: [3, 4],
    exportPx: { w: 1200, h: 1600 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec3 — card showcase NARA",
    designRef: "design_map_home_v2.json → 320×432 (3:4)",
  }),
  "PF-02": spec({
    id: "PF-02",
    ratio: [9, 16],
    exportPx: { w: 1080, h: 1920 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Portfolio Geral",
    slot: "Grid hero + lista vertical",
    designRef: "design_map_portfolio_geral_v2.json → 135×240 (~9:16)",
  }),
  "PF-EB1": spec({
    id: "PF-EB1",
    ratio: [9, 16],
    exportPx: { w: 1080, h: 1920 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Portfolio Geral",
    slot: "Lacuna — grid hero",
    designRef: "Mesmo slot que PF-02 (9:16)",
  }),
  "PF-EB2": spec({
    id: "PF-EB2",
    ratio: [9, 16],
    exportPx: { w: 1080, h: 1920 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Portfolio Geral",
    slot: "Lacuna — grid hero",
    designRef: "Mesmo slot que PF-02 (9:16)",
  }),
  "PF-EB3": spec({
    id: "PF-EB3",
    ratio: [9, 16],
    exportPx: { w: 1080, h: 1920 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Portfolio Geral",
    slot: "Lacuna — grid hero",
    designRef: "Mesmo slot que PF-02 (9:16)",
  }),
  "PF-03": spec({
    id: "PF-03",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Portfolio Item",
    slot: "Galeria — capa",
    designRef: "design_map_portfolio_item_v2.json",
  }),
  "PF-04": galeriaPf("PF-04"),
  "PF-05": galeriaPf("PF-05"),
  "PF-06": galeriaPf("PF-06"),
  "PF-07": galeriaPf("PF-07"),
  "PF-08": galeriaPf("PF-08"),
  "PF-09": galeriaPf("PF-09"),
  "PF-10": galeriaPf("PF-10"),
  "PF-11": galeriaPf("PF-11"),
  "PF-12": galeriaPf("PF-12"),
  "GL-01": spec({
    id: "GL-01",
    ratio: [7, 2],
    exportPx: { w: 1400, h: 400 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Global",
    slot: "Navbar logo",
    designRef: "design_map_home_v2.json",
  }),
  "GL-02": spec({
    id: "GL-02",
    ratio: [1, 1],
    exportPx: { w: 512, h: 512 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Global",
    slot: "Favicon",
    designRef: "PLANO tabela 4.6",
  }),
  "GL-03": spec({
    id: "GL-03",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "full-bleed",
    objectFit: "cover",
    folder: "images",
    page: "Global",
    slot: "Textura footer",
    designRef: "PLANO tabela 4.6",
  }),
  "GL-04": spec({
    id: "GL-04",
    ratio: [1, 1],
    exportPx: { w: 400, h: 400 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Avatar testimonial (lacuna)",
    designRef: "design_map_home_v2.json",
  }),
  "AG-01": thumb("AG-01", "Thumb Reservas WhatsApp"),
  "AG-02": thumb("AG-02", "Thumb Voz Telefone"),
  "AG-03": thumb("AG-03", "Thumb Cardápio RAG"),
  "AG-04": thumb("AG-04", "Thumb Reputação Reviews"),
  "AG-05": thumb("AG-05", "Thumb Relatório Semanal"),
  "AG-06": thumb("AG-06", "Thumb Agendamento Universal"),
  "AG-07": thumb("AG-07", "Thumb Follow-up"),
  "AG-08": thumb("AG-08", "Thumb Triagem Documentos"),
  "AG-09": thumb("AG-09", "Thumb Cobrança Automática"),
  "AG-10": thumb("AG-10", "Thumb Criação Conteúdo"),
  "AG-11": thumb("AG-11", "Thumb Monitor Concorrência"),
  "AG-12": thumb("AG-12", "Thumb Relatório Performance"),
  "AG-13": thumb("AG-13", "Thumb Qualificação Leads"),
  "AG-14": thumb("AG-14", "Thumb Grafos Personalizados"),
  "AG-15": thumb("AG-15", "Thumb Onboarding"),
  "MKT-01": thumb("MKT-01", "Thumb Pacote Essencial"),
  "MKT-02": thumb("MKT-02", "Thumb Pacote Crescimento"),
  "MKT-03": thumb("MKT-03", "Thumb Pacote Premium"),
  "AV-01": thumb("AV-01", "Thumb Criação Conteúdo"),
  "AV-02": thumb("AV-02", "Thumb Publicidade Digital"),
  "AV-03": thumb("AV-03", "Thumb Branding"),
  "AV-04": thumb("AV-04", "Thumb Websites"),
  "AV-05": thumb("AV-05", "Thumb IA"),
  "AV-06": thumb("AV-06", "Thumb Analytics"),
};

export function getMediaSlot(id: string): MediaSlot | undefined {
  return MEDIA_SLOTS[id];
}

export function getMediaContainerStyle(id: string): {
  proporcao?: string;
  altura?: string;
} {
  const slot = getMediaSlot(id);
  if (!slot) return {};
  if (slot.container === "full-bleed" && slot.vh) {
    return { altura: slot.vh };
  }
  if (slot.container === "full-bleed") {
    return { altura: "100%" };
  }
  return { proporcao: slot.ratioCss };
}
