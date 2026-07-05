# MAPA DE APLICAÇÃO DE MÍDIA — GMT

> Onde cada ID do **Plano Mestre (PARTE 4)** é renderizado no código.  
> **Fonte de verdade do wiring:** `src/lib/media.ts` + páginas que consomem `PlaceholderMedia`.  
> **Actualização:** Jul 2026.

---

## Como ler este documento

| Coluna | Significado |
|---|---|
| **IDs** | Grupo de assets (ex.: AG-01…15) |
| **Proporção** | Export recomendado (`media-spec.ts`) |
| **Onde aparece** | Rota + secção visível no browser |
| **Função** | Papel visual / comunicação |
| **Código** | Ficheiro + função que resolve o ID |
| **Estado** | Produzido = ficheiro em `public/`; Activo = ligado no site |

---

## Resumo rápido — famílias de serviços

O site trata **três tipos** de serviço (`src/data/servicos.ts`). Cada tipo usa **conjuntos diferentes** de mídia:

| Tipo | Quantidade | Thumb listagem (3:2) | Hero detalhe (Sec0) | Fundo “Como funciona” (Sec3) |
|---|---:|---|---|---|
| **Agente** (`tipo: "agente"`) | 15 | **AG-01…15** (1 por slug) | **AGH-F1…4** (1 por família F1–F4) | **AGP-F1…4** (1 por família) |
| **Pacote** (`tipo: "pacote"`) | 3 | **MKT-01…03** | **MKT-04** (partilhado) | **AGP-F3** |
| **Avulso** (`tipo: "avulso"`) | 6 | **AV-01…06** | **AV-01…06** (thumb com crop em banner) | **AGP-F3** |

> **Dois “mundos” de thumb avulso:** na **Home** os cards “O que fazemos” usam **SERV-AV-01…06** (7:5). Na **listagem `/servicos`** e no **hero avulso** usam-se **AV-01…06** (3:2). São slots distintos no Plano Mestre.

---

## AG-01 … AG-15 — Thumbs dos 15 agentes

| Campo | Detalhe |
|---|---|
| **Proporção** | 3:2 · 1200×800 |
| **Ficheiros** | `public/images/AG-01.webp` … `AG-15.webp` |
| **Função** | Identificar visualmente cada agente na **listagem** de serviços |
| **Mapeamento** | `getServicoThumbId()` → `AGENTE_THUMB_BY_SLUG` em `src/lib/media.ts` |

### Onde aparecem

| Local | Comportamento |
|---|---|
| **`/servicos` — Accordion** (Sec. Automação & IA) | Thumb 3:2 à esquerda de **cada** linha (`Accordion` · prop `mediaId`) |
| **`/servicos` — strip hero** | Só **AG-01** (representante da categoria agentes) |
| **`/servicos/[slug]` hero** | **Não** — agentes usam banner **AGH-F*** no hero |

---

## AGH-F1 … AGH-F4 — Heroes por família (agentes)

| Campo | Detalhe |
|---|---|
| **Proporção** | 3:1 · 2560×860 |
| **Ficheiros** | `public/images/AGH-F1.webp` … `AGH-F4.webp` |
| **Função** | Banner full-bleed da **primeira secção** de cada página de **agente** |
| **Mapeamento** | `getServicoHeroId()` → família F1→AGH-F1, F2→AGH-F2, etc. |

### Onde aparecem

| Local | Comportamento |
|---|---|
| **`/servicos/reservas-whatsapp`** (F1) | Hero Sec0 → **AGH-F1** |
| **`/servicos/agendamento-universal`** (F2) | Hero Sec0 → **AGH-F2** |
| **`/servicos/criacao-conteudo`** (F3) | Hero Sec0 → **AGH-F3** |
| **`/servicos/grafos-personalizados`** (F4) | Hero Sec0 → **AGH-F4** |

> Container: `h-[80vh] md:h-[70vh]`, `fill` + `object-cover`. Compor assunto no **centro 55%** — o crop é severo face ao export 3:1.

---

## AGP-F1 … AGP-F4 — Fundos “Como funciona” (legado → activo)

| Campo | Detalhe |
|---|---|
| **Proporção** | 2:3 · 1200×1800 |
| **Ficheiros** | `public/images/AGP-F1.webp` … `AGP-F4.webp` |
| **Função original (Plano)** | Fundo dos antigos cards de **processo por família** (Sec3) |
| **Função actual** | Fundo dos **5 cards “Como funciona”** até existirem assets **CF-01…05** |
| **Mapeamento** | `getComoFuncionaCardId(familia, slotId)` → `getFamiliaProcessBg()` |

