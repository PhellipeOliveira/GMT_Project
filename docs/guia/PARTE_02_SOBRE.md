# GUIA DE EDIÇÃO — PARTE 02 · SOBRE (`/sobre`)

> Documentação completa da página Sobre para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/(site)/sobre/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/data/media-spec.ts`, `src/data/diferenciais.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** Jul 2026 (frame expansivo 35%→75%; manifesto + valores num bloco `.section-cta`).

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/sobre` |
| Arquivo | `src/app/(site)/sobre/page.tsx` |
| Componentes | `RevealOnScroll`, `RevealSequence`, `ExpandingFrame`, `AboutCounterGrid`, ícones `lucide-react` |
| Dados | `ABOUT_SLIDESHOW` em `page.tsx`; contadores em `AboutCounterGrid.tsx`; `DIFERENCIAIS` + `ICONES_DIFERENCIAIS` em `src/data/diferenciais.ts` |
| Metadata | `title: "Sobre"`; `description` institucional |
| Globais (via `(site)/layout.tsx`) | `Navbar`, `Footer`, `ChatWidgetLoader`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Introdução + Contadores
2. Seção 02 — Slideshow expansivo no scroll (branco → preto)
3. Seção 03 — Manifesto + Valores (bloco preto contínuo, `.section-cta`)

> **Removido:** Seção CTA final ("Pronto para começar?"); secção separada "Nossos valores" com `SectionLabel`. Conversão via `ChatWidgetLoader` global.
>
> Apenas a **Seção 01** está dentro de `<div className="section-light">`. As Seções 02–03 ficam fora desse wrapper.

---

## Animações globais (aplicáveis à Sobre)

O sistema de entrada global vive em `src/components/ui/RevealOnScroll.tsx`:

| Constante | Valor | Uso |
|---|---|---|
| `REVEAL_DURATION` | `2.0s` | Duração de cada bloco |
| `REVEAL_EASE_OUT` | `[0.25, 1, 0.35, 1]` | Easing suavizado |
| `REVEAL_BLOCK_GAP` | `0s` | Stagger entre blocos em `RevealSequence` |
| `REVEAL_TEXT_Y` | `28px` | Deslocamento vertical de textos |
| `REVEAL_MEDIA_Y` | `20px` | Deslocamento vertical de cards/mídia |

- **Textos e mídia:** reveal de **bloco único** (`y` + `opacity`); viewport margin `-4%`.
- **Hero da Home:** animação própria via `Preloader` (GSAP) + scroll em `HeroTitle` — **não** usa `RevealOnScroll` para intro.
- **`prefers-reduced-motion`:** render estático via `useReducedMotion`.

---

# Seção 01 — Introdução + Contadores

### 1. Objetivo
Manifesto institucional (coluna esquerda) + grid de contadores animados (coluna direita).

### 2. Copy / Textos

| Campo | Label | `<h1>` | `<p>` | Contador valor | Contador legenda |
|---|---|---|---|---|---|
| Conteúdo | `Sobre a GMT` | `Agência especialista em automações, inteligência artificial e marketing digital, dedicada a ajudar pequenas empresas a crescer e a destacar-se no mundo digital.` | `Objetivo claro: gerar resultados reais. Cada negócio, por mais pequeno que seja, merece uma presença digital profissional e eficaz.` | `24` · `15` · `3` (com sufixo `+`) | `serviços disponíveis` · `agentes de IA prontos para trabalhar` · `pacotes de marketing` |
| Elemento HTML | `p` | `h1` | `p` | `span` | `span` |
| Classe | `.type-label` | `.type-h2` | `.type-body-lg` | `font-mono text-5xl md:text-[8vw] lg:text-6xl` | `.type-label` |
| Família | DM Sans | Host Grotesk | DM Sans | Mono sistema (`--font-mono`) | DM Sans |
| Tamanho | 14px | `clamp(42px,6vw,72px)` | 21px | 48px → fluido `8vw` → `text-6xl` (60px) em `lg` | 14px |
| Peso | 400 | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) |

**Layout dos contadores** (`AboutCounterGrid`):

- Grid `grid-cols-2`.
- **Card superior** (`wide: true`, `col-span-2`): **24+ serviços disponíveis**.
- **Dois cards inferiores** lado a lado: **15+ agentes de IA prontos para trabalhar** · **3+ pacotes de marketing**.

> Números derivam da estrutura de serviços: 15 agentes + 3 pacotes + 6 avulsos = 24 serviços totais.

### 3. Imagens / mídia
Nenhuma nesta seção. Contadores = tipografia + animação de contagem.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, h1, p | `RevealOnScroll` + `RevealSequence` | on-scroll | bloco único, `2.0s` |
| Cada card contador | `RevealOnScroll` `variant="media"` | on-scroll | `y 24→0`, stagger `delay = i*0.1` |
| Números dos contadores | `useCountUp` em `AboutCounterGrid` | `useInView` | de `0` até o valor final em `1800ms`, ease cúbico; início sincronizado com `revealDelay * 1000` |

### 6. Responsividade
- **Desktop:** `flex-row`, texto `md:max-w-[55%]`, grid contadores `md:max-w-md`; `pt-[11vw]`, `px-[5vw]`, `gap-[5vw]`.
- **Mobile:** `flex-col`, `pt-28`, `px-5`, `gap-12`; valor `text-5xl`. Card largo `col-span-2`.

### 7. Arquivos relacionados
`src/app/(site)/sobre/page.tsx`, `src/components/about/AboutCounterGrid.tsx`, `src/components/ui/RevealOnScroll.tsx`, classes `.type-label`/`.type-h2`/`.type-body-lg` em `src/styles/globals.css`.

---

# Seção 02 — Slideshow expansivo (branco → preto)

### 1. Objetivo
Transição visual institucional: **frame pai** pequeno e centralizado que expande no scroll, com slideshow de **5 imagens do mesmo conjunto** e fundo que passa de branco para preto. **Mesma lógica estrutural** que a Secção 04 da Home (`ExpandingFrame`).

> **Importante:** ABT-01…05 **não** são imagens isoladas. Pertencem a **um único slide expansivo**. O **35%** refere-se à **largura inicial do bloco pai**, não ao tamanho de cada imagem.

### 2. Copy / Textos
Nenhum texto na seção.

### 3. Imagens / mídia

Componente: `ExpandingFrame` com array `ABOUT_SLIDESHOW` em `sobre/page.tsx`. Cruzado com PLANO Tabela 4.4-C.

**Conjunto único — 5 slides (mesmo padrão de produção):**

| ID | Posição | Proporção (asset) | Export | Arquivo | Status |
|---|---|---|---|---|---|
| ABT-01 | Slide 1 | **16:9** | 2560×1440 | `public/images/ABT-01.webp` | **Produzido** |
| ABT-02 | Slide 2 | **16:9** | 2560×1440 | `public/images/ABT-02.webp` | **Produzido** |
| ABT-03 | Slide 3 | **16:9** | 2560×1440 | `public/images/ABT-03.webp` | **Produzido** |
| ABT-04 | Slide 4 | **16:9** | 2560×1440 | `public/images/ABT-04.webp` | **Produzido** |
| ABT-05 | Slide 5 | **16:9** | 2560×1440 | `public/images/ABT-05.webp` | **Produzido** |

**Regras de renderização:**

| Regra | Detalhe |
|---|---|
| **Grupo** | Os 5 IDs partilham o mesmo `ExpandingFrame` — slideshow interno, não backgrounds independentes |
| **Produção** | Todos os slides: **16:9 · 2560×1440** — mesmo padrão que o frame pai |
| **Frame pai** | `aspect-video` (16:9); largura animada **35% → 75%** |
| **Estado inicial** | **35% largura** (16:9), centrado — **não** é o tamanho isolado do asset |
| **Expansão máxima** | **75% largura** (16:9); depois o scroll **continua** pela secção |
| **Render** | `PlaceholderMedia` com `fill`, `reveal={false}`, `object-cover` dentro do frame 16:9 |
| **Ratio visível** | Frame pai e asset **ambos 16:9** — encaixe sem distorção |
| **Safe zone** | Compor assunto no **centro 55–60%** |

> Cores de fallback por frame definidas em `ABOUT_SLIDESHOW`. Spec em `src/data/media-spec.ts` (`folder: "images"`).

**Comportamento de scroll** (`ExpandingFrame` — idêntico à Home):

- `SECTION_VH = 250`; `SCALE_START ≈ 0.4`.
- **Frame pai inicial:** **35% largura** (16:9 via `aspect-video`), centrado.
- Expansão do frame pai: **35% → 75% largura**, mantendo 16:9; `border-radius 16px→0`.
- Após **75%**, scroll continua pelo resto da secção (`250vh`).
- Fundo: `#ffffff → #000000` no início da expansão (`SCALE_START` a `SCALE_START + 0.12`).
- Slideshow interno: intervalo `700ms` (prop `slideIntervalMs`).

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Efeito |
|---|---|---|---|
| **Frame pai** (tamanho) | Framer Motion `useScroll` + `useTransform` | scroll da secção | **35% → 75% largura**, 16:9 (`aspect-video`) |
| Transição de slides | CSS `transition-opacity duration-500` | `setInterval` 700ms | crossfade entre frames do conjunto |
| Mídia individual | — | — | `fill` + `object-cover`; `reveal={false}` |

