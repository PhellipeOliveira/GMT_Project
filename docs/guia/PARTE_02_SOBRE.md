# GUIA DE EDIÇÃO — PARTE 02 · SOBRE (`/sobre`)

> Documentação completa da página Sobre para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/sobre/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/data/media-spec.ts`, `src/data/diferenciais.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026 (actualizado pós-refactor Sobre).

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/sobre` |
| Arquivo | `src/app/sobre/page.tsx` |
| Componentes | `RevealOnScroll`, `ExpandingFrame`, `AboutCounterGrid`, `SectionLabel`, `PlaceholderMedia` (dentro de `ExpandingFrame`) |
| Dados | `ABOUT_SLIDESHOW` em `page.tsx`; contadores em `AboutCounterGrid.tsx`; `DIFERENCIAIS` + `ICONES_DIFERENCIAIS` em `src/data/diferenciais.ts` (partilhado com a Home) |
| Metadata | `title: "Sobre"`; `description` institucional |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Introdução + Contadores
2. Seção 02 — Slideshow expansivo no scroll (branco → preto)
3. Seção 03 — Manifesto (texto isolado, fundo preto)
4. Seção 04 — Nossos valores (fundo preto)

> **Removido:** Seção CTA final ("Pronto para começar?") — conversão coberta pelo `FloatingCTA` global.
>
> Apenas a **Seção 01** está dentro de `<div className="section-light">`. As Seções 02–04 ficam fora desse wrapper. A **Seção 04** usa `.section-cta` (último contentor da página, fundo `#000000`).

---

## Animações globais (aplicáveis à Sobre)

O sistema de entrada global vive em `src/components/ui/RevealOnScroll.tsx`:

| Constante | Valor | Uso |
|---|---|---|
| `REVEAL_DURATION` | `2.1s` | Duração de cada linha ou bloco |
| `REVEAL_EASE_OUT` | `[0.22, 1, 0.36, 1]` | Easing suavizado |
| `REVEAL_LINE_GAP` | `0.06s` | Pausa entre o fim de uma linha e o início da seguinte |
| `REVEAL_TEXT_Y` | `32px` | Deslocamento vertical de textos |
| `REVEAL_MEDIA_Y` | `24px` | Deslocamento vertical de cards/mídia |

- **Textos** (`children` string): entrada **linha por linha** via `splitTextIntoLines`; cada linha só começa após a anterior terminar (`delay + i * (REVEAL_DURATION + REVEAL_LINE_GAP)`).
- **Cards e imagens** (`variant="media"`): reveal de bloco único, mais suave (`y 24→0` + `opacity 0→1`).
- **Hero da Home** (`HeroTitle`): efeito próprio letra-a-letra — **não** usa `RevealOnScroll`.
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
| Label, h1, p | `RevealOnScroll` | on-scroll | texto linha-a-linha, `2.1s`, ease `[0.22,1,0.36,1]`; p com `delay 0.08` |
| Cada card contador | `RevealOnScroll` `variant="media"` | on-scroll | `y 24→0`, stagger `delay = i*0.1` |
| Números dos contadores | `useCountUp` em `AboutCounterGrid` | `useInView` | de `0` até o valor final em `1800ms`, ease cúbico; início sincronizado com `revealDelay * 1000` |

### 6. Responsividade
- **Desktop:** `flex-row`, texto `md:max-w-[55%]`, grid contadores `md:max-w-md`; `pt-[11vw]`, `px-[5vw]`, `gap-[5vw]`.
- **Mobile:** `flex-col`, `pt-28`, `px-5`, `gap-12`; valor `text-5xl`. Card largo `col-span-2`.

### 7. Arquivos relacionados
`src/app/sobre/page.tsx`, `src/components/about/AboutCounterGrid.tsx`, `src/components/ui/RevealOnScroll.tsx`, classes `.type-label`/`.type-h2`/`.type-body-lg` em `src/styles/globals.css`.

---

# Seção 02 — Slideshow expansivo (branco → preto)

### 1. Objetivo
Transição visual institucional: frame pequeno e centralizado que expande no scroll, com slideshow de 5 imagens e fundo que passa de branco para preto. **Mesmo comportamento** que a Secção 04 da Home (`ExpandingFrame`).

### 2. Copy / Textos
Nenhum texto na seção.

### 3. Imagens / mídia

| ID | Slot | Proporção | Export | Arquivo | Status |
|---|---|---|---|---|---|
| ABT-01 | Slideshow frame 1 | 2:1 | 1920×960 | `public/images/ABT-01.webp` | **Produzido** |
| ABT-02 | Slideshow frame 2 | 2:1 | 1920×960 | `public/images/ABT-02.webp` | **Produzido** |
| ABT-03 | Slideshow frame 3 | 2:1 | 1920×960 | `public/images/ABT-03.webp` | **Produzido** |
| ABT-04 | Slideshow frame 4 | 2:1 | 1920×960 | `public/images/ABT-04.webp` | **Produzido** |
| ABT-05 | Slideshow frame 5 | 2:1 | 1920×960 | `public/images/ABT-05.webp` | **Produzido** |

> Render via `PlaceholderMedia` com `fill`, `reveal={false}`, `object-cover`. Cores de fallback por frame definidas em `ABOUT_SLIDESHOW` em `page.tsx`. Spec em `src/data/media-spec.ts` (`folder: "images"`).

**Comportamento de scroll** (`ExpandingFrame`):

