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

| Tipo | Quantidade | Thumb listagem (3:2) | Hero Sec0 (`/servicos/[slug]`) |
|---|---:|---|---|
| **Agente** (`tipo: "agente"`) | 15 | **AG-01…15** (1 por slug) | **AG-01…15** (mesmo thumb, crop no banner) |
| **Pacote** (`tipo: "pacote"`) | 3 | **MKT-01…03** | **MKT-01…03** (mesmo thumb) |
| **Avulso** (`tipo: "avulso"`) | 6 | **AV-01…06** | **AV-01…06** (mesmo thumb) |

> **Como funciona (Jul 2026):** timeline animada sem mídia — ver `ComoFuncionaTimeline.tsx`. IDs **AGP-F*** e **CF-*** retirados.

> **Hero Sec0 (Jul 2026):** todos os serviços usam o **thumb 3:2** via `getServicoHeroId()` → `getServicoThumbId()`. Container `h-[80vh] md:h-[70vh]`, `object-cover`, gradiente `from-black via-black/40 to-black/10`, título branco centrado. Safe zone: **centro 55%**.

---

## IDs retirados — não produzir / podem apagar do disco

| ID | Motivo | Substituído por |
|---|---|---|
| **AGH-F1** | Hero partilhado por família F1 | **AG-01…05** (thumb de cada agente F1) |
| **AGH-F2** | Hero partilhado por família F2 | **AG-06…09** |
| **AGH-F3** | Hero partilhado por família F3 | **AG-13** |
| **AGH-F4** | Hero partilhado por família F4 | **AG-14…15** |
| **MKT-04** | Hero partilhado dos pacotes | **MKT-01**, **MKT-02**, **MKT-03** |

> Ficheiros históricos (se existirem): `public/images/AGH-F1.webp`…`AGH-F4.webp`, `public/videos/MKT-04.webp`. **Não referenciados** em `src/lib/media.ts` nem em nenhuma página. Entrada em `media-spec.ts` mantida só como registo — candidatos a remoção futura do repo.

> **Dois “mundos” de thumb avulso:** na **Home** os cards “O que fazemos” usam **SERV-AV-01…06** (7:5). Na **listagem `/servicos`** e no **hero avulso** usam-se **AV-01…06** (3:2). São slots distintos no Plano Mestre.

---

## AG-01 … AG-15 — Thumbs dos 10 agentes

| Campo | Detalhe |
|---|---|
| **Proporção** | 3:2 · 1200×800 |
| **Ficheiros** | `public/images/AG-01.webp` … `AG-15.webp` *(AG-02, AG-08, AG-10, AG-11 e AG-12 retirados)* |
| **Função** | Identificar visualmente cada agente na **listagem** de serviços |
| **Mapeamento** | `getServicoThumbId()` → `AGENTE_THUMB_BY_SLUG` em `src/lib/media.ts` |

### Onde aparecem

| Local | Comportamento |
|---|---|
| **`/servicos` — Accordion** (Sec. Automação & IA) | Thumb 3:2 à esquerda de **cada** linha — wrapper `aspect-[3/2]` + `fill` (evita crop incorrecto em flex) |
| **`/servicos` — strip hero** | Só **AG-01** (representante da categoria agentes) |
| **`/servicos/[slug]` hero** | **Sim** — thumb AG/MKT/AV do slug (ex. AV-05 em IA) |

---

## ~~AGH-F1 … AGH-F4~~ — Retirados (Jul 2026)

| Campo | Detalhe |
|---|---|
| **Estado** | **Removidos do site** — não produzir, não manter em produção activa |
| **Substituição** | Thumb **AG-01…15** no hero Sec0 de cada agente |
| **Ficheiros antigos** | `public/images/AGH-F*.webp` — podem ser apagados |

---

## ~~AGP-F1 … AGP-F4~~ — Retirados (Jul 2026)

| Campo | Detalhe |
|---|---|
| **Estado** | **Removidos do site** — secção «Como funciona» passou a timeline sem mídia |
| **Substituição** | `ComoFuncionaTimeline` (linha + círculos + texto) |
| **Ficheiros antigos** | `public/images/AGP-F1.webp` … `AGP-F4.webp` — podem ser apagados |

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
| **`/servicos/[slug]` hero** | **MKT-01**, **MKT-02** ou **MKT-03** conforme slug |

---

## ~~MKT-04~~ — Retirado (Jul 2026)

| Campo | Detalhe |
|---|---|
| **Estado** | **Removido do site** — não produzir |
| **Substituição** | **MKT-01**, **MKT-02**, **MKT-03** no hero Sec0 de cada pacote |
| **Ficheiro antigo** | `public/videos/MKT-04.webp` — pode ser apagado |

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
| **`/servicos/[slug]` hero** | **AV-01…06** — thumb do slug (crop banner + gradiente) |

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
| AG-01 | Automação & IA (10 agentes) |
| MKT-02 | Pacotes de Marketing (3 pacotes) |
| AV-05 | Serviços Avulsos (6 avulsos) |

Os restantes thumbs (AG-03…15, MKT-01/03, AV-01…04/06) aparecem no **Accordion** abaixo.

---

## Componentes órfãos (não activos)

| Componente | IDs que suportaria | Estado |
|---|---|---|
| `ServiceCard.tsx` | AG/MKT/AV thumbs | **Órfão** — substituído pelo Accordion com `mediaId` |

---

## Checklist de verificação no browser

1. **`/servicos`** — strip: AG-01, MKT-02, AV-05 · accordion: 24 linhas com thumb 3:2  
2. **`/servicos/reservas-whatsapp`** — hero **AG-01** · timeline «Como funciona» (sem mídia)  
3. **`/servicos/pacote-essencial`** — hero **MKT-01** · timeline «Como funciona»  
4. **`/servicos/inteligencia-artificial`** — hero **AV-05** · timeline «Como funciona»  
5. **`/` Home Sec2** — SERV-AV-* (7:5), **não** AV-*

---

## Thumbs pequenos em flex (Accordion) — nota técnica

Thumbs 3:2 dentro de **linhas flex** (ex.: Accordion `/servicos`) não devem usar só `aspect-ratio` inline + largura fixa no mesmo elemento que é filho flex — o browser pode **ignorar o ratio** e esticar o container à altura da linha (texto + `py-5`).

**Sintoma:** faixa sólida `corPlaceholder` no topo (~60%), imagem só na base.

**Causa:** `PlaceholderMedia` aplica `backgroundColor: cor` no frame pai; se o frame fica mais alto que 3:2, a cor preenche o excesso antes do `Image fill` cobrir tudo.

**Padrão correcto (Accordion — 24 thumbs):**

```tsx
const LISTING_THUMB_FRAME =
  "relative w-14 aspect-[3/2] shrink-0 flex-none self-center overflow-hidden rounded-md md:w-20";

<div className={LISTING_THUMB_FRAME}>
  <PlaceholderMedia id="AG-01" fill ... />  {/* absolute inset-0 */}
</div>
```

Altura **explícita** derivada de `w-14`/`w-20` (3:2) — `aspect-ratio` sozinho falha dentro de flex. `PlaceholderMedia fill` = `absolute inset-0` (requisito do Next.js `Image fill`).

Em **grid** (strip hero): `relative aspect-[3/2] w-full` + `fill`.

---