### 6. Responsividade
- **Todos:** secção com altura `250vh`; sticky `h-screen` durante a expansão.
- **Frame pai** inicia a **35% largura** (16:9); expande até **75%**; scroll continua depois.
- Slides internos acompanham o crescimento do frame pai.

### 7. Arquivos relacionados
`src/app/(site)/sobre/page.tsx`, `src/components/ui/ExpandingFrame.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`.

---

# Seção 03 — Manifesto + Valores

### 1. Objetivo
Bloco preto contínuo (`.section-cta`): manifesto institucional centrado + grelha de 6 diferenciais com ícones.

### 2. Copy / Textos

**Manifesto:**

| Campo | `<p>` citação |
|---|---|
| Conteúdo | `O nosso compromisso é simples. Ajudar o seu negócio a crescer online com soluções profissionais eficazes e acessíveis.` |
| Elemento HTML | `p` |
| Classe | `.type-manifesto` + `!text-white` |
| Família | Host Grotesk |
| Tamanho | `clamp(2.125rem, 5vw, 4rem)` |
| Peso | 400 |
| Cor da fonte | `#ffffff` |

**Valores** (grelha `sm:grid-cols-2`, centrada):

| Campo | Item |
|---|---|
| Conteúdo | 6 strings de `DIFERENCIAIS` |
| Elemento HTML | `p` + ícone `lucide-react` |
| Classe | `.type-body-lg` + `text-white` |
| Ícones | `size={30}`, `text-white` |