- `SECTION_VH = 250`; `SCALE_START ≈ 0.4`.
- Frame inicial: `35%` largura × `45vh` altura, centrado.
- Expansão: `35%→100%` / `45vh→100vh`; `border-radius 16px→0`.
- Fundo: `#ffffff → #000000` no início da expansão (`SCALE_START` a `SCALE_START + 0.12`).
- Slideshow: intervalo `700ms` (prop `slideIntervalMs`).

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Efeito |
|---|---|---|---|
| Frame (tamanho) | Framer Motion `useScroll` + `useTransform` | scroll da secção | escala controlada pelo progresso |
| Transição de slides | CSS `transition-opacity duration-500` | `setInterval` 700ms | crossfade entre frames |
| Mídia individual | — | — | `reveal={false}` (sem `RevealOnScroll` no frame) |

### 6. Responsividade
- **Todos:** secção com altura `250vh`; sticky `h-screen` durante a expansão.
- Frame ocupa ~35% do container quando pequeno; expande até full viewport.

### 7. Arquivos relacionados
`src/app/sobre/page.tsx`, `src/components/ui/ExpandingFrame.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`.

---

# Seção 03 — Manifesto

### 1. Objetivo
Momento de respiro institucional: citação centralizada em fundo preto sólido, **sem imagem**.

### 2. Copy / Textos

| Campo | `<p>` citação |
|---|---|
| Conteúdo | `O nosso compromisso é simples. Ajudar o seu negócio a crescer online com soluções profissionais eficazes e acessíveis.` |
| Elemento HTML | `p` |
| Classe | `.type-h3` + `text-white` |
| Família | Host Grotesk |
| Tamanho | 36px |
| Peso | 400 |
| Cor da fonte | `#ffffff` |
| `text-transform` | none (sem itálico no código) |

### 3. Imagens / mídia
Nenhuma. A imagem que antes acompanhava o manifesto (`ABT-02`) integra o slideshow da Secção 02.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Citação | `RevealOnScroll` | on-scroll | texto linha-a-linha, `2.1s` |

### 6. Responsividade
- **Todos:** `py-16 md:py-16`, `px-5 md:px-[5vw]`, texto `max-w-3xl` centrado.
- Secção mais compacta que o antigo fullscreen com imagem.

### 7. Arquivos relacionados
`src/app/sobre/page.tsx`, `src/components/ui/RevealOnScroll.tsx`.

---

# Seção 04 — Nossos valores

### 1. Objetivo
Listar os 6 diferenciais da agência (mesma lista da Home) em fundo escuro, com ícones apenas na segunda coluna.

### 2. Copy / Textos

| Campo | Label | Item |
|---|---|---|
| Conteúdo | `Nossos valores` (`SectionLabel`) | 6 strings de `DIFERENCIAIS` em `src/data/diferenciais.ts` |
| Elemento HTML | `p` (via `SectionLabel`) | `p` + ícone `lucide-react` |
| Classe | `.section-label` + `.section-label--on-dark` | `.type-body-lg` + `text-white` |
| Família | DM Sans | DM Sans |
| Tamanho | 14px | 21px |
| Peso | 400 | 400 |
| Cor da fonte | `#ffffff` (contexto `.section-cta`) | `#ffffff` (`text-white` explícito) |

**Lista** (partilhada com Home Secção 03): Experiência comprovada · Técnica + criatividade · Tecnologia de ponta · Acompanhamento próximo · Foco em pequenas empresas · Resultados mensuráveis.

**Ícones** (`ICONES_DIFERENCIAIS`): Trophy · Layers · Zap · Users · Target · TrendingUp (`size={22}`, `text-white`).

### 3. Imagens / mídia
Nenhuma.

### 4. Botões / CTAs
Nenhum nesta seção. Conversão via `FloatingCTA` global.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label | `RevealOnScroll` (via `SectionLabel`) | on-scroll | bloco de texto |
| Cada item (ícone + texto) | `RevealOnScroll` `variant="media"` | on-scroll | stagger `delay = i*0.06` |

### 6. Responsividade
- **Desktop:** `flex-row` — coluna 1 vazia `md:w-1/2` (`hidden md:block`); lista `md:w-1/2`; `py-[10vw]`, `px-[5vw]`, `gap-[5vw]`.
- **Mobile:** coluna única (lista ocupa largura total); `py-24`, `px-5`.

### 7. Arquivos relacionados
`src/app/sobre/page.tsx`, `src/data/diferenciais.ts`, `src/components/ui/SectionLabel.tsx`, `src/components/ui/RevealOnScroll.tsx`.

---

## Apêndice — tokens e cores usados na Sobre (de `globals.css`)

| Token / Contexto | Valor | Onde aparece na Sobre |
|---|---|---|
| `.section-light` | bg `#ffffff`, text `#0a0a0a`, muted `#575757`, border `#dcdcdc` | wrapper da Secção 01 |
| `--gmt-bg-alt` | `#f5f5f5` | cartões dos contadores (`bg-gmt-bg-alt`) |
| `--gmt-border` | `#dcdcdc` | bordas dos contadores |
| `bg-black` | `#000000` | Secção 03 (manifesto) |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Secção 04 (valores) — **último contentor da página** |
| fallback slideshow | cores por frame em `ABOUT_SLIDESHOW` | Secção 02 (`ExpandingFrame`) |

> `src/styles/tokens.css` define tokens legados **não usados** pela página Sobre — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*
