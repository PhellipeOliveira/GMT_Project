# GUIA DE EDIÇÃO — PARTE 05 · PORTFOLIO · LISTAGEM (`/portfolio`)

> Documentação completa da página de listagem de Portfolio para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/portfolio/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts`, `src/data/portfolio.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/portfolio` |
| Arquivo | `src/app/portfolio/page.tsx` |
| Componentes | `RevealOnScroll`, `PlaceholderMedia` |
| Dados | `portfolio` (`src/data/portfolio.ts`); array `EM_BREVE = ["PF-EB1","PF-EB2","PF-EB3"]` no próprio arquivo |
| Metadata | `title: "Portfolio"`; `description` sobre o case NARA |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Cabeçalho + grid de thumbnails
2. Seção 02 — Lista de projetos
3. Seção 03 — CTA final

> A página **não** usa o wrapper `.section-light`; as Seções 01 e 02 ficam sobre o fundo padrão (`--gmt-bg` = `#ffffff`). Atualmente o array `portfolio` contém **1 case real (NARA)** + slots "em breve".

---

# Seção 01 — Cabeçalho + grid de thumbnails

### 1. Objetivo
Apresentar o título da página + tagline sobre o NARA (esquerda) e um grid de thumbnails verticais (direita), incluindo slots "em breve".

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

### 3. Imagens / mídia
Thumbnails verticais. Para cada case real renderiza-se `PF-02` (id fixo no código); os 3 slots vazios usam os ids `EM_BREVE`. Render `rounded-lg`, `reveal={false}`; slots "em breve" com `opacity-50`. Cruzado com PLANO Tabela 4.5 (PF-02 + PF-SLOT-G).

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| PF-02 | Grid hero — thumb do case (NARA) | 9:16 | 1080×1920 | `public/images/PF-02.webp` | **Produzido** |
| PF-EB1 | Grid — slot vazio 1 | 9:16 | 1080×1920 | (não existe) | **Lacuna** (intencional) |
| PF-EB2 | Grid — slot vazio 2 | 9:16 | 1080×1920 | (não existe) | **Lacuna** (intencional) |
| PF-EB3 | Grid — slot vazio 3 | 9:16 | 1080×1920 | (não existe) | **Lacuna** (intencional) |

> Cor de fallback: case real `c.corPlaceholder` = `#134E4A` (NARA); slots "em breve" `#1E293B`. `PF-EB1..3` existem em `media-spec.ts` com `slot: "Lacuna — grid hero"`.

### 4. Botões / CTAs
Nenhum (thumbnails desta seção não são clicáveis).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, h1, tagline | Framer Motion (`RevealOnScroll`) | on-scroll | `2.1s`, ease `[0.22,1,0.36,1]`; tagline `delay 0.08` |
| Cada thumbnail (real + "em breve") | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger crescente (`delay = i*0.08`, "em breve" continuam o índice: `(portfolio.length + i) * 0.08`) |
| Imagem (quando há asset) | CSS (`.media-zoom`) | on-hover | `scale(1.03)`, 400ms |

### 6. Responsividade
- **Desktop:** cabeçalho `flex-row` (cada bloco `md:w-1/2`); grid de thumbs `md:grid-cols-4`; `pt-[11vw]`, `px-[5vw]`, `gap-[5vw]`.
- **Tablet:** grid de thumbs `grid-cols-2`.
- **Mobile:** `flex-col`; grid `grid-cols-2`; `pt-28`, `px-5`, `gap-10`.

### 7. Arquivos relacionados
`src/app/portfolio/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`, `src/data/media-spec.ts`.

---

# Seção 02 — Lista de projetos

### 1. Objetivo
Lista vertical numerada dos projetos (case real como link + slots "em breve" não-clicáveis).

### 2. Copy / Textos

| Campo | Índice | `<h3>` projeto | `<p>` local | Tag | Seta |
|---|---|---|---|---|---|
| Conteúdo | `01`, `02`… (`String(i+1).padStart(2,"0")`) | `c.nome` (ex.: `NARA`) / `Em breve` | `c.local` (ex.: `Portugal · Internacional`) / `Novo case em produção` | `c.tags[]` (`Branding`, `Website`, `Chatbots`, `Campanhas`) | `→` |
| Elemento HTML | `span` | `h3` | `p` | `span` | `span` |
| Classe | `font-mono` + `.type-body` | `.type-h3` | `.type-body` | `.tag-pill` | inline |
| Família | Mono sistema (`--font-mono`) | Host Grotesk | DM Sans | DM Sans | DM Sans |
| Tamanho | 18px | 36px | 18px | `clamp(13px,0.9vw,15px)` | 18px (herdado) |
| Peso | 400 | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a`; hover `#2563eb` (`group-hover:text-gmt-accent`) | `#575757` (`text-gmt-muted`) | `#000` (definido em `.tag-pill`) | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | — | — | — | normal (`.tag-pill` reseta) | — |
| `text-transform` | none | none | none | none | none |

