# Auditoria de mídia — PLANO vs layout real

**Fontes cruzadas:** `docs/PLANO_MESTRE_DE_MIDIA.md`, `src/data/media-spec.ts`, componentes que renderizam mídia.

**Componente central:** `PlaceholderMedia` — com `fill` ignora o ratio da spec e preenche o pai; sem `fill`, aplica `aspect-ratio` da spec via `getMediaContainerStyle()`.

**Última actualização:** Jul 2026 — frame expansivo (`ExpandingFrame`) documentado como comportamento intencional.

---

## Como o projeto define tamanho visual

| Modo | Quem manda | Comportamento |
|---|---|---|
| **`fill={true}`** | **Container pai** | `absolute inset-0` + `object-cover` → asset cortado, sem distorção |
| **`fill={false}`** | **Spec (`media-spec.ts`)** | `aspect-ratio` no wrapper → moldura = ratio do asset |
| **Full-bleed + `vh`** | **Container em `vh`** | Hero de serviço: ratio visível ≠ ratio de export |
| **`ExpandingFrame`** | **Frame pai 16:9** | `aspect-video`; largura 35%→75%; assets 16:9 com `fill` |

---

## Padrão correcto no projeto

**Ambos precisam estar alinhados**, mas com três regimes distintos:

1. **Cards / thumbs / galeria** → **container = ratio do asset** (`aspect-[X/Y]` ou spec via `PlaceholderMedia` sem `fill`). Exportar no px da spec.
2. **Heroes full-bleed** → **container define a moldura** (`aspect-video`, `80vh`); asset exportado no ratio da spec + **safe zone central**; esperar **crop** com `object-cover`.
3. **Frame expansivo (`ExpandingFrame`)** → frame pai **e** assets em **16:9 · 2560×1440**; largura animada **35% → 75%**; depois scroll continua; **35%** = largura inicial do container pai.

---

## Frame expansivo — regras explícitas (Home + Sobre)

> Componente: `src/components/ui/ExpandingFrame.tsx`

| Aspecto | Comportamento documentado |
|---|---|
| **Conjuntos** | Home: **HER-02…07** (6 slides) · Sobre: **ABT-01…05** (5 slides) |
| **Unidade** | Cada conjunto = **um único** `ExpandingFrame`; slides não são imagens independentes |
| **35%** | Largura inicial do **frame pai** (`motion.div`), **não** dimensão do asset |
| **75%** | Largura máxima do frame pai; depois o scroll **continua** pela secção |
| **16:9** | Frame pai (`aspect-video`) **e** assets do mesmo grupo — alinhados |
| **Expansão** | Scroll: largura **35% → 75%**, ratio **16:9** constante |
| **Assets** | Produzir todos do mesmo grupo em **16:9 · 2560×1440** |
| **Render** | `PlaceholderMedia` + `fill` + `object-cover` dentro do frame 16:9 |
| **Ratio visível** | **16:9** em todo o percurso (frame pai = asset) |
| **Foco de produção** | Consistência 16:9 entre slides + comportamento do bloco pai |

**Trecho do frame pai (código):**

```50:55:src/components/ui/ExpandingFrame.tsx
  const frameWidth = useTransform(
    scrollYProgress,
    [SCALE_START, 1],
    [FRAME_WIDTH_START, FRAME_WIDTH_END],
  );
```

Frame pai: `className="relative aspect-video overflow-hidden"` — **16:9** constante.

---

## Tabela 4.1 — Hero e institucionais

| Slot (PLANO) | Componente | Ratio esperado (asset) | Ratio real do container | Status | Notas |
|---|---|---|---|---|---|
| **HER-01** · Home Sec0 | `HeroSlider` (órfão) | 16:9 · 2560×1440 | **N/A** — hero activa sem imagem (`100dvh` preto) | **Órfão** | Só `HeroSlider`; `HeroSection` não usa HER-01 |
| **HER-02…07** · Home Sec4 | `ExpandingFrame` | **16:9 · 2560×1440** (conjunto) | **16:9** (35%→75% largura) | **OK** | 6 slides; HER-06 e HER-07 adicionados Jul 2026 |
| **ABT-01…05** · Sobre Sec2 | `ExpandingFrame` | **16:9 · 2560×1440** (conjunto) | **16:9** (35%→75% largura) | **OK** | Mesma lógica que a Home |
| **CON-01** · Contacto | — | 16:9 · 2560×1440 | **Não renderizado** | **Não implementado** | Opcional / inactivo |

---

## Tabela 4.2-A — Thumbs agentes (AG-01..15)

