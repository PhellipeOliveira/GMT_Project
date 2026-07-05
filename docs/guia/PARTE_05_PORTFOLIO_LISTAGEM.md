# GUIA DE EDIÇÃO — PARTE 05 · PORTFOLIO · LISTAGEM (`/portfolio`)

> Documentação completa da página de listagem de Portfolio para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/portfolio/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts`, `src/data/portfolio.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026 · **Actualização:** Jul 2026 — apenas case NARA; hero thumb em modo single-case (2×2 / largura total da coluna direita); slots "em breve" e CTA final removidos do template activo.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/portfolio` |
| Arquivo | `src/app/portfolio/page.tsx` |
| Componentes | `RevealOnScroll`, `RevealSequence`, `PlaceholderMedia` |
| Dados | `portfolio` (`src/data/portfolio.ts`) — **1 case real (NARA)** |
| Metadata | `title: "Portfolio"`; `description` sobre o case NARA |
| Globais (via `layout.tsx`) | `Navbar`, `GMTLightFooter`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Cabeçalho + grid de thumbnails
2. Seção 02 — Lista de projetos

> A página **não** usa o wrapper `.section-light`; as duas secções ficam sobre o fundo padrão (`--gmt-bg` = `#ffffff`). **Sem CTA final** — conversão global via `FloatingCTA` do layout. A página termina na lista de projetos; em seguida vêm `GMTLightFooter` + Footer Navigation.

**Removido do template (não documentar como activo):**

- Array `EM_BREVE` e linhas/slots "Em breve" (`PF-EB1…3`) na Sec. 01 e 02
- Secção 03 — CTA `"Quer ser o nosso próximo case?"` + botão `"Agendar reunião"`

> IDs `PF-EB1…3` permanecem em `media-spec.ts` para produção futura; **não são renderizados** até existirem cases reais em `portfolio.ts`.

---

# Seção 01 — Cabeçalho + grid de thumbnails

### 1. Objetivo
Apresentar o título da página + tagline sobre o NARA (esquerda) e thumbnail(s) do(s) case(s) em `portfolio` (direita).

### 2. Copy / Textos

| Campo | Label | `<h1>` | `<p>` tagline |
|---|---|---|---|
| Conteúdo | `Trabalho recente` | `Portfolio` | `Criámos integralmente o NARA — uma plataforma tecnológica que atende profissionais em vários países. Do branding e website a chatbots inteligentes e campanhas publicitárias, todo o ecossistema digital foi desenvolvido pela agência.` |
| Elemento HTML | `p` | `h1` | `p` |
| Classe | `.type-label` | `.type-h2` | `.type-body-lg` |
| Família | DM Sans | Host Grotesk | DM Sans |
| Tamanho | 14px | `clamp(42px,6vw,72px)` | 21px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — | — |
| `text-transform` | uppercase | none | none |

Intro encadeada via `RevealSequence`.

### 3. Imagens / mídia
Uma thumbnail por entrada em `portfolio` (actualmente só NARA). Id fixo `PF-02` no código. Render `rounded-lg`, `reveal={false}`. Cruzado com PLANO Tabela 4.5.

| ID | Slot | Proporção | Export | Arquivo actual | Status |
|---|---|---|---|---|---|
| PF-02 | Grid hero — thumb do case (NARA) | **9:16** | 1080×1920 | `public/images/PF-02.webp` | **Produzido** |

> Cor de fallback NARA: `c.corPlaceholder` = `#134E4A`.

**Layout do grid hero (Sec. 01, coluna direita):**

| Casos em `portfolio` | Grelha | Thumb | Largura efectiva (desktop) |
|---|---|---|---|
| **1** (actual) | `grid-cols-2` | `col-span-2 row-span-2` | **100% da coluna direita** (`md:w-1/2` ≈ 45vw) |
| **2+** | `grid-cols-2 md:grid-cols-4` | 1 célula por case | ~¼ da coluna direita por thumb (~12vw) |

> **Proporção do asset:** inalterada — **9:16** (1080×1920). Só muda o **tamanho do frame** no browser; o export e a spec (`media-spec.ts`) mantêm-se.

> **Modo single-case:** activado quando `portfolio.length === 1`. O thumb ocupa a grelha 2×2 inteira (= largura total da coluna direita). Ao adicionar novos cases em `portfolio.ts`, o layout regressa automaticamente ao mosaico 4 colunas.