> Linhas "em breve" (3, do array `EM_BREVE`) usam `opacity-50` e o `h3` `Em breve` não tem hover de cor.

### 3. Imagens / mídia
Thumb por linha. Render `w-20 md:w-28`, `rounded-md`, `reveal={false}`. Cruzado com PLANO Tabela 4.5.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| PF-02 | Thumb da linha (case real) | 9:16 | 1080×1920 | `public/images/PF-02.webp` | **Produzido** |
| PF-EB1 / PF-EB2 / PF-EB3 | Thumb das linhas "em breve" | 9:16 | 1080×1920 | (não existe) | **Lacuna** (intencional) |

> Cor de fallback: case real `#134E4A`; "em breve" `#1E293B`.

### 4. Botões / CTAs
- **Linha de case real** = `Link` para `/portfolio/{slug}` (grupo `group`), sem fundo. Hover: título → `--gmt-accent` (`#2563eb`); seta `→` com `translate-x-1`.
- **Linhas "em breve"** = `<div>` não-clicável (`opacity-50`).
- **Tags** = `.tag-pill` (fundo `rgb(255 255 255 / 0.8)`, texto `#000`, `border-radius 0.5vw`, `backdrop-blur 8px`), não-clicáveis.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cada linha (real + "em breve") | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger (`delay = i*0.08` e continuação para "em breve") |
| Título da linha | CSS | on-hover (group) | cor → `--gmt-accent`, 300ms |
| Seta `→` | CSS | on-hover (group) | `translate-x-1` |

### 6. Responsividade
- **Desktop:** linhas `py-[8vw]`, `gap-[2vw]`; thumb `md:w-28`; `mt-[8vw]`, `px-[5vw]`.
- **Tablet/Mobile:** linhas reais `py-16`, "em breve" `py-8`; thumb `w-20`; `mt-20`, `px-5`, `gap-5`.

### 7. Arquivos relacionados
`src/app/portfolio/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`, classes `.type-h3`/`.tag-pill` em `src/styles/globals.css`.

---

# Seção 03 — CTA final

### 1. Objetivo
Conversão (faixa preta `.section-cta`, centrada).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Quer ser o nosso próximo case?` | `Agende uma reunião gratuita e sem compromisso.` |
| Elemento HTML | `h2` | `p` |
| Classe | `.type-h3` | `.type-body` |
| Família | Host Grotesk | DM Sans |
| Tamanho | 36px | 18px |
| Peso | 400 | 400 |
| Cor da fonte | `#ffffff` (em `.section-cta`, regra `:where(.type-h3) → var(--gmt-text)` = `#ffffff`) | `#94a3b8` (`text-gmt-muted` redefinido na `.section-cta`) |
| `letter-spacing` | — | — |
| `text-transform` | none | none |

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
"Agendar reunião" — classe `.btn-submit` (link para `/contacto`).
- Fundo `rgb(255 255 255 / 0.7)` · Texto `#000` · `border-radius 9999px` · `padding 0.75rem 2rem` · DM Sans 18px peso 500.
- Hover: `bg rgb(255 255 255 / 0.85)` + `scale(1.02)`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| h2, p e botão | Framer Motion (`RevealOnScroll`) | on-scroll | stagger (`delay 0.08`/`0.16`) |

### 6. Responsividade
- **Todos:** centrado, h2 `max-w-2xl`.
- **Desktop:** `mt-[8vw] px-[5vw] py-[8vw]`. **Mobile:** `mt-20 px-5 py-20`.

### 7. Arquivos relacionados
`src/app/portfolio/page.tsx`, classes `.btn-submit` e `.section-cta` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados na Listagem de Portfolio (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `--gmt-bg` | `#ffffff` | fundo das Seções 01–02 |
| `--gmt-text` | `#0a0a0a` | h1, h3 dos projetos |
| `--gmt-text-muted` | `#575757` | label, tagline, local, índice, seta |
| `--gmt-accent` | `#2563eb` | hover do título da linha |
| `--gmt-border` | `#dcdcdc` | linhas da lista (`border-t`/`border-b border-gmt-border`) |
| `.tag-pill` | fundo `rgb(255 255 255 / 0.8)`, texto `#000` | tags da Seção 02 |
| `COR_PORTFOLIO` | `#134E4A` | fallback do thumb NARA (PF-02) |
| fallback "em breve" | `#1E293B` | thumbs/linhas PF-EB1..3 |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seção 03 |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por esta página — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*