| Slot | Componente | Ratio esperado | Ratio real | Status | Correção |
|---|---|---|---|---|---|
| **AG-01..15** · listagem | `servicos/page.tsx` Accordion | 3:2 · 1200×800 | **3:2** (`getServicoThumbId`) | **OK** | Jul 2026 |
| **AG-01** · strip hero `/servicos` | `servicos/page.tsx` | 3:2 | **3:2** (spec, sem `fill`) | **OK** | — |
| **AG-01..15** · hero Sec0 | `getServicoHeroId()` → thumb | 3:2 asset · banner vh | **OK** | Jul 2026 — padrão AV-05 |
| **AGH-F1..4** · hero | — | — | — | **Removido** | Substituído por thumbs AG-01…15 |
| **AGP-F1..4** · Sec3 Como funciona | `getComoFuncionaCardId()` | 2:3 · 1200×1800 | **2:3** (`aspect-[3/4] md:aspect-[2/3]`) | **OK** | Jul 2026 — até CF-* |

---

## Tabela 4.2-B — Hero Sec0 + processos (AGP-F*)

| Slot | Componente | Ratio esperado | Ratio real | Status | Correção |
|---|---|---|---|---|---|
| **AG-01..15** · hero agente | `getServicoHeroId()` → thumb | 3:2 asset · banner vh | **OK** | Jul 2026 |
| **MKT-01..03** · hero pacote | idem | 3:2 · banner vh | **OK** | Jul 2026 |
| **AV-01..06** · hero avulso | idem | 3:2 · banner vh | **OK** | Padrão AV-05 |
| ~~**AGH-F1..4**~~ | — | 3:1 | — | **Removido** | Thumbs AG por slug |
| ~~**MKT-04**~~ | — | 3:1 | — | **Removido** | MKT-01…03 por slug |
| **AGP-F1..4** · Sec3 | `getComoFuncionaCardId()` | 2:3 | **2:3** em card | **OK** | Activo até CF-* |

**Trecho hero serviço:**

```51:52:src/app/(site)/servicos/[slug]/page.tsx
      <section
        className="not-prose relative h-[80vh] w-full overflow-hidden md:h-[70vh]"
```

---

## Tabela 4.2-C — CF-01..05 (Como funciona)

| Slot | Componente | Ratio esperado | Ratio real | Status | Correção |
|---|---|---|---|---|---|
| **CF-01..05** | `servicos/[slug]/page.tsx` Sec3 | 2:3 · 1200×1800 | **3:4** mobile · **2:3** md+ | **Conflito mobile** | Uniformizar: `aspect-[2/3]` em todos os breakpoints **ou** actualizar PLANO/spec para 3:4 mobile |

```188:188:src/app/(site)/servicos/[slug]/page.tsx
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gmt-border md:aspect-[2/3]">
```

---

## Tabela 4.3 — Marketing (MKT)

| Slot | Componente | Ratio esperado | Ratio real | Status | Correção |
|---|---|---|---|---|---|
| **MKT-01..03** · listagem + hero | Accordion + `getServicoHeroId` | 3:2 | **3:2** / crop banner vh | **OK** | Jul 2026 |
| **MKT-02** · strip `/servicos` | `servicos/page.tsx` | 3:2 | **3:2** | **OK** | — |
| ~~**MKT-04**~~ · hero | — | 3:1 | — | **Removido** | MKT-01…03 por slug |

---

## Tabela 4.4 — Avulsos (AV) + 4.4-B SERV-AV

| Slot | Componente | Ratio esperado | Ratio real | Status | Correção |
|---|---|---|---|---|---|
| **AV-01..06** · listagem | `servicos/page.tsx` Accordion | 3:2 | **3:2** | **OK** | Jul 2026 |
| **AV-05** · strip `/servicos` | `servicos/page.tsx` | 3:2 | **3:2** | **OK** | — |
| **SERV-AV-01..06** · Home | `ServiceOverlayCard` | 7:5 · 1400×1000 | **7:5** (`aspect-[7/5]`) | **OK** | Produzir assets; PLANO correcto |

```14:14:src/components/home/ServiceOverlayCard.tsx
      className="group relative block aspect-[7/5] overflow-hidden rounded-2xl"
```

---

## Tabela 4.4-C — Frame expansivo

| Slot | Comportamento PLANO | Código | Status |
|---|---|---|---|
| HER-02…07 | Conjunto ExpandingFrame Home Sec4 · 16:9 · 6 slides | `ExpandingFrame` + `aspect-video` | **OK** |
| ABT-01…05 | Conjunto ExpandingFrame Sobre Sec2 · 16:9 | `ExpandingFrame` + `aspect-video` | **OK** |

---

## Tabela 4.5 — Portfolio