### O que são, na prática

Imagens **partilhadas por família visual**, não por agente individual. Todos os agentes F1 veem **AGP-F1** nos 5 cards; F2 veem **AGP-F2**; pacotes e avulsos usam **AGP-F3**.

| Família serviço | ID usado nos 5 cards Sec3 |
|---|---|
| F1 (Hospitalidade) | AGP-F1 |
| F2 (Operação) | AGP-F2 |
| F3 (Growth) | AGP-F3 |
| F4 (Inovação) | AGP-F4 |
| MKT / AV | AGP-F3 |

> **CF-01…05** (futuro): quando produzidos, substituem AGP-F* — um visual institucional **diferente por posição** (col 1–5), igual em todas as páginas. Até lá, **AGP-F*** preenche o slot.

---

## MKT-01 … MKT-03 — Thumbs dos pacotes

| Campo | Detalhe |
|---|---|
| **Proporção** | 3:2 · 1200×800 |
| **Mapeamento** | `getServicoThumbId()` → `PACOTE_THUMB_BY_SLUG` |

| Slug | ID |
|---|---|
| `pacote-essencial` | MKT-01 |
| `pacote-crescimento` | MKT-02 |
| `pacote-premium` | MKT-03 |

### Onde aparecem

| Local | IDs |
|---|---|
| **`/servicos` Accordion** (Pacotes) | MKT-01, MKT-02, MKT-03 — um por linha |
| **`/servicos` strip hero** | Só **MKT-02** (representante da categoria) |
| **`/servicos/[slug]` hero** | **MKT-04** (não MKT-01…03) |

---

## MKT-04 — Hero partilhado dos pacotes

| Campo | Detalhe |
|---|---|
| **Proporção** | 3:1 · 2560×860 |
| **Ficheiro** | `public/videos/MKT-04.webp` |
| **Função** | Banner Sec0 das 3 páginas de pacote |
| **Código** | `getServicoHeroId()` quando `tipo === "pacote"` |

---

## AV-01 … AV-06 — Thumbs avulsos (listagem + hero)

| Campo | Detalhe |
|---|---|
| **Proporção** | 3:2 · 1200×800 |
| **Mapeamento** | `getServicoThumbId()` + `getServicoHeroId()` (avulsos) |

### Onde aparecem

| Local | Comportamento |
|---|---|
| **`/servicos` Accordion** (Avulsos) | AV-01…06 — um por linha |
| **`/servicos` strip hero** | Só **AV-05** (representante IA) |
| **`/servicos/[slug]` hero** | O **mesmo** AV-0X do slug, crop em banner 70–80vh |

> **Não confundir** com **SERV-AV-01…06** (7:5) usados só na **Home** Sec2 “O que fazemos”.

---

## Strip hero `/servicos` — por que só 3 imagens?

O cabeçalho da listagem mostra **1 thumb por categoria**, não todos os serviços:

```ts
// src/lib/media.ts
export const SERVICOS_HERO_THUMBS = ["AG-01", "MKT-02", "AV-05"];
```

| Thumb | Representa |
|---|---|
| AG-01 | Automação & IA (15 agentes) |
| MKT-02 | Pacotes de Marketing (3 pacotes) |
| AV-05 | Serviços Avulsos (6 avulsos) |

Os restantes thumbs (AG-02…15, MKT-01/03, AV-01…04/06) aparecem no **Accordion** abaixo.

---

## Componentes órfãos (não activos)

| Componente | IDs que suportaria | Estado |
|---|---|---|
| `ServiceCard.tsx` | AG/MKT/AV thumbs | **Órfão** — substituído pelo Accordion com `mediaId` |

---

## Checklist de verificação no browser

1. **`/servicos`** — strip: AG-01, MKT-02, AV-05 · accordion: 24 linhas com thumb 3:2  
2. **`/servicos/reservas-whatsapp`** — hero AGH-F1 · Sec3 cinco cards com AGP-F1  
3. **`/servicos/pacote-essencial`** — hero MKT-04 · accordion/listagem MKT-01  
4. **`/servicos/inteligencia-artificial`** — hero AV-05 · Sec3 AGP-F3  
5. **`/` Home Sec2** — SERV-AV-* (7:5), **não** AV-*

---

*Cruzado com `docs/PLANO_MESTRE_DE_MIDIA.md`, `docs/guia/PARTE_03_SERVICOS_LISTAGEM.md`, `docs/guia/PARTE_04_SERVICO_DETALHE.md`.*
