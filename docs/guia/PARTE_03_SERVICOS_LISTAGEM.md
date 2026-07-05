# GUIA DE EDIÇÃO — PARTE 03 · SERVIÇOS · LISTAGEM (`/servicos`)

> Documentação da página de listagem de Serviços.
>
> **Arquivo principal:** `src/app/servicos/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/data/media-spec.ts`, `src/lib/media.ts`, `src/data/servicos.ts`.
>
> **Actualização:** Jul 2026 — strip hero + thumbs 3:2 no Accordion (AG/MKT/AV via `getServicoThumbId`); ver `docs/MAPA_APLICACAO_MIDIA.md`.

---

## Visão geral

A rota `/servicos` apresenta toda a oferta da GMT organizada em três categorias expansíveis (Accordion). É uma página de **descoberta e navegação** — cada item leva ao detalhe em `/servicos/[slug]`.

| Campo | Detalhe |
|---|---|
| Rota | `/servicos` |
| Arquivo | `src/app/servicos/page.tsx` |
| Componentes | `RevealOnScroll`, `RevealSequence`, `PlaceholderMedia`, `Accordion` |
| Dados | `agentes`, `pacotes`, `avulsos` (`src/data/servicos.ts`); `SERVICOS_HERO_THUMBS`, `getServicoThumbId` (`src/lib/media.ts`); `CATEGORIAS` + `toItems()` no próprio arquivo |
| Metadata | `title: "Serviços"`; description institucional |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

---

## Estrutura actual

Toda a página está dentro de `<div className="section-light">` (fundo claro). **Não existe** faixa `.section-cta` nem bloco de conversão antes do footer.

**Sequência final:**

1. **Cabeçalho + thumbnails** — label, h1, tagline e 3 thumbs (AG-01, MKT-02, AV-05)
2. **Automação & IA** — Accordion com 15 agentes
3. **Pacotes de Marketing** — Accordion com 3 pacotes
4. **Serviços Avulsos** — Accordion com 6 avulsos
5. **Footer global** — via `layout.tsx` (fora do `page.tsx`)

---

## Secções existentes

### Cabeçalho + thumbnails

- **Copy:** label `Os nossos serviços` · h1 `Serviços` · tagline institucional (`.type-h3`)
- **Layout:** split `md:flex-row` (rótulo/h1 `md:w-1/3`, tagline `md:w-2/3`); intro encadeada com `RevealSequence`
- **Thumbnails:** grid `sm:grid-cols-3` de `SERVICOS_HERO_THUMBS`; wrapper `aspect-[3/2]` + `PlaceholderMedia fill` (mesmo padrão do Accordion)
- **CTAs nesta secção:** nenhum (thumbs não são clicáveis)

| ID | Categoria representada | Proporção | Export | Arquivo | Status |
|---|---|---|---|---|---|
| AG-01 | Automação & IA | 3:2 | 1200×800 | `public/images/AG-01.webp` | **Produzido** |
| MKT-02 | Pacotes de Marketing | 3:2 | 1200×800 | `public/images/MKT-02.webp` | **Produzido** |
| AV-05 | Serviços Avulsos (IA) | 3:2 | 1200×800 | `public/images/AV-05.webp` | **Produzido** |

> Ordem no grid (esquerda → direita): AG-01 · MKT-02 · AV-05. Definida em `SERVICOS_HERO_THUMBS` (`src/lib/media.ts`). Ratio via spec (`PlaceholderMedia` sem `fill`).

### Categorias (Accordion) — 3 secções em loop

Geradas a partir de `CATEGORIAS`:

| Secção | Label | Descrição | Itens |
|---|---|---|---|
| Automação & IA | `Automação & IA` | 15 agentes inteligentes… | 15 agentes |
| Pacotes de Marketing | `Pacotes de Marketing` | 3 pacotes para iniciar… | 3 pacotes |
| Serviços Avulsos | `Serviços Avulsos` | 6 áreas de especialização… | 6 avulsos |

Cada item do Accordion expõe: **thumb 3:2** (`mediaId` = AG/MKT/AV), nome, headline, lista de `funcionalidades`, link `Ver serviço →` para `/servicos/{slug}`. Um item aberto de cada vez.

### Thumbs no Accordion (listagem activa)

| Grupo | IDs | Proporção | Função | Código |
|---|---|---|---|---|
| Agentes | AG-01…15 | 3:2 | 1 thumb por agente | `getServicoThumbId()` → `toItems()` → `Accordion.mediaId` |
| Pacotes | MKT-01…03 | 3:2 | 1 thumb por pacote | idem |
| Avulsos | AV-01…06 | 3:2 | 1 thumb por avulso | idem |

> Render: wrapper `aspect-[3/2] w-14 md:w-20` + `PlaceholderMedia` com `fill` — o wrapper fixa o ratio; a cor `corPlaceholder` só aparece se o asset falhar. Substitui o ponto colorido quando `mediaId` existe.

> **Strip vs. Accordion:** o strip hero (AG-01, MKT-02, AV-05) é **só decorativo por categoria**. Os restantes thumbs (AG-02…15, MKT-01/03, etc.) aparecem **só no Accordion**. Ver `docs/MAPA_APLICACAO_MIDIA.md`.

---

## Secção CTA removida

**Removida do código.** Não existe mais:

- Faixa `.section-cta` no final da página
- Copy `Não sabe por onde começar?` / `Agende uma reunião gratuita…`
- Botão `Agendar reunião` (`.btn-submit` → `/contacto`)
- Import `Link` associado a esse bloco

A conversão fica a cargo do **`FloatingCTA` global** (`layout.tsx`), não de um CTA inline nesta página.

---

## Observação final — fluxo actual

A página termina na **última categoria do Accordion** (Serviços Avulsos) e passa **directamente** para o **Footer global**, sem bloco intermediário de conversão. O fluxo visual ficou mais simples: cabeçalho → três accordions → footer.

---

## Apêndice — tokens usados (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `.section-light` | bg `#ffffff`, text `#0a0a0a`, muted `#575757` | wrapper de toda a página |
| `--gmt-accent` | `#2563eb` | link "Ver serviço →" |
| `--gmt-accent-2` | `#7c3aed` | hover do link |
| fallback thumbnail | `#1E293B` | cabeçalho (AG-01, MKT-02, AV-05) |
| Cores de família (ponto) | F1–F4, MKT, AV | fallback do thumb se imagem falhar |
| Thumb accordion | `w-14 md:w-20` | AG/MKT/AV por linha |

*Documento alinhado com `src/app/servicos/page.tsx`. Nenhuma informação foi inventada.*
