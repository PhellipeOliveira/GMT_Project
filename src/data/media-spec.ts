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
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec0 — hero background",
    designRef: "HeroSection → h-[45vw]; inner aspect-video 16:9 (80% altura full-bleed)",
    safeZone: "Centro 60%",
  }),
  "HER-02": spec({
    id: "HER-02",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec4 — ExpandingFrame slide 1 (conjunto HER-02…07)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60% — moldura animada corta bordas.",
  }),
  "HER-03": spec({
    id: "HER-03",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec4 — ExpandingFrame slide 2 (conjunto HER-02…07)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60%",
  }),
  "HER-04": spec({
    id: "HER-04",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec4 — ExpandingFrame slide 3 (conjunto HER-02…07)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60%",
  }),
  "HER-05": spec({
    id: "HER-05",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec4 — ExpandingFrame slide 4 (conjunto HER-02…07)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60%",
  }),
  "HER-06": spec({
    id: "HER-06",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec4 — ExpandingFrame slide 5 (conjunto HER-02…07)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60%",
  }),
  "HER-07": spec({
    id: "HER-07",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec4 — ExpandingFrame slide 6 (conjunto HER-02…07)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60%",
  }),
  "ABT-01": spec({
    id: "ABT-01",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Sobre",
    slot: "Sec2 — ExpandingFrame slide 1 (conjunto ABT-01…05)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60% — moldura animada corta bordas.",
  }),
  "ABT-02": spec({
    id: "ABT-02",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Sobre",
    slot: "Sec2 — ExpandingFrame slide 2 (conjunto ABT-01…05)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60%",
  }),
  "ABT-03": spec({
    id: "ABT-03",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Sobre",
    slot: "Sec2 — ExpandingFrame slide 3 (conjunto ABT-01…05)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60%",
  }),
  "ABT-04": spec({
    id: "ABT-04",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Sobre",
    slot: "Sec2 — ExpandingFrame slide 4 (conjunto ABT-01…05)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60%",
  }),
  "ABT-05": spec({
    id: "ABT-05",
    ratio: [16, 9],
    exportPx: { w: 2560, h: 1440 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Sobre",
    slot: "Sec2 — ExpandingFrame slide 5 (conjunto ABT-01…05)",
    designRef: "ExpandingFrame → aspect-video 16:9; frame pai 35%→90%",
    safeZone: "Centro 55–60%",
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
    folder: "images",
    page: "Serviço Item",
    slot: "RETIRADO Jul 2026 — substituído por thumb AG por slug",
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
    folder: "images",
    page: "Serviço Item",
    slot: "RETIRADO Jul 2026 — substituído por thumb AG por slug",
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
    folder: "images",
    page: "Serviço Item",
    slot: "RETIRADO Jul 2026 — substituído por thumb AG por slug",
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
    folder: "images",
    page: "Serviço Item",
    slot: "RETIRADO Jul 2026 — substituído por thumb AG por slug",
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
    slot: "RETIRADO Jul 2026 — substituído por MKT-01…03 por slug",
    designRef: "design_map_services_item_v2.json",
    safeZone: "Centro 55%",
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
  "AG-03": thumb("AG-03", "Thumb Cardápio RAG"),
  "AG-04": thumb("AG-04", "Thumb Reputação Reviews"),
  "AG-05": thumb("AG-05", "Thumb Relatório Semanal"),
  "AG-06": thumb("AG-06", "Thumb Agendamento Universal"),
  "AG-07": thumb("AG-07", "Thumb Follow-up"),
  "AG-09": thumb("AG-09", "Thumb Cobrança Automática"),
  "AG-13": thumb("AG-13", "Thumb Qualificação Leads"),
  "AG-14": thumb("AG-14", "Thumb Grafos Personalizados"),
  "MKT-01": thumb("MKT-01", "Thumb Pacote Essencial"),
  "MKT-02": thumb("MKT-02", "Thumb Pacote Crescimento"),
  "MKT-03": thumb("MKT-03", "Thumb Pacote Premium"),
  "AV-01": thumb("AV-01", "Thumb Criação Conteúdo"),
  "AV-02": thumb("AV-02", "Thumb Publicidade Digital"),
  "AV-03": thumb("AV-03", "Thumb Branding"),
  "AV-04": thumb("AV-04", "Thumb Websites"),
  "AV-05": thumb("AV-05", "Thumb IA"),
  "AV-06": thumb("AV-06", "Thumb Analytics"),

  // ── Home — Sec1: Cards de Serviços (O que fazemos) ──────────────────
  "SERV-AV-01": spec({
    id: "SERV-AV-01",
    ratio: [7, 5],
    exportPx: { w: 1400, h: 1000 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec1 — Card Criação de Conteúdo",
    designRef: "Home Sec1 Services Grid 7:5",
  }),
  "SERV-AV-02": spec({
    id: "SERV-AV-02",
    ratio: [7, 5],
    exportPx: { w: 1400, h: 1000 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec1 — Card Publicidade Digital",
    designRef: "Home Sec1 Services Grid 7:5",
  }),
  "SERV-AV-03": spec({
    id: "SERV-AV-03",
    ratio: [7, 5],
    exportPx: { w: 1400, h: 1000 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec1 — Card Branding & Estratégia",
    designRef: "Home Sec1 Services Grid 7:5",
  }),
  "SERV-AV-04": spec({
    id: "SERV-AV-04",
    ratio: [7, 5],
    exportPx: { w: 1400, h: 1000 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec1 — Card Websites",
    designRef: "Home Sec1 Services Grid 7:5",
  }),
  "SERV-AV-05": spec({
    id: "SERV-AV-05",
    ratio: [7, 5],
    exportPx: { w: 1400, h: 1000 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec1 — Card Inteligência Artificial",
    designRef: "Home Sec1 Services Grid 7:5",
  }),
  "SERV-AV-06": spec({
    id: "SERV-AV-06",
    ratio: [7, 5],
    exportPx: { w: 1400, h: 1000 },
    container: "aspect",
    objectFit: "cover",
    folder: "images",
    page: "Home",
    slot: "Sec1 — Card Analytics & Otimização",
    designRef: "Home Sec1 Services Grid 7:5",
  }),
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