**Lista:** Experiência comprovada · Técnica + criatividade · Tecnologia de ponta · Acompanhamento próximo · Foco em pequenas empresas · Resultados mensuráveis.

> **Sem** `SectionLabel` "Nossos valores". **Sem** coluna vazia à esquerda.

### 3. Imagens / mídia
Nenhuma.

### 4. Botões / CTAs
Nenhum. Conversão via `ChatWidgetLoader` global.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Manifesto | `RevealOnScroll` | on-scroll | bloco único, `2.0s` |
| Cada valor | `RevealOnScroll` `variant="media"` | on-scroll | stagger `delay = i*0.06` |

### 6. Responsividade
- **Desktop:** `py-[6vw]`, `px-[5vw]`; grelha `sm:grid-cols-2`, `max-w-5xl` centrado.
- **Mobile:** `px-5`; coluna única.

### 7. Arquivos relacionados
`src/app/(site)/sobre/page.tsx`, `src/data/diferenciais.ts`, `src/components/ui/RevealOnScroll.tsx`.

---

## Apêndice — tokens e cores usados na Sobre (de `globals.css`)

| Token / Contexto | Valor | Onde aparece na Sobre |
|---|---|---|
| `.section-light` | bg `#ffffff`, text `#0a0a0a`, muted `#575757`, border `#dcdcdc` | wrapper da Secção 01 |
| `--gmt-bg-alt` | `#f5f5f5` | cartões dos contadores (`bg-gmt-bg-alt`) |
| `--gmt-border` | `#dcdcdc` | bordas dos contadores |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Secção 03 (manifesto + valores) |
| fallback slideshow | cores por frame em `ABOUT_SLIDESHOW` | Secção 02 (`ExpandingFrame`) |

> `src/styles/tokens.css` define tokens legados **não usados** pela página Sobre — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*