### 4. Botões / CTAs
Nenhum (thumbnails desta secção não são clicáveis).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, h1, tagline | Framer Motion (`RevealOnScroll` + `RevealSequence`) | on-scroll | encadeamento sequencial |
| Cada thumbnail | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i * 0.08` |
| Imagem (quando há asset) | CSS (`.media-zoom`) | on-hover | `scale(1.03)`, 400ms |

### 6. Responsividade
- **Desktop:** cabeçalho `flex-row` (cada bloco `md:w-1/2`); `pt-[11vw]`, `px-[5vw]`, `gap-[5vw]`.
  - **1 case:** grelha `grid-cols-2`; thumb `col-span-2 row-span-2` → largura total da coluna direita; `sizes` ≈ `45vw`.
  - **2+ cases:** grelha `md:grid-cols-4`; 1 célula por thumb; `sizes` ≈ `12vw`.
- **Tablet:** igual ao desktop para o grid hero.
- **Mobile:** `flex-col`; grelha `grid-cols-2`; com 1 case o thumb faz `col-span-2` (largura total); `pt-28`, `px-5`, `gap-10`.

### 7. Arquivos relacionados
`src/app/portfolio/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`, `src/data/media-spec.ts`.

---

# Seção 02 — Lista de projetos

### 1. Objetivo
Lista vertical numerada dos projetos publicados — actualmente **apenas NARA** como `Link` clicável.

### 2. Copy / Textos

| Campo | Índice | `<h3>` projeto | `<p>` local | Tag | Seta |
|---|---|---|---|---|---|
| Conteúdo | `01` (`String(i+1).padStart(2,"0")`) | `c.nome` (`NARA`) | `c.local` (`Portugal · Internacional`) | `c.tags[]` | `→` |
| Elemento HTML | `span` | `h3` | `p` | `span` | `span` |
| Classe | `font-mono` + `.type-body` | `.type-h3` | `.type-body` | `.tag-pill` | inline |
| Família | Mono sistema (`--font-mono`) | Host Grotesk | DM Sans | DM Sans | DM Sans |
| Tamanho | 18px | 36px | 18px | `clamp(13px,0.9vw,15px)` | 18px (herdado) |
| Peso | 400 | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a`; hover `#2563eb` (`group-hover:text-gmt-accent`) | `#575757` (`text-gmt-muted`) | `#000` (`.tag-pill`) | `#575757` (`text-gmt-muted`) |

Tags NARA: `Branding`, `Website`, `Chatbots`, `Campanhas`.

### 3. Imagens / mídia
Thumb por linha. Render `w-20 md:w-28`, `rounded-md`, `reveal={false}`.

| ID | Slot | Proporção | Export | Arquivo actual | Status |
|---|---|---|---|---|---|
| PF-02 | Thumb da linha (NARA) | 9:16 | 1080×1920 | `public/images/PF-02.webp` | **Produzido** |

> Cor de fallback: `#134E4A`.

### 4. Botões / CTAs
- **Linha NARA** = `Link` para `/portfolio/nara` (grupo `group`). Hover: título → `--gmt-accent`; seta `→` com `translate-x-1`.
- **Tags** = `.tag-pill`, não-clicáveis.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Linha NARA | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | `delay = i * 0.08` |
| Título da linha | CSS | on-hover (group) | cor → `--gmt-accent`, 300ms |
| Seta `→` | CSS | on-hover (group) | `translate-x-1` |

### 6. Responsividade
- **Desktop:** linha `py-[8vw]`, `gap-[2vw]`; thumb `md:w-28`; secção `mt-[8vw]`, `px-[5vw]`.
- **Tablet/Mobile:** linha `py-16`; thumb `w-20`; `mt-20`, `px-5`, `gap-5`.

### 7. Arquivos relacionados
`src/app/portfolio/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`, classes `.type-h3`/`.tag-pill` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados na Listagem de Portfolio (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `--gmt-bg` | `#ffffff` | fundo das Secções 01–02 |
| `--gmt-text` | `#0a0a0a` | h1, h3 dos projetos |
| `--gmt-text-muted` | `#575757` | label, tagline, local, índice, seta |
| `--gmt-accent` | `#2563eb` | hover do título da linha |
| `--gmt-border` | `#dcdcdc` | linhas da lista (`border-t`/`border-b border-gmt-border`) |
| `.tag-pill` | fundo `rgb(255 255 255 / 0.8)`, texto `#000` | tags da Sec. 02 |
| `COR_PORTFOLIO` | `#134E4A` | fallback do thumb NARA (PF-02) |

> `src/styles/tokens.css` existe mas define tokens legados **não usados** por esta página — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório. Nenhuma informação foi inventada.*
