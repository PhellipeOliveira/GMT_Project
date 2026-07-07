# GUIA DE EDIÇÃO — PARTE 05 · PORTFOLIO · LISTAGEM (`/portfolio`)

> Documentação completa da página de listagem de Portfolio para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/(site)/portfolio/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts`, `src/data/portfolio.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** Jul 2026 — apenas case NARA; cabeçalho intro + lista vertical (sem grid hero); CTA final removido.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/portfolio` |
| Arquivo | `src/app/(site)/portfolio/page.tsx` |
| Componentes | `RevealOnScroll`, `RevealSequence`, `SectionLabel`, `PlaceholderMedia` |
| Dados | `portfolio` (`src/data/portfolio.ts`) — **1 case real (NARA)** |
| Metadata | `title: "Portfolio"`; `description` sobre o case NARA |
| Globais (via `(site)/layout.tsx`) | `Navbar`, `GMTLightFooter`, `Footer`, `ChatWidgetLoader`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Cabeçalho (intro)
2. Seção 02 — Lista de projetos

> A página **não** usa o wrapper `.section-light`; as duas secções ficam sobre o fundo padrão (`--gmt-bg` = `#ffffff`). **Sem grid hero de thumbnails** na Sec. 01 — thumbs `PF-02` aparecem apenas na lista (Sec. 02). **Sem CTA final** — conversão global via `ChatWidgetLoader`.

**Removido do template (não documentar como activo):**

- Array `EM_BREVE` e linhas/slots "Em breve" (`PF-EB1…3`) na Sec. 01 e 02
- Secção 03 — CTA `"Quer ser o nosso próximo case?"` + botão `"Agendar reunião"`

> IDs `PF-EB1…3` permanecem em `media-spec.ts` para produção futura; **não são renderizados** até existirem cases reais em `portfolio.ts`.

---

# Seção 01 — Cabeçalho (intro)

### 1. Objetivo
Apresentar o título da página + tagline sobre o NARA. **Sem mídia** nesta secção.

### 2. Copy / Textos

| Campo | Label | `<h1>` | `<p>` tagline |
|---|---|---|---|
| Conteúdo | `Trabalho recente` | `Portfolio` | tagline institucional sobre o NARA |
| Elemento HTML | `h2` | `h1` | `p` |
| Classe | `.type-section-title` | `.type-h2` | `.type-body-lg` |
| Família | Host Grotesk | Host Grotesk | DM Sans |
| Tamanho | `clamp(30px,4vw,46px)` | `clamp(42px,6vw,72px)` | 21px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `#0a0a0a` | `#0a0a0a` | `#575757` (`text-gmt-muted`) |

Label via `SectionLabel variant="title"`. Intro encadeada via `RevealSequence`.

### 3. Imagens / mídia
Nenhuma nesta secção.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, h1, tagline | `RevealOnScroll` + `RevealSequence` | on-scroll | bloco único encadeado, `2.0s` |

### 6. Responsividade
- **Desktop:** `pt-[11vw]`, `px-[5vw]`.
- **Mobile:** `pt-28`, `px-5`.

### 7. Arquivos relacionados
`src/app/(site)/portfolio/page.tsx`, `src/components/ui/SectionLabel.tsx`, `src/components/ui/RevealOnScroll.tsx`.

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
Thumb por linha. Frame 9:16 explícito: `h-[calc(5rem*16/9)] w-20` / `md:h-[calc(7rem*16/9)] md:w-28` + `PlaceholderMedia fill`, `rounded-md`, `reveal={false}`.

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
`src/app/(site)/portfolio/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`, classes `.type-h3`/`.tag-pill` em `src/styles/globals.css`.

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