| Slot | Componente | Ratio esperado | Ratio real | Status | Correção |
|---|---|---|---|---|---|
| **PF-01** · Home NARA | `HomePortfolioRow` | 3:4 · 1200×1600 | **3:4** (spec, sem `fill`) | **OK** | — |
| **PF-02** · hero Sec.01 | `portfolio/page.tsx` | 9:16 · 1080×1920 | **9:16** (spec); **1 case:** `col-span-2 row-span-2` → largura total coluna direita; **2+ cases:** 1 célula em `md:grid-cols-4` | **OK** | — |
| **PF-02** · lista Sec.02 | `portfolio/page.tsx` | 9:16 · 1080×1920 | **9:16** (spec); `w-20 md:w-28` | **OK** | — |
| **PF-03** · capa case | `portfolio/[slug]/page.tsx` | 16:9 | **16:9** (spec) | **OK** | — |
| **PF-04..12** · galeria | Idem | 4:3 | **4:3** (spec) | **OK** | — |
| **PF-SLOT-H** · Home “em breve” | — | 3:4 | **Não renderizado** | **Lacuna intencional** | Home só mostra NARA |
| **PF-SLOT-G** · grid vazio | — | 9:16 | **Não renderizado** | **Lacuna intencional** | — |
| **PF-SLOT-N** · next project | — | 9:16 | **Não renderizado** | **Não implementado** | — |

---

## Tabela 4.6 — Globais

| Slot | Componente | Ratio esperado | Ratio real | Status | Correção |
|---|---|---|---|---|---|
| **GL-01** · logo | `GmtLogo` (texto “GMT”) | 7:2 · 1400×400 | **Tipografia**, não imagem | **Asset não usado** | Usar `GL-01.webp` **ou** retirar do inventário activo |
| **GL-02** · favicon | `src/app/icon.svg` | SVG 16×16 | **1:1** | **OK** | App Router; `GL-02.webp` não usado |
| **GL-03** · textura footer | `Footer.tsx` | 16:9 · 2560×1440 | **Altura do footer** (não 16:9), `absolute inset-0` + crop | **Conflito decorativo** | Aceitável para textura; compor padrão repetível / centro |
| **GL-04** · avatar testimonial | — | 1:1 | Secção removida | **N/A** | — |
| **GL-05** · ícones | `lucide-react` | vetor | vetor | **OK** | — |

---

## Divergências doc ↔ código (transversais)

| Tema | PLANO / spec | Código real |
|---|---|---|
| HER-01 slot | Asset órfão · hero activa `100dvh` preto + Preloader | `HeroSection` sem `PlaceholderMedia` |
| HER-02…07 | Conjunto ExpandingFrame Home Sec4 · 16:9 · 35%→75% | `ExpandingFrame` |
| ABT-01…05 | Conjunto ExpandingFrame Sobre Sec2 · 16:9 · 35%→75% | `ExpandingFrame` |
| Thumbs listagem + hero | AG/MKT/AV 3:2 | `Accordion` + `getServicoHeroId` | **24+3 activos** |
| ~~AGH-F*, MKT-04~~ | Hero 3:1 partilhado | — | **Removidos Jul 2026** |
| CON-01 | Fundo contacto | Não implementado |
| CF cards | 2:3 uniforme | 3:4 mobile + 2:3 desktop |

---

## Resumo executivo

| Categoria | Slots | OK | Conflito intencional (crop) | Conflito real | Não activo |
|---|---|---|---|---|---|
| Home hero + cards | HER-01, SERV-AV-* | 7 | 0 | 0 | 0 |
| Frame expansivo | HER-02…07, ABT-* | 11 | 11 | 0 | 0 |
| Serviços listagem + hero | AG/MKT/AV thumbs 3:2 | 27 (strip+accordion+hero) | **OK** | 0 | 0 |
| ~~Serviço hero partilhado~~ | ~~AGH-F*, MKT-04~~ | 5 | — | — | **5 removidos** |
| Serviço item CF | CF-01..05 | 0 (desktop) | 0 | **5 (mobile 3:4)** | 0 |
| Portfolio | PF-01..12 | 10 | 0 | 0 | 3 slots |
| Globais | GL-* | 2 | 1 (GL-03) | 1 (GL-01) | 1 (GL-04) |
| Contacto | CON-01 | 0 | 0 | 0 | 1 |

---

## Prioridades de correcção

1. **Alta — CF mobile:** `aspect-[2/3]` em todos os breakpoints **ou** actualizar PLANO para 3:4 mobile.
2. **Média — CF mobile:** `aspect-[2/3]` em todos os breakpoints **ou** actualizar PLANO para 3:4 mobile.
3. ~~**Média — heroes avulsos:**~~ **Resolvido Jul 2026** — todos os serviços usam thumb 3:2 no hero.
3. **Baixa — CON-01, GL-01, PF-SLOT-*:** implementar ou marcar inactivos no PLANO.

---

## Regra prática para produção

```
Card / thumb / galeria     → exportar no ratio + px da spec; container usa aspect-ratio
Hero full-bleed            → exportar no ratio da spec; compor safe zone; esperar crop
ExpandingFrame (fill)      → asset 16:9 + frame pai aspect-video 16:9; largura 35%→75%; scroll continua depois
fill={true}                → ratio visível = ratio do PAI, não do asset
```
