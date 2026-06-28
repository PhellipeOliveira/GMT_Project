# GUIA DE EDIÇÃO DO SITE — GMT
**Gerado automaticamente a partir dos arquivos do repositório.**
**Última atualização:** 28 Jun 2026 (pós-refactor Home)

---
## HOME (/)
---


# GUIA DE EDIÇÃO — PARTE 01 · HOME (`/`)

> Documentação completa da página Home para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/data/media-spec.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Última actualização:** 28 Jun 2026 (pós-refactor Home).

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/` |
| Arquivo | `src/app/page.tsx` |
| Componentes (Home) | `HeroSection` (→ `HeroTitle`), `SectionLabel`, `RevealOnScroll`, `ServiceOverlayCard`, `ExpandingFrame`, `HomePortfolioRow`, ícones `lucide-react` |
| Dados | `avulsos` (`src/data/servicos.ts`), `getCaseBySlug("nara")` (`src/data/portfolio.ts`); arrays `DIFERENCIAIS` e `SERV_IMAGE_IDS` no próprio arquivo |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `HomeLanternSection` (→ `GMTLightFooter`), `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das secções (conteúdo + layout global):**

1. Seção 01 — Hero
2. Seção 02 — O que fazemos
3. Seção 03 — Por que a GMT
4. Seção 04 — Transição expansiva (`ExpandingFrame`)
5. Seção 05 — Trabalhos recentes (fundo preto)
6. Footer Navigation (`Footer` — global em `layout.tsx`)
7. Lanterna GMT (`HomeLanternSection` → `GMTLightFooter` — global, só na Home, após o Footer)

> **Nota:** o Hero usa `HeroSection`/`HeroTitle` (marca "GMT" animada, fundo preto). O componente `src/components/ui/HeroSlider.tsx` (que usaria `HER-01`) **existe mas está órfão** — não é importado em `page.tsx`.
>
> **Nota:** a Lanterna GMT **não** está em `page.tsx`; é renderizada por `HomeLanternSection` em `src/app/layout.tsx`, condicionada a `pathname === "/"`.

---

# Seção 01 — Hero

### 1. Objetivo
Primeira impressão institucional: afirma a marca **GMT** a ecrã inteiro (`h-screen`), fundo preto, com o título animado letra-a-letra.

### 2. Copy / Textos
Componente: `src/components/hero/HeroTitle.tsx`

| Campo | `<h1>` | `<p>` subtítulo |
|---|---|---|
| Conteúdo | `GMT` | `Growth Marketing Technology` |
| Elemento HTML | `h1` (`motion.h1`) | `p` (`motion.p`) |
| Classe | `.gmt-brand` + `.gmt-brand--hero` | `.type-hero-subtitle` |
| Família | Host Grotesk (`--font-display`) | DM Sans (`--font-sans`) |
| Tamanho | `clamp(6rem, 15vw, 14rem)` ≡ `clamp(96px,15vw,224px)` | `clamp(3rem, 4.5vw, 4.5rem)` ≡ `clamp(48px,4.5vw,72px)` |
| Peso | **800** (`--font-weight-brand`) | 400 |
| Cor da fonte | `#ffffff` (`text-white`) | `#ffffff` (`text-white`) |
| `letter-spacing` | **0.02em** (via `.gmt-brand`) | 0.05em |
| `text-transform` | uppercase | uppercase |
| `transform` | `scaleX(1.03)`, `transform-origin: center` | — |

> Outros: `line-height` 1 (h1) / 1.2 (p); `white-space: nowrap` em ambos. Fundo da secção `bg-black` (`#000000`) com override local `[--gmt-text:#ffffff]`.

### 3. Imagens / mídia
Nenhuma. Hero puramente tipográfico → **Não identificado no projeto** (sem criativo na PARTE 4 para este hero; `HER-01` pertence ao `HeroSlider`, que está inativo).

### 4. Botões / CTAs
Nenhum nesta secção.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Revelação letra-a-letra | Framer Motion | on-load | char `0.28s`, ease `[0.2,0.65,0.3,0.9]`, `opacity 0→1`, `y 10→0`, `blur(4px)→0`. Stagger: linha 1 `0.1s` (delay 0.1s); linha 2 `0.055s` (delay 0.55s) |
| Blink ao regressar | Framer Motion | on-view (re-entrada no viewport) | `0.8s`, `opacity [1,0.06,…,1]` |

Respeita `prefers-reduced-motion` (render estático).

### 6. Responsividade
- **Desktop / Tablet / Mobile:** `h-screen w-full`, flex centrado. Tamanhos fluidos por `clamp()`/`vw` (sem breakpoints discretos).
- Em viewports < 320px pode haver overflow lateral (efeito do `white-space: nowrap`).

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/hero/HeroSection.tsx`, `src/components/hero/HeroTitle.tsx`, `src/hooks/useReducedMotion.ts`, classes `.gmt-brand`/`.gmt-brand--hero`/`.type-hero-subtitle` em `src/styles/globals.css`.

---

# Seção 02 — O que fazemos

### 1. Objetivo
Apresentar as 6 áreas de **Serviços Avulsos** em cards com imagem de base e texto em overlay, cada um ligando à página de detalhe do serviço.

### 2. Copy / Textos

| Campo | Label | Overlay `<h3>` | Overlay `<p>` (hover) | Botão secção |
|---|---|---|---|---|
| Conteúdo | `O que fazemos` | Nome do serviço (de `avulsos`) | 1.ª funcionalidade do serviço | `Ver todos os serviços →` |
| Elemento HTML | `p` | `h3` | `p` | `a` (Link) |
| Classe | `.section-label` + `--on-light` | `.type-body` + `font-medium` | `.type-body` | `.type-label` |
| Família | DM Sans | DM Sans | DM Sans | DM Sans |
| Tamanho | **12px** | 18px | 18px | 14px |
| Peso | 500 | 500 | 400 | 400 |
| Cor da fonte | `#575757` (`--gmt-text-muted`) | `#ffffff` | `rgba(255,255,255,0.9)` | `#ffffff` |
| `letter-spacing` | 0.14em | — | — | 0.1em |
| `text-transform` | uppercase | none | none | uppercase |

Os 6 cards (de `servicos.ts`, `tipo: "avulso"`): Criação de Conteúdo · Publicidade Digital · Branding & Estratégia · Websites · Inteligência Artificial · Analytics & Otimização.

**Rótulo de secção:** componente `SectionLabel` (`src/components/ui/SectionLabel.tsx`), classe `.section-label`.

### 3. Imagens / mídia
Componente: `ServiceOverlayCard` (`src/components/home/ServiceOverlayCard.tsx`). Proporção `7:5` (`aspect-[7/5]`). IDs em `SERV_IMAGE_IDS`. Cruzado com PLANO Tabela 4.4-B.

| ID | Slot | Proporção | Export | Arquivo actual | Status |
|---|---|---|---|---|---|
| SERV-AV-01 | Card Criação de Conteúdo | 7:5 | 1400×1000 | (não existe) | **Lacuna** |
| SERV-AV-02 | Card Publicidade Digital | 7:5 | 1400×1000 | (não existe) | **Lacuna** |
| SERV-AV-03 | Card Branding & Estratégia | 7:5 | 1400×1000 | (não existe) | **Lacuna** |
| SERV-AV-04 | Card Websites | 7:5 | 1400×1000 | (não existe) | **Lacuna** |
| SERV-AV-05 | Card Inteligência Artificial | 7:5 | 1400×1000 | (não existe) | **Lacuna** |
| SERV-AV-06 | Card Analytics & Otimização | 7:5 | 1400×1000 | (não existe) | **Lacuna** |

> Como o asset não existe, o `PlaceholderMedia` renderiza o placeholder com cor de fallback `servico.corPlaceholder` (família AV = `#1A3A2A`).

**Estrutura visual do card:**
- Imagem ocupa o card inteiro (`PlaceholderMedia` com `fill`).
- Gradiente escuro permanente: `from-black/80 via-black/30 to-black/15`.
- Título fixo no **topo esquerdo** do overlay (`absolute top-0 left-0`, `p-5 md:p-6`).
- Descrição (1.ª funcionalidade) aparece **abaixo do título** apenas em `:hover`.

### 4. Botões / CTAs
- **Cada card** — `<Link href="/servicos/{slug}">` envolve o card inteiro (clicável).
- **"Ver todos os serviços →"** — classes inline: `.type-label` + `rounded-full bg-black px-8 py-3.5 text-white`.
  - Fundo `#000000` · Texto `#ffffff` · `border-radius 9999px` · `padding 0.875rem 2rem`.
  - Hover: `bg-black/80` (transição `colors 300ms`).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, cards e botão | Framer Motion (`RevealOnScroll`) | on-scroll | `2.1s` ease `[0.22,1,0.36,1]`; cards com stagger `delay = i*0.08` |
| Imagem do card | CSS | on-hover (`group`) | `blur(4px)` + `saturate(0.35)`, 500ms |
| Descrição overlay | CSS | on-hover (`group`) | `opacity-0 → opacity-100`, `translate-y-1 → 0`, 300ms |

> Em dispositivos touch (`hover: none`), a descrição extra não é revelada — apenas o título permanece visível.

### 6. Responsividade
- **Desktop:** `px-[5vw] py-[8vw]`, grid `sm:grid-cols-2`.
- **Mobile:** `px-5 py-20`, `grid-cols-1`.

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/home/ServiceOverlayCard.tsx`, `src/components/ui/SectionLabel.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/components/ui/RevealOnScroll.tsx`, `src/data/servicos.ts`.

---

# Seção 03 — Por que a GMT

### 1. Objetivo
Listar os 6 diferenciais institucionais da agência em layout minimalista (fundo alternado `bg-gmt-bg-alt`), sem cards visuais.

### 2. Copy / Textos

| Campo | Label | Item |
|---|---|---|
| Conteúdo | `Por que a GMT` | Título do diferencial (texto curto) |
| Elemento HTML | `p` | `p` |
| Classe | `.section-label` + `--on-light` | `.type-body` |
| Família | DM Sans | DM Sans |
| Tamanho | **12px** | 18px |
| Peso | 500 | 400 |
| Cor da fonte | `#575757` (`--gmt-text-muted`) | `#0a0a0a` (`text-gmt-text`) |
| `letter-spacing` | 0.14em | — |
| `text-transform` | uppercase | none |

Os 6 diferenciais (array `DIFERENCIAIS`): Experiência comprovada · Técnica + criatividade · Tecnologia de ponta · Acompanhamento próximo · Foco em pequenas empresas · Resultados mensuráveis.

> **Removido:** `<h2>` institucional longo, parágrafos descritivos por item, cards com borda/fundo/branco.

### 3. Imagens / mídia
Nenhuma imagem. Cada item usa um **ícone** `lucide-react` (`Trophy`, `Layers`, `Zap`, `Users`, `Target`, `TrendingUp`), `size 20`, `strokeWidth 1.5`, alinhado à esquerda do texto. Corresponde a `GL-05` na PARTE 4 (ícones de UI, sem produção externa). Status: ícones vetoriais → **Produzido** (lucide-react).

### 4. Botões / CTAs
Nenhum. Itens não são clicáveis.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label e itens | Framer Motion (`RevealOnScroll`) | on-scroll | stagger `delay = i*0.06` |

### 6. Responsividade
- **Desktop:** `md:px-[5vw] md:py-[8vw]`, grid `lg:grid-cols-3`.
- **Tablet:** `sm:grid-cols-2`.
- **Mobile:** `px-5 py-20`, `grid-cols-1`.

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/ui/SectionLabel.tsx`, `src/components/ui/RevealOnScroll.tsx`.

---

# Seção 04 — Transição expansiva (ExpandingFrame)

### 1. Objetivo
Transição cinematográfica entre o bloco claro e o bloco preto: um frame cresce no scroll enquanto cicla imagens e o fundo do container passa de branco a preto **no início da expansão**.

### 2. Copy / Textos
Nenhum texto. **Não identificado no projeto** (secção puramente visual).

### 3. Imagens / mídia
Componente: `src/components/ui/ExpandingFrame.tsx` (array `FRAME_IMAGES`). Cruzado com PLANO Tabela 4.4-C.

| ID | Slot | Proporção (spec) | Export | Arquivo actual | Status |
|---|---|---|---|---|---|
| HER-02 | Frame slide 1 (portrait) | 110:225 | 880×1800 | `public/images/HER-02.webp` | **Produzido** |
| HER-03 | Frame slide 2 | 4:3 | 1200×900 | `public/images/HER-03.webp` | **Produzido** |
| HER-04 | Frame slide 3 | 4:3 | 1200×900 | `public/images/HER-04.webp` | **Produzido** |
| HER-05 | Frame slide 4 | 4:3 | 1200×900 | `public/images/HER-05.webp` | **Produzido** |

> Dentro do frame são renderizadas em `fill` (`object-cover`), ignorando o ratio da spec. Cor de fallback `#111827`.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Tamanho do frame | Framer Motion (`useScroll`/`useTransform`) | on-scroll | `35% × 45vh → 100% × 100vh` (progress `SCALE_START`→1, onde `SCALE_START ≈ 0.4`) |
| `border-radius` | Framer Motion | on-scroll | `16px → 0px` |
| Fundo do container | Framer Motion | on-scroll | `#ffffff → #000000` (progress **`0.4 → 0.52`**, janela de ~12% do scroll) |
| Slideshow das 4 imagens | `setInterval` + CSS | tempo (700ms) | fade `opacity`, 500ms |

**Comportamento observável:**
1. A secção entra pelo fundo do viewport (fundo branco, frame pequeno).
2. O frame sobe até ao centro (~40% do progress da secção de 250vh).
3. Quando o sticky activa e a expansão **começa**, o fundo inicia transição rápida branco → preto.
4. Durante a maior parte da expansão (progress > 0.52), o fundo já está completamente preto.
5. Scroll para cima inverte tudo.

A secção tem `250vh`; o container é `sticky top-0`. Totalmente reversível com o scroll.

### 6. Responsividade
Comportamento idêntico em todos os tamanhos (medidas em `%`/`vw`/`vh`, sem breakpoints específicos).

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/ui/ExpandingFrame.tsx`, `src/components/ui/PlaceholderMedia.tsx`.

---

# Seção 05 — Trabalhos recentes (fundo preto)

### 1. Objetivo
Mostrar o case **NARA** + 2 slots "em breve" em faixa preta (`.section-cta`), com layout simplificado em linhas de 2 colunas.

### 2. Copy / Textos

| Campo | Label | Projecto NARA `<h3>` | Descrição NARA | Botão NARA | Slots "em breve" | Botão global |
|---|---|---|---|---|---|---|
| Conteúdo | `Trabalhos recentes` | `NARA` | `resumo` do case | `Ver Produto →` | `Projeto` + `Em breve` | `Ver portfólio completo →` |
| Elemento HTML | `p` | `h3` | `p` | `a` (Link) | `h3` / `p` | `a` (Link) |
| Classe | `.section-label` + `--on-dark` | `.type-h3` | `.type-body` | `.type-label` | `.type-h3` / `.type-body` | `.type-label` |
| Família | DM Sans | Host Grotesk | DM Sans | DM Sans | Host Grotesk / DM Sans | DM Sans |
| Tamanho | **12px** | 36px | 18px | 14px | 36px / 18px | 14px |
| Peso | 500 | 400 | 400 | 400 | 400 | 400 |
| Cor da fonte | `rgba(255,255,255,0.55)` | `#ffffff` | `#94a3b8` (`text-gmt-muted`) | `#ffffff` | `#ffffff` / `#94a3b8` | `#ffffff` |

> **Removido:** tags (`.tag-pill`), metadados `local`/`indústria`/`serviços`, botões secundários por projecto.
>
> Dados NARA de `src/data/portfolio.ts` — apenas `nome`, `resumo`, `slug` e `corPlaceholder` são usados na Home.

### 3. Imagens / mídia
Componente: `HomePortfolioRow` (`src/components/home/HomePortfolioRow.tsx`). Cruzado com PLANO Tabela 4.5.

| ID | Slot | Proporção | Export | Arquivo actual | Status |
|---|---|---|---|---|---|
| PF-01 | Showcase NARA | 3:4 | 1200×1600 | `public/images/PF-01.webp` | **Produzido** |
| PF-02a | "em breve" 1 | (sem spec) | — | (não existe) | **Lacuna** (intencional) |
| PF-02b | "em breve" 2 | (sem spec) | — | (não existe) | **Lacuna** (intencional) |

> Cor NARA = `#134E4A` (`COR_PORTFOLIO`). Slots "em breve" usam cor `#1E293B` + prop `emBreve`.

**Layout:** 1 linha por projecto — coluna esquerda: imagem; coluna direita: título + descrição + botão (quando aplicável). Grid `md:grid-cols-2`.

### 4. Botões / CTAs
- **"Ver Produto →"** (NARA) — `href="/portfolio/nara"`, inline: `.type-label` + `rounded-full border border-white/30 px-6 py-3 text-white`.
- **"Ver portfólio completo →"** — centralizado abaixo da lista, inline: `.type-label` + `rounded-full border border-white/30 px-8 py-3.5 text-white`.
  - Hover: `border-white/60` + `bg-white/10` (transição `all 300ms`).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, linhas e botão global | Framer Motion (`RevealOnScroll`) | on-scroll | stagger (`delay 0.08`/`0.16`) |

### 6. Responsividade
- **Desktop:** `md:px-[5vw] md:py-[8vw]`, linhas em 2 colunas (`md:grid-cols-2`).
- **Mobile:** `px-5 py-20`, coluna única (imagem acima, texto abaixo).

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/home/HomePortfolioRow.tsx`, `src/components/ui/SectionLabel.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`.

> `PortfolioCard` **não** é usado na Home (mantém-se em `/servicos/[slug]`).

---

# Secções removidas (não existem no código actual)

As seguintes secções foram **removidas** da Home e não devem ser documentadas como activas:

| Secção | Conteúdo removido |
|---|---|
| Testemunhos | Label "Testemunhas", H2 "Em breve — depoimentos…", botão "Agendar agora" |
| CTA final | H2 "Pronto para automatizar o seu negócio?", parágrafo, botão "Agendar agora" |

> O agendamento global permanece via `FloatingCTA` no layout (`layout.tsx`).

---

# Lanterna GMT (última secção visual da Home)

### 1. Objetivo
Efeito decorativo de branding: "GMT" gigante revelado por um foco de luz que segue o cursor. **Não é funcional** (sem links nem CTAs). Última secção visual da Home, posicionada **após** o Footer Navigation.

### 2. Montagem
| Campo | Detalhe |
|---|---|
| Componente | `GMTLightFooter` (`src/components/ui/GMTLightFooter.tsx`) |
| Wrapper | `HomeLanternSection` (`src/components/home/HomeLanternSection.tsx`) |
| Onde renderiza | `src/app/layout.tsx` — após `<Footer />`, condicionado a `pathname === "/"` |
| Papel | Visual / branding — independente do `<main>` |

### 3. Copy / Textos
Duas camadas de texto `GMT` (`aria-hidden`).

| Campo | Texto (2 camadas sobrepostas) |
|---|---|
| Conteúdo | `GMT` |
| Elemento HTML | `p` |
| Classe | `.gmt-brand` + `.gmt-brand--footer` |
| Família | Host Grotesk (`--font-display`) |
| Tamanho | `clamp(8rem, 33vw, 36rem)` |
| Peso | **800** (`--font-weight-brand`) |
| Cor da fonte | camada base `#111111`; camada reveal `#d4d4d4` |
| `letter-spacing` | **0.02em** |
| `text-transform` | uppercase |
| `transform` | `scaleX(1.03)`, `transform-origin: center` |

> Outros: `line-height: 0.85` (variante `--footer`). Fundo da secção `#000000`.

### 4. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Foco de luz (reveal do texto) | CSS `mask-image` (radial) + JS `requestAnimationFrame` | on-hover (movimento do cursor) | `radial-gradient circle 20vw` centrado em `var(--mx)/var(--my)`; atualizado sem re-render React |
| Opacidade do reveal | CSS transition | on-enter/on-leave | `0.5s ease` |

Touch: iluminação estática centrada (`opacity 0.55`). **Não** usa Framer Motion.

### 6. Responsividade
- **Desktop:** cursor-follow ativo; `md:py-20`.
- **Mobile/touch:** fallback estático centrado; `py-12`.
- Texto fluido por `clamp()`/`vw`.

### 7. Arquivos relacionados
`src/app/layout.tsx`, `src/components/home/HomeLanternSection.tsx`, `src/components/ui/GMTLightFooter.tsx`.

---

## Apêndice — tokens e cores usados na Home (de `globals.css`)

| Token | Valor | Onde aparece na Home |
|---|---|---|
| `--gmt-bg` | `#ffffff` | fundo Secção 02 |
| `--gmt-bg-alt` | `#f5f5f5` | fundo Secção 03 |
| `--gmt-text` | `#0a0a0a` | texto em fundo claro |
| `--gmt-text-muted` | `#575757` | texto secundário (claro) + `.section-label--on-light` |
| `--type-section-label` | `12px` | rótulos de secção (`.section-label`) |
| `--font-weight-brand` | `800` | marca GMT (`.gmt-brand`) |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Secção 05 |
| Hero (`HeroSection`) | bg `#000000`, text `#ffffff` | Secção 01 |
| Família AV (placeholder) | `#1A3A2A` | fallback cards Secção 02 |
| `COR_PORTFOLIO` | `#134E4A` | showcase NARA (Secção 05) |
| "em breve" / fallback frame | `#1E293B` / `#111827` | Secções 04 e 05 |

## Apêndice — identidade tipográfica GMT (`.gmt-brand`)

| Variante | Onde | Tamanho |
|---|---|---|
| `.gmt-brand` (base) | partilhada | peso 800, `ls 0.02em`, `scaleX(1.03)`, `origin center` |
| `.gmt-brand--hero` | Hero `HeroTitle` | `clamp(96px, 15vw, 224px)` |
| `.gmt-brand--navbar` | Navbar + Footer logo (`GmtLogo`) | `clamp(18px, 2.8vw, 28px)` |
| `.gmt-brand--footer` | Lanterna GMT | `clamp(8rem, 33vw, 36rem)` |

*Documento gerado a partir do código do repositório. Nenhuma informação foi inventada.*

---
## SOBRE (/sobre)
---

# GUIA DE EDIÇÃO — PARTE 02 · SOBRE (`/sobre`)

> Ver também: `docs/guia/PARTE_02_SOBRE.md` (cópia canónica desta secção).

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
- **Todos:** `py-16 md:py-20`, `px-5 md:px-[5vw]`, texto `max-w-3xl` centrado.
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


---
## SERVIÇOS · LISTAGEM (/servicos)
---

# GUIA DE EDIÇÃO — PARTE 03 · SERVIÇOS · LISTAGEM (`/servicos`)

> Documentação completa da página de listagem de Serviços para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/servicos/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts`, `src/lib/media.ts`, `src/data/servicos.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/servicos` |
| Arquivo | `src/app/servicos/page.tsx` |
| Componentes | `RevealOnScroll`, `PlaceholderMedia`, `Accordion` |
| Dados | `agentes`, `pacotes`, `avulsos`, tipo `Servico` (`src/data/servicos.ts`); `SERVICOS_HERO_THUMBS` (`src/lib/media.ts`); arrays `CATEGORIAS` e helper `toItems()` no próprio arquivo |
| Metadata | `title: "Serviços"`; `description` institucional |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Cabeçalho + thumbnails
2. Seção 02 — Categoria: Automação & IA (Accordion)
3. Seção 03 — Categoria: Pacotes de Marketing (Accordion)
4. Seção 04 — Categoria: Serviços Avulsos (Accordion)
5. Seção 05 — CTA final

> As Seções 01–04 estão envolvidas por `<div className="section-light">` (tokens claros: bg `#ffffff`, texto `#0a0a0a`, muted `#575757`). As 3 categorias (02–04) são geradas em loop a partir do array `CATEGORIAS`, todas usando o componente `Accordion`.

---

# Seção 01 — Cabeçalho + thumbnails

### 1. Objetivo
Título da página + tagline institucional + 3 thumbnails de credencial (split layout).

### 2. Copy / Textos

| Campo | Label | `<h1>` | `<p>` tagline |
|---|---|---|---|
| Conteúdo | `Os nossos serviços` | `Serviços` | `Agência especialista em automações, inteligência artificial e marketing digital para pequenas empresas — tudo num só parceiro.` |
| Elemento HTML | `p` | `h1` | `p` |
| Classe | `.type-label` | `.type-h2` | `.type-h3` |
| Família | DM Sans | Host Grotesk | Host Grotesk |
| Tamanho | 14px | `clamp(42px,6vw,72px)` | 36px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `var(--gmt-text)` = `#0a0a0a` |
| `letter-spacing` | 0.1em | — | — |
| `text-transform` | uppercase | none | none |

### 3. Imagens / mídia
Thumbnails de `SERVICOS_HERO_THUMBS = ["AG-01", "MKT-02", "AV-05"]` (`src/lib/media.ts`). Render `descricao="thumbnail · 3:2"`, `rounded-lg md:rounded-[1vw]`, cor de fallback `#1E293B`, `reveal={false}`. Cruzado com PLANO Tabelas 4.2-A / 4.3 / 4.4.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| AG-01 | Thumb · Reservas via WhatsApp | 3:2 | 1200×800 | `public/images/AG-01.webp` | **Produzido** |
| MKT-02 | Thumb · Pacote Crescimento | 3:2 | 1200×800 | `public/images/MKT-02.webp` | **Produzido** |
| AV-05 | Thumb · Inteligência Artificial | 3:2 | 1200×800 | `public/images/AV-05.webp` | **Produzido** |

### 4. Botões / CTAs
Nenhum (thumbnails não-clicáveis nesta seção).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, h1, tagline | Framer Motion (`RevealOnScroll`) | on-scroll | `2.1s`, ease `[0.22,1,0.36,1]` |
| Cada thumbnail | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |
| Imagem (quando há asset) | CSS (`.media-zoom`) | on-hover | `scale(1.03)`, 400ms |

### 6. Responsividade
- **Desktop:** cabeçalho `flex-row` (rótulo/h1 `md:w-1/3`, tagline `md:w-2/3`); thumbs `sm:grid-cols-3`; `pt-[11vw]`, `px-[5vw]`, `mt-[5vw]`.
- **Tablet:** thumbs `sm:grid-cols-3`.
- **Mobile:** `flex-col`, thumbs `grid-cols-1`; `pt-28`, `px-5`, `mt-10`.

### 7. Arquivos relacionados
`src/app/servicos/page.tsx`, `src/lib/media.ts`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`.

---

# Seções 02–04 — Categorias (Accordion)

> Três seções com a mesma estrutura, geradas a partir do array `CATEGORIAS`. Componente: `src/components/ui/Accordion.tsx`. Os itens (nome, subtítulo = `headline`, lista de `funcionalidades`, link `/servicos/{slug}`, `cor` da família) vêm de `src/data/servicos.ts` via `toItems()`.

### 1. Objetivo
Organizar toda a oferta da GMT em 3 categorias expansíveis (descoberta progressiva).

### 2. Copy / Textos

**Cabeçalho de cada categoria:**

| Campo | `<h2>` categoria | `<p>` descrição |
|---|---|---|
| Elemento HTML | `h2` | `p` |
| Classe | `.type-category` | `.type-body` |
| Família | Host Grotesk | DM Sans |
| Tamanho | `clamp(36px,5vw,48px)` | 18px |
| Peso | **300** | 400 |
| Cor da fonte | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — |
| `text-transform` | uppercase | none |

Conteúdo dos 3 cabeçalhos (de `CATEGORIAS`):
- **Seção 02 — Automação & IA** — `15 agentes inteligentes que trabalham pelo seu negócio, 24h por dia.` (itens = 15 agentes)
- **Seção 03 — Pacotes de Marketing** — `3 pacotes para iniciar, crescer ou dominar a sua presença digital.` (itens = 3 pacotes)
- **Seção 04 — Serviços Avulsos** — `6 áreas de especialização para necessidades pontuais.` (itens = 6 avulsos)

**Elementos dentro de cada item do Accordion:**

| Campo | Título | Subtítulo (headline) | Item (funcionalidade) | Link |
|---|---|---|---|---|
| Elemento HTML | `span` (em `button`) | `span` | `li` | `a` (Link) |
| Classe | `.type-body-lg` | `.type-body` | `.type-body` | `.type-body` |
| Família | DM Sans | DM Sans | DM Sans | DM Sans |
| Tamanho | 21px | 18px | 18px | 18px |
| Peso | 400 | 400 | 400 | 400 |
| Cor (estado fechado) | `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) | `#575757` (`text-gmt-muted`) | `var(--gmt-accent)` = `#2563eb` |
| Cor (aberto / hover) | `#ffffff` (item fica `bg-black`) | `rgba(255,255,255,0.7)` (`text-white/70`) | — | hover `#7c3aed` (`accent-2`) |
| `text-transform` | none | none | none | none |

Texto do link dentro do painel: `Ver serviço →`.

**Itens por categoria (de `servicos.ts`):**
- **Agentes (15):** Reservas via WhatsApp · Voz para Telefone · Cardápio Inteligente (RAG) · Reputação e Reviews · Relatório Semanal para o Dono · Agendamento Universal · Follow-up de Clientes · Triagem de Documentos · Cobrança Automática · Criação de Conteúdo Autónomo · Monitor de Concorrência · Relatório de Performance de Marketing · Qualificação de Leads · Grafos Personalizados (Premium) · Onboarding de Clientes.
- **Pacotes (3):** Pacote Essencial · Pacote Crescimento · Pacote Premium.
- **Avulsos (6):** Criação de Conteúdo · Publicidade Digital · Branding & Estratégia · Websites · Inteligência Artificial · Analytics & Otimização.

### 3. Imagens / mídia
Nenhuma imagem nestas seções. Cada item exibe um **ponto colorido** (`size-2.5 rounded-full`) com a cor da família (`item.cor` = `servico.corPlaceholder`) e um ícone **`ChevronDown`** (`lucide-react`, `size 20`).

Cores de família (`CORES_FAMILIA` em `servicos.ts`): F1 `#92400E` · F2 `#1E3A5F` · F3 `#3B0764` · F4 `#0F172A` · MKT `#1A3A2A` · AV `#1A3A2A`. Ícones = `GL-05` na PARTE 4 (vetor lucide, sem produção externa) → **Produzido**.

### 4. Botões / CTAs
- **Cabeçalho de cada item** = `<button>` (toggle, `aria-expanded`). Estado aberto/hover: fundo `bg-black`, texto branco; `rounded-lg`, `px-4 py-5`. Estado fechado: fundo transparente, `hover:bg-black`.
- **Link "Ver serviço →"** (dentro do painel aberto): `.type-body`, cor `--gmt-accent` (`#2563eb`), hover `--gmt-accent-2` (`#7c3aed`). `border-radius` herdado (inline-link, sem fundo).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Abertura/fecho do painel | CSS (`.accordion-panel`) | on-click | `grid-template-rows 0fr→1fr`, 300ms `cubic-bezier(0.4,0,0.2,1)` |
| `ChevronDown` | CSS | on-click | rotação `0→180°` + cor, 300ms |
| Ponto colorido | CSS | on-hover/aberto | opacidade, 300ms |
| Cabeçalho da categoria + cada item | Framer Motion (`RevealOnScroll`) | on-scroll | stagger `delay = i*0.08` |

Apenas um item aberto por vez (estado `openId`).

### 6. Responsividade
- **Desktop:** cabeçalho da categoria `flex-row md:items-end md:justify-between`; subtítulo do item visível (`lg:inline`); `mt-[8vw]`, `px-[5vw]`.
- **Tablet:** subtítulo do item ainda **oculto** (só aparece em `lg`).
- **Mobile:** cabeçalho `flex-col`; subtítulo oculto (`hidden`); `mt-10`, `px-5`.

### 7. Arquivos relacionados
`src/app/servicos/page.tsx`, `src/components/ui/Accordion.tsx`, `src/components/ui/RevealOnScroll.tsx`, `src/data/servicos.ts`, classes `.type-category`/`.accordion-list`/`.accordion-item`/`.accordion-panel*` em `src/styles/globals.css`.

---

# Seção 05 — CTA final

### 1. Objetivo
Conversão (faixa preta `.section-cta`, centrada).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Não sabe por onde começar?` | `Agende uma reunião gratuita e desenhamos o plano certo para si.` |
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
`src/app/servicos/page.tsx`, classes `.btn-submit` e `.section-cta` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados na Listagem de Serviços (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `.section-light` | bg `#ffffff`, text `#0a0a0a`, muted `#575757`, border `#dcdcdc` | wrapper Seções 01–04 |
| `--gmt-text` | `#0a0a0a` | h1, tagline, categorias, títulos de item |
| `--gmt-text-muted` | `#575757` | labels, descrições, funcionalidades |
| `--gmt-border` | `#dcdcdc` | linhas do accordion (`.accordion-list`/`.accordion-item`) |
| `--gmt-accent` | `#2563eb` | link "Ver serviço →" |
| `--gmt-accent-2` | `#7c3aed` | hover do link |
| `.type-category` peso | 300 (Host Grotesk) | títulos das categorias |
| Cores de família (ponto) | F1 `#92400E` · F2 `#1E3A5F` · F3 `#3B0764` · F4 `#0F172A` · MKT/AV `#1A3A2A` | ponto colorido por item |
| fallback de thumbnail | `#1E293B` | Seção 01 (AG-01, MKT-02, AV-05) |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seção 05 |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por esta página — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*


---
## SERVIÇO · DETALHE (/servicos/[slug])
---

# GUIA DE EDIÇÃO — PARTE 04 · SERVIÇO · DETALHE (`/servicos/[slug]`)

> Documentação completa do **template dinâmico** de página individual de serviço.
>
> **Arquivo principal:** `src/app/servicos/[slug]/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts`, `src/lib/media.ts`, `src/data/servicos.ts`, `src/data/portfolio.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/servicos/[slug]` (rota dinâmica) |
| Arquivo | `src/app/servicos/[slug]/page.tsx` |
| Componentes | `RevealOnScroll`, `PlaceholderMedia`, `PortfolioCard`, ícone `Check` (`lucide-react`) |
| Dados | `servicos`, `getServicoBySlug` (`src/data/servicos.ts`); `getCaseBySlug("nara")` (`src/data/portfolio.ts`); `getServicoHeroId`, `getFamiliaProcessBg` (`src/lib/media.ts`); array `PROCESSO` no próprio arquivo |
| Geração estática | `generateStaticParams()` → 1 página por serviço (**24 páginas**: 15 agentes + 3 pacotes + 6 avulsos); `generateMetadata()` (title = `servico.nome`, description = `headline`/`solucao`/`nome`) |
| 404 | `notFound()` quando o slug não existe |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 00 — Hero do serviço
2. Seção 01 — Proposta de valor (desafio + solução)
3. Seção 01b — Benefícios
4. Seção 02 — O que inclui (funcionalidades)
5. Seção 03 — Como funciona (process cards)
6. Seção 04 — Casos de uso (Para quem é)
7. Seção 05 — Em prática (NARA)
8. Seção 06 — CTA final

> As Seções 01–05 estão envolvidas por `<div className="section-light">` (tokens claros). A Seção 00 (hero) e a Seção 06 (CTA) ficam fora desse wrapper.

---

## Dados vs. estrutura do template

> **Distinção pedida** — o que muda por serviço (vem de `src/data/servicos.ts`) e o que é fixo no template (`page.tsx`):

| Origem | Conteúdo |
|---|---|
| **Dados — `servicos.ts` (por serviço)** | `nome` (h1), `headline` (subtítulo do hero), `problema`, `solucao`, `beneficios[]`, `funcionalidades[]`, `casosDeUso[]`, `familia`, `corPlaceholder` |
| **Dados — `lib/media.ts` (derivado da família/slug)** | ID do hero (`getServicoHeroId`), ID do fundo de processo (`getFamiliaProcessBg`) |
| **Dados — `portfolio.ts`** | Case NARA da Seção 05 (`getCaseBySlug("nara")`) |
| **Estrutural — fixo no template** | Rótulos de seção (`O desafio`, `A solução`, `Benefícios`, `O que inclui`, `Como funciona`, `Para quem é`, `Em prática`), o array `PROCESSO` (5 passos, institucional, igual para todos), copy do CTA final, link `← Serviços` |
| **Renderização condicional** | Seção 01 só aparece se `problema`/`solucao` existir; 01b só se `beneficios.length > 0`; 04 só se `casosDeUso.length > 0`; 05 só se o case NARA existir; bloco "solução" da Seção 02 só se `tipo === "pacote"` |

---

# Seção 00 — Hero do serviço

### 1. Objetivo
Abertura full-bleed (70–80vh) com nome e headline do serviço sobre imagem/vídeo da família visual.

### 2. Copy / Textos

| Campo | Link voltar | `<h1>` | `<p>` headline |
|---|---|---|---|
| Conteúdo | `← Serviços` | `servico.nome` (dados) | `servico.headline` (dados; condicional) |
| Elemento HTML | `a` (Link) | `h1` | `p` |
| Classe | `.type-label` | `.type-hero` + `.type-hero--fullscreen` | `.type-body-lg` |
| Família | DM Sans | Host Grotesk | DM Sans |
| Tamanho | 14px | `clamp(52px,9vw,108px)` | 21px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `rgba(255,255,255,0.7)` (`text-white/70`, hover `#ffffff`) | `#ffffff` (`!text-white`) | `rgba(255,255,255,0.7)` (`text-white/70`) |
| `letter-spacing` | 0.1em | — | — |
| `text-transform` | uppercase | none | none |

> `line-height` do h1 = `var(--type-hero-leading)` = `clamp(1, 8vw, 1.1)` (via `.type-hero--fullscreen`).

### 3. Imagens / mídia
Hero resolvido por `getServicoHeroId(servico)` (`src/lib/media.ts`): agente → hero da família; pacote → `MKT-04`; avulso → o próprio thumb 3:2. Render `fill`, `priority`, `sizes="100vw"`, `reveal={false}`. Overlay gradiente `from-black via-black/40 to-transparent`. Cor de fallback = `servico.corPlaceholder`. Cruzado com PLANO Tabelas 4.2-B / 4.3 / 4.4.

| ID | Quando | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|---|
| AGH-F1 | Agente família F1 | Hero família Hospitalidade | 3:1 | 2560×860 | `public/videos/AGH-F1.webp` | **Produzido** |
| AGH-F2 | Agente família F2 | Hero família Operação Eficiente | 3:1 | 2560×860 | `public/videos/AGH-F2.webp` | **Produzido** |
| AGH-F3 | Agente família F3 | Hero família Growth & Dados | 3:1 | 2560×860 | `public/videos/AGH-F3.webp` | **Produzido** |
| AGH-F4 | Agente família F4 | Hero família Inovação Sob Medida | 3:1 | 2560×860 | `public/videos/AGH-F4.webp` | **Produzido** |
| MKT-04 | Pacotes (MKT) | Hero pacotes marketing | 3:1 | 2560×860 | `public/videos/MKT-04.webp` | **Produzido** |
| AV-01..06 | Avulsos | Reutiliza o thumb do avulso | 3:2 | 1200×800 | `public/images/AV-0X.webp` | **Produzido** |

> Container `h-[80vh] md:h-[70vh]`. Para agentes, `getServicoHeroId` mapeia `familia` → `AGH-F{1..4}`; para avulsos devolve o thumb (`getServicoThumbId`).

### 4. Botões / CTAs
Link "← Serviços" (texto, não botão): `.type-label`, `text-white/70`, hover `#ffffff`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Link, h1, headline | Framer Motion (`RevealOnScroll`) | on-scroll | `2.1s`, ease `[0.22,1,0.36,1]`; headline `delay 0.08` |
| Mídia de fundo | — | — | `reveal={false}` (sem reveal); zoom CSS no hover quando há asset |

### 6. Responsividade
- **Desktop:** `h-[70vh]`; conteúdo `md:w-1/2`, `px-[5vw]`, `pb-[5vw]`.
- **Tablet/Mobile:** `h-[80vh]`; conteúdo largura total, `px-5`, `pb-12`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/lib/media.ts`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`, classes `.type-hero`/`.type-hero--fullscreen` em `src/styles/globals.css`.

---

# Seção 01 — Proposta de valor (desafio + solução)

> Condicional: só renderiza se `servico.problema` ou `servico.solucao` existir.

### 1. Objetivo
Contrastar o problema do cliente (`O desafio`) com a transformação prometida (`A solução`).

### 2. Copy / Textos

| Campo | `<h2>` "O desafio" | `<p>` problema | `<h2>` "A solução" | `<p>` solução |
|---|---|---|---|---|
| Conteúdo | `O desafio` (estrutural) | `servico.problema` (dados) | `A solução` (estrutural) | `servico.solucao` (dados) |
| Elemento HTML | `h2` | `p` | `h2` | `p` |
| Classe | `.type-label` | `.type-h3` | `.type-label` | `.type-body-lg` |
| Família | DM Sans | Host Grotesk | DM Sans | DM Sans |
| Tamanho | 14px | 36px | 14px | 21px |
| Peso | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — | 0.1em | — |
| `text-transform` | uppercase | none | uppercase | none |

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Rótulos e textos | Framer Motion (`RevealOnScroll`) | on-scroll | `2.1s`; solução `delay 0.08` |

### 6. Responsividade
- **Desktop:** `flex-row` (cada coluna `md:w-1/2`), `gap-[5vw]`, `px-[5vw]`, `pt-[5vw]`.
- **Mobile:** `flex-col`, `gap-10`, `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/data/servicos.ts`, `src/components/ui/RevealOnScroll.tsx`.

---

# Seção 01b — Benefícios

> Condicional: só renderiza se `servico.beneficios.length > 0`.

### 1. Objetivo
Listar os benefícios concretos do serviço em cartões.

### 2. Copy / Textos

| Campo | `<h2>` | Item de benefício |
|---|---|---|
| Conteúdo | `Benefícios` (estrutural) | `servico.beneficios[]` (dados) |
| Elemento HTML | `h2` | `span` (dentro de `li`) |
| Classe | `.type-label` | `.type-body` |
| Família | DM Sans | DM Sans |
| Tamanho | 14px | 18px |
| Peso | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` (`text-gmt-text`) |
| `letter-spacing` | 0.1em | — |
| `text-transform` | uppercase | none |

### 3. Imagens / mídia
Nenhuma imagem. Cada benefício exibe o ícone **`Check`** (`lucide-react`, `size 18`, cor `text-gmt-accent` = `#2563eb`). Vetor (= `GL-05` na PARTE 4) → **Produzido**.

### 4. Botões / CTAs
Nenhum. Cada benefício é um cartão `border-gmt-border bg-gmt-bg-alt rounded-lg p-5`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cada cartão de benefício | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** grid `md:grid-cols-3`, `px-[5vw]`, `pt-[5vw]`.
- **Mobile:** `grid-cols-1`, `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/data/servicos.ts`.

---

# Seção 02 — O que inclui (funcionalidades)

### 1. Objetivo
Listar as funcionalidades concretas do serviço (e, para pacotes, repetir a solução como introdução).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` intro (só pacotes) | Funcionalidade |
|---|---|---|---|
| Conteúdo | `O que inclui` (estrutural) | `servico.solucao` (dados; só `tipo === "pacote"`) | `servico.funcionalidades[]` (dados) |
| Elemento HTML | `h2` | `p` | `span` (dentro de `li`) |
| Classe | `.type-label` | `.type-body` | `.type-body-lg` |
| Família | DM Sans | DM Sans | DM Sans |
| Tamanho | 14px | 18px | 21px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` (`text-gmt-text`) |
| `letter-spacing` | 0.1em | — | — |
| `text-transform` | uppercase | none | none |

> Lista com separadores `divide-y divide-gmt-border` + borda superior `border-t border-gmt-border`.

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cada funcionalidade | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** `flex-row` (rótulo `md:w-1/3`, lista `md:w-2/3`), `gap-[5vw]`, `px-[5vw]`, `pt-[8vw]`.
- **Mobile:** `flex-col`, `gap-8`, `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/data/servicos.ts`.

---

# Seção 03 — Como funciona (process cards)

### 1. Objetivo
Mostrar o processo GMT em 5 cards (01–05). O array `PROCESSO` é **estrutural/fixo** (institucional, igual para todos os serviços).

### 2. Copy / Textos

| Campo | `<h2>` | Número | Título do passo | Resumo |
|---|---|---|---|---|
| Conteúdo | `Como funciona` (estrutural) | `01`–`05` (estrutural) | Reunião inicial · Proposta personalizada · Planeamento estratégico · Execução & implementação · Acompanhamento & otimização | Texto descritivo de cada passo (estrutural) |
| Elemento HTML | `h2` | `span` | `h3` | `p` |
| Classe | `.type-label` | `font-mono` + `.type-body` | `.type-body-lg` | `.type-body` |
| Família | DM Sans | Mono sistema (`--font-mono`) | DM Sans | DM Sans |
| Tamanho | 14px | 18px | 21px | 18px |
| Peso | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-accent)` = `#2563eb` (`text-gmt-accent`) | `var(--gmt-text)` = `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — | — | — |
| `text-transform` | uppercase | none | none | none |

> Conteúdo dos 5 passos (array `PROCESSO`):
> 01 Reunião inicial · 02 Proposta personalizada · 03 Planeamento estratégico · 04 Execução & implementação · 05 Acompanhamento & otimização.

### 3. Imagens / mídia
Fundo do card resolvido por `getFamiliaProcessBg(servico.familia)` (`src/lib/media.ts`). Render `fill`, `opacity-20`, atrás do texto (`z-10`), `reveal={false}`. Cruzado com PLANO Tabela 4.2-B.

| ID | Quando (família) | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|---|
| AGP-F1 | F1 | Fundo card processo | 2:3 | 1200×1800 | `public/images/AGP-F1.webp` | **Produzido** |
| AGP-F2 | F2 | Fundo card processo | 2:3 | 1200×1800 | `public/images/AGP-F2.webp` | **Produzido** |
| AGP-F3 | F3 / MKT / AV | Fundo card processo | 2:3 | 1200×1800 | `public/images/AGP-F3.webp` | **Produzido** |
| AGP-F4 | F4 | Fundo card processo | 2:3 | 1200×1800 | `public/images/AGP-F4.webp` | **Produzido** |

> Card: `aspect-[3/4] md:aspect-[2/3]`, `rounded-2xl border border-gmt-border bg-white/50`.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Rótulo + cada card | Framer Motion (`RevealOnScroll`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** grid `lg:grid-cols-5`; card `md:aspect-[2/3]`; `px-[5vw]`, `pt-[8vw]`.
- **Tablet:** grid `sm:grid-cols-2`.
- **Mobile:** `grid-cols-1`; card `aspect-[3/4]`; `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/lib/media.ts`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`.

---

# Seção 04 — Casos de uso (Para quem é)

> Condicional: só renderiza se `servico.casosDeUso.length > 0`.

### 1. Objetivo
Indicar os perfis/segmentos para quem o serviço é indicado (tags).

### 2. Copy / Textos

| Campo | `<h2>` | Tag (caso de uso) |
|---|---|---|
| Conteúdo | `Para quem é` (estrutural) | `servico.casosDeUso[]` (dados) |
| Elemento HTML | `h2` | `span` |
| Classe | `.type-label` | `.tag-pill` |
| Família | DM Sans | DM Sans |
| Tamanho | 14px | `clamp(13px,0.9vw,15px)` |
| Peso | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `#000` (definido em `.tag-pill`) |
| `letter-spacing` | 0.1em | normal (`.tag-pill` reseta) |
| `text-transform` | uppercase | none (`.tag-pill` reseta) |

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
Tags pill (não-clicáveis): `.tag-pill` → fundo `rgb(255 255 255 / 0.8)`, texto `#000`, `border-radius 0.5vw`, `padding 0.4vw 1vw`, `backdrop-filter blur(8px)`. Sem hover definido.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cada tag | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** `flex-wrap gap-3`, `px-[5vw]`, `pt-[8vw]`.
- **Mobile:** `flex-wrap`, `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/data/servicos.ts`, classe `.tag-pill` em `src/styles/globals.css`.

---

# Seção 05 — Em prática (NARA)

> Condicional: só renderiza se o case NARA existir (`getCaseBySlug("nara")`).

### 1. Objetivo
Mostrar prova real de entrega (case NARA) ligada ao serviço.

### 2. Copy / Textos

| Campo | `<h2>` | Card NARA |
|---|---|---|
| Conteúdo | `Em prática` (estrutural) | nome/local/indústria/serviços/tags do NARA (via `PortfolioCard`) |
| Elemento HTML | `h2` | (ver PARTE 05/Home — `PortfolioCard`) |
| Classe | `.type-label` | — |
| Família | DM Sans | — |
| Tamanho | 14px | — |
| Peso | 400 | — |
| Cor da fonte | `#575757` (`text-gmt-muted`) | conforme `PortfolioCard` |
| `text-transform` | uppercase | — |

> Na Home, o showcase NARA usa `HomePortfolioRow` (sem tags). Em `/servicos/[slug]`, o conteúdo do card (h3 `.type-h3`, metadados `.type-body`, tags `.tag-pill`) é renderizado por `PortfolioCard`.

### 3. Imagens / mídia
`PF-01` (card NARA 3:4). Cruzado com PLANO Tabela 4.5.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| PF-01 | Card showcase NARA | 3:4 | 1200×1600 | `public/images/PF-01.webp` | **Produzido** |

> Cor de fallback = `nara.corPlaceholder` = `#134E4A` (`COR_PORTFOLIO`).

### 4. Botões / CTAs
Card NARA é um `Link` para `/portfolio/nara` (hover `opacity-90` + zoom da mídia).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Rótulo + card | Framer Motion (`RevealOnScroll`, embutido no `PortfolioCard`) | on-scroll | `2.1s` |

### 6. Responsividade
- **Desktop:** grid `md:grid-cols-2`, `px-[5vw]`, `pt-[8vw]`.
- **Mobile:** `grid-cols-1`, `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/components/ui/PortfolioCard.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`.

---

# Seção 06 — CTA final

### 1. Objetivo
Conversão (faixa preta `.section-cta`, centrada).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Quer este serviço no seu negócio?` (estrutural) | `Agende uma reunião gratuita e sem compromisso.` (estrutural) |
| Elemento HTML | `h2` | `p` |
| Classe | `.type-h3` | `.type-body` |
| Família | Host Grotesk | DM Sans |
| Tamanho | 36px | 18px |
| Peso | 400 | 400 |
| Cor da fonte | `#ffffff` (em `.section-cta`, regra `:where(.type-h3) → var(--gmt-text)` = `#ffffff`) | `#94a3b8` (`text-gmt-muted` redefinido na `.section-cta`) |
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
`src/app/servicos/[slug]/page.tsx`, classes `.btn-submit` e `.section-cta` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados no Detalhe de Serviço (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| Hero (overlay) | gradiente `from-black via-black/40 to-transparent`; textos `#ffffff` / `text-white/70` | Seção 00 |
| `.section-light` | bg `#ffffff`, text `#0a0a0a`, muted `#575757`, border `#dcdcdc` | wrapper Seções 01–05 |
| `--gmt-text` | `#0a0a0a` | problema (h3), funcionalidades, títulos de passo, benefícios |
| `--gmt-text-muted` | `#575757` | rótulos de seção, solução, resumos |
| `--gmt-accent` | `#2563eb` | ícone `Check` (benefícios), número do passo |
| `--gmt-bg-alt` | `#f5f5f5` | cartões de benefício (`bg-gmt-bg-alt`) |
| `--gmt-border` | `#dcdcdc` | bordas de cartões/listas |
| `.tag-pill` | fundo `rgb(255 255 255 / 0.8)`, texto `#000` | Seção 04 (casos de uso) |
| Cores de família (fallback hero/processo) | F1 `#92400E` · F2 `#1E3A5F` · F3 `#3B0764` · F4 `#0F172A` · MKT/AV `#1A3A2A` | Seções 00 e 03 |
| `COR_PORTFOLIO` | `#134E4A` | card NARA (Seção 05) |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seção 06 |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por esta página — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*


---
## PORTFOLIO · LISTAGEM (/portfolio)
---

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


---
## PORTFOLIO · DETALHE (/portfolio/[slug])
---

# GUIA DE EDIÇÃO — PARTE 06 · PORTFOLIO · DETALHE (`/portfolio/[slug]`)

> Documentação completa do **template dinâmico** de página de case.
>
> **Arquivo principal:** `src/app/portfolio/[slug]/page.tsx`
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
| Rota | `/portfolio/[slug]` (rota dinâmica) |
| Arquivo | `src/app/portfolio/[slug]/page.tsx` |
| Componentes | `RevealOnScroll`, `PlaceholderMedia` |
| Dados | `portfolio`, `getCaseBySlug` (`src/data/portfolio.ts`) |
| Geração estática | `generateStaticParams()` → 1 página por case (**atualmente 1: NARA**); `generateMetadata()` (title = `caso.nome`, description = `caso.resumo`) |
| 404 | `notFound()` quando o slug não existe |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Ficha lateral (sticky) + galeria
2. Seção 02 — Próximo projeto
3. Seção 03 — CTA final

> A página **não** usa o wrapper `.section-light`; as Seções 01 e 02 ficam sobre o fundo padrão (`--gmt-bg` = `#ffffff`).

---

## Dados vs. estrutura do template

| Origem | Conteúdo |
|---|---|
| **Dados — `portfolio.ts` (por case)** | `nome` (h1), `tags[]`, `resumo`, `local`, `industria`, `servicos`, `galeria[]` (ids + proporção + legenda), `corPlaceholder` |
| **Estrutural — fixo no template** | Link `← Portfolio`, rótulos `Localização`/`Indústria`/`Serviços`, botão `Falar sobre um projeto`, Seção 02 "Próximo projeto" (2 placeholders fixos "Em breve"), copy do CTA final |

---

# Seção 01 — Ficha lateral (sticky) + galeria

### 1. Objetivo
Layout split: ficha do case numa coluna sticky à esquerda (nome, tags, resumo, metadados, CTA) + galeria vertical de imagens à direita.

### 2. Copy / Textos

| Campo | Link voltar | `<h1>` | Tag | `<p>` resumo | `<dt>` rótulo | `<dd>` valor | Botão CTA |
|---|---|---|---|---|---|---|---|
| Conteúdo | `← Portfolio` (estrutural) | `caso.nome` (dados; ex.: `NARA`) | `caso.tags[]` (dados) | `caso.resumo` (dados) | `Localização` / `Indústria` / `Serviços` (estrutural) | `caso.local` / `caso.industria` / `caso.servicos` (dados) | `Falar sobre um projeto` (estrutural) |
| Elemento HTML | `a` (Link) | `h1` | `span` | `p` | `dt` | `dd` | `a` (Link) |
| Classe | `.type-label` | `.type-h2` | `.type-body` (em pill `bg-gmt-bg-alt`) | `.type-body-lg` | `.type-label` | `.type-body` | `.type-body` + `.type-medium` |
| Família | DM Sans | Host Grotesk | DM Sans | DM Sans | DM Sans | DM Sans | DM Sans |
| Tamanho | 14px | `clamp(42px,6vw,72px)` | 18px | 21px | 14px | 18px | 18px |
| Peso | 400 | 400 | 400 | 400 | 400 | 400 | **500** |
| Cor da fonte | `#575757` (`text-gmt-muted`, hover `#0a0a0a`) | `var(--gmt-text)` = `#0a0a0a` | `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) | `#575757` (`text-gmt-muted`) | `#0a0a0a` (`text-gmt-text`) | `#ffffff` (`text-white`) |
| `letter-spacing` | 0.1em | — | — | — | 0.1em | — | — |
| `text-transform` | uppercase | none | none | none | uppercase | none | none |

> Valores do NARA (de `portfolio.ts`): `local` = `Portugal · Internacional`; `industria` = `Tecnologia`; `servicos` = `Website + IA`; `tags` = `Branding`, `Website`, `Chatbots`, `Campanhas`. Tag pill usa `rounded-lg bg-gmt-bg-alt px-3 py-1` (não a classe `.tag-pill`).

### 3. Imagens / mídia
Galeria de `caso.galeria` (NARA = 10 imagens). Render `rounded-lg md:rounded-[1vw]`, `sizes="(max-width: 768px) 100vw, 60vw"`, `reveal={false}`. A proporção de cada item vem de `media-spec.ts` (a `proporcao` no dado é usada só na legenda). Cor de fallback `caso.corPlaceholder` = `#134E4A`. Cruzado com PLANO Tabela 4.5.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| PF-03 | Galeria — capa (1ª) | 16:9 | 2560×1440 | `public/images/PF-03.webp` | **Produzido** |
| PF-04 | Galeria — tela 1 | 4:3 | 1600×1200 | `public/images/PF-04.webp` | **Produzido** |
| PF-05 | Galeria — tela 2 | 4:3 | 1600×1200 | `public/images/PF-05.webp` | **Produzido** |
| PF-06 | Galeria — tela 3 | 4:3 | 1600×1200 | `public/images/PF-06.webp` | **Produzido** |
| PF-07 | Galeria — tela 4 | 4:3 | 1600×1200 | `public/images/PF-07.webp` | **Produzido** |
| PF-08 | Galeria — tela 5 | 4:3 | 1600×1200 | `public/images/PF-08.webp` | **Produzido** |
| PF-09 | Galeria — tela 6 | 4:3 | 1600×1200 | `public/images/PF-09.webp` | **Produzido** |
| PF-10 | Galeria — tela 7 | 4:3 | 1600×1200 | `public/images/PF-10.webp` | **Produzido** |
| PF-11 | Galeria — tela 8 | 4:3 | 1600×1200 | `public/images/PF-11.webp` | **Produzido** |
| PF-12 | Galeria — tela 9 | 4:3 | 1600×1200 | `public/images/PF-12.webp` | **Produzido** |

### 4. Botões / CTAs
"Falar sobre um projeto" — classes inline `.type-body` + `.type-medium` + `mt-8 inline-flex w-full justify-center rounded-lg bg-gmt-accent px-6 py-3 text-white`.
- Fundo `--gmt-accent` = `#2563eb` · Texto `#ffffff` · `border-radius 0.5rem` (`rounded-lg`) · full-width (`w-full`).
- Hover: `bg-gmt-accent-2` = `#7c3aed`.
- Link para `/contacto`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Link, h1, tags, resumo, metadados, CTA | Framer Motion (`RevealOnScroll`) | on-scroll | `2.1s`, ease `[0.22,1,0.36,1]`; delays escalonados `0.08`/`0.16`/`0.24` |
| Cada imagem da galeria | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** `flex-row`; ficha `md:sticky md:top-24 md:w-2/5`; galeria `md:w-3/5` com `gap-[1.5vw]`; `pt-[11vw]`, `px-[5vw]`.
- **Tablet/Mobile:** `flex-col` (ficha não-sticky, acima da galeria); `gap-[3vw]`/`gap-4`; `pt-28`, `px-5`.

### 7. Arquivos relacionados
`src/app/portfolio/[slug]/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`, `src/data/media-spec.ts`, classe `.type-medium` em `src/styles/globals.css`.

---

# Seção 02 — Próximo projeto

### 1. Objetivo
Navegação para próximos cases — atualmente 2 placeholders fixos "Em breve" (não dependem dos dados).

### 2. Copy / Textos

| Campo | `<h2>` | `<h3>` | `<p>` |
|---|---|---|---|
| Conteúdo | `Próximo projeto` (estrutural) | `Em breve` (estrutural) | `Novo case em produção` (estrutural) |
| Elemento HTML | `h2` | `h3` | `p` |
| Classe | `.type-label` | `.type-h3` | `.type-body` |
| Família | DM Sans | Host Grotesk | DM Sans |
| Tamanho | 14px | 36px | 18px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — | — |
| `text-transform` | uppercase | none | none |

> As 2 linhas são geradas por `[0, 1].map(...)` (fixas no template), com `opacity-50`.

### 3. Imagens / mídia
Thumb `PF-02` (id fixo no código) por linha placeholder. Render `w-20 md:w-28`, `rounded-md`, `sizes="112px"`, `reveal={false}`, cor de fallback `#1E293B`. Corresponde a `PF-SLOT-N` na PARTE 4.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| PF-02 (reutilizado) | Próximo projeto — placeholder | 9:16 | 1080×1920 | `public/images/PF-02.webp` (existe, mas renderizado em cinza com cor `#1E293B`) | **Lacuna** (slot de navegação `PF-SLOT-N` — depende de novos cases) |

> Nota: embora `PF-02.webp` exista, estas linhas são placeholders de **lacuna** ("Em breve") — não representam um case real navegável.

### 4. Botões / CTAs
Nenhum. As linhas são `<div>` não-clicáveis (`opacity-50`).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cada linha placeholder | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** linhas `py-8`, `gap-[2vw]`; thumb `md:w-28`; `mt-[8vw]`, `px-[5vw]`.
- **Mobile:** thumb `w-20`, `gap-5`; `mt-20`, `px-5`.

### 7. Arquivos relacionados
`src/app/portfolio/[slug]/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`.

---

# Seção 03 — CTA final

### 1. Objetivo
Conversão (faixa preta `.section-cta`, centrada).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Pronto para automatizar o seu negócio?` (estrutural) | `Reunião gratuita e sem compromisso.` (estrutural) |
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
"Agendar agora" — classe `.btn-submit` (link para `/contacto`).
- Fundo `rgb(255 255 255 / 0.7)` · Texto `#000` · `border-radius 9999px` · `padding 0.75rem 2rem` · DM Sans 18px peso 500.
- Hover: `bg rgb(255 255 255 / 0.85)` + `scale(1.02)`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| h2, p e botão | Framer Motion (`RevealOnScroll`) | on-scroll | stagger (`delay 0.08`/`0.16`) |

### 6. Responsividade
- **Todos:** centrado, h2 `max-w-2xl`.
- **Desktop:** `px-[5vw] py-[8vw]`. **Mobile:** `px-5 py-20`.

### 7. Arquivos relacionados
`src/app/portfolio/[slug]/page.tsx`, classes `.btn-submit` e `.section-cta` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados no Detalhe de Case (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `--gmt-bg` | `#ffffff` | fundo das Seções 01–02 |
| `--gmt-bg-alt` | `#f5f5f5` | pills de tag da ficha (`bg-gmt-bg-alt`) |
| `--gmt-text` | `#0a0a0a` | h1, h3, tags, valores `<dd>` |
| `--gmt-text-muted` | `#575757` | link voltar, resumo, rótulos `<dt>`, "Próximo projeto" |
| `--gmt-accent` | `#2563eb` | fundo do botão "Falar sobre um projeto" |
| `--gmt-accent-2` | `#7c3aed` | hover do botão da ficha |
| `--gmt-border` | `#dcdcdc` | divisórias (`border-t`/`border-b border-gmt-border`) |
| `COR_PORTFOLIO` | `#134E4A` | fallback da galeria (PF-03..12) |
| fallback "em breve" | `#1E293B` | thumbs da Seção 02 |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seção 03 |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por esta página — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*


---
## CONTACTO (/contacto)
---

# GUIA DE EDIÇÃO — PARTE 07 · CONTACTO (`/contacto`)

> Documentação completa da página Contacto para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/contacto/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/contacto` |
| Arquivo | `src/app/contacto/page.tsx` |
| Componentes | `RevealOnScroll`, `ContactForm` (`src/components/ui/ContactForm.tsx`), ícones `Mail`, `Phone`, `Link2`, `MapPin` (`lucide-react`) |
| Dados | array `CANAIS` no próprio arquivo; arrays `SERVICOS_INTERESSE` e `CAMPOS` em `ContactForm.tsx` |
| Metadata | `title: "Contacto"`; `description` com email/WhatsApp/LinkedIn + Lisboa |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Cabeçalho + canais + formulário (split)
2. Seção 02 — CTA final

> A página é **puramente tipográfica** (sem assets de imagem). O PLANO prevê fundo decorativo opcional `CON-01`, mas **não é renderizado** — ver Seção 01 ▸ mídia.

---

# Seção 01 — Cabeçalho + canais + formulário (split)

### 1. Objetivo
Layout split: à esquerda o cabeçalho + canais de contacto; à direita o formulário. Conversão direta + pré-qualificação.

### 2. Copy / Textos

**Coluna esquerda — cabeçalho e canais:**

| Campo | Label | `<h1>` | `<p>` | Canal label | Canal valor |
|---|---|---|---|---|---|
| Conteúdo | `Contacto` | `Vamos conversar` | `Agende uma reunião gratuita e sem compromisso. Conte-nos sobre o seu negócio e desenhamos o plano certo para si.` | `Email` · `WhatsApp / Telefone` · `LinkedIn` · `Localização` | (ver lista abaixo) |
| Elemento HTML | `p` | `h1` | `p` | `span` | `span` |
| Classe | `.type-label` | `.type-h2` | `.type-body-lg` | `.type-label` | `.type-body` |
| Família | DM Sans | Host Grotesk | DM Sans | DM Sans | DM Sans |
| Tamanho | 14px | `clamp(42px,6vw,72px)` | 21px | 14px | 18px |
| Peso | 400 | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) | `#575757` (`text-gmt-muted`) | `#0a0a0a` (`text-gmt-text`) |
| `letter-spacing` | 0.1em | — | — | 0.1em | — |
| `text-transform` | uppercase | none | none | uppercase | none |

Canais (array `CANAIS`):
- **Email** — `contato@phellipeoliveira.org` (`mailto:contato@phellipeoliveira.org`)
- **WhatsApp / Telefone** — `+351 913 628 211` (`tel:+351913628211`)
- **LinkedIn** — `linkedin.com/in/phellipeoliveira-org` (`https://linkedin.com/in/phellipeoliveira-org/`, `target="_blank"`, `rel="noopener noreferrer"`)
- **Localização** — `Lisboa, Portugal` (sem link — `href: undefined`)

**Coluna direita — formulário (`ContactForm.tsx`):**

| Campo | Labels de input | Texto digitado | `<h3>` checkboxes | Opções de checkbox | Label do textarea |
|---|---|---|---|---|---|
| Conteúdo | `Nome *` · `Email *` · `Telefone` · `Empresa` | (input do utilizador) | `Serviços de interesse` | (8 opções, ver abaixo) | `Conte-nos sobre o seu projeto *` |
| Elemento HTML | `label` | `input` | `h3` | `span` (em `button`) | `label` |
| Classe | `.type-body` (flutuante) | `.input-gmt` + `.type-body` | `.type-label` | `.type-body` | `.type-body` (flutuante) |
| Família | DM Sans | DM Sans | DM Sans | DM Sans | DM Sans |
| Tamanho | 18px → `14px` (flutuante ativa) | 18px | 14px | 18px | 18px → `14px` (flutuante) |
| Peso | 400 | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) | inativo `#575757` (`text-gmt-muted opacity-70`) / ativo `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | — | — | 0.1em | — | — |
| `text-transform` | none | none | uppercase | none | none |

Opções de "Serviços de interesse" (array `SERVICOS_INTERESSE`): Automação & IA · Criação de Conteúdo · Publicidade Digital · Branding & Estratégia · Websites · Inteligência Artificial · Analytics & Otimização · Pacotes de Marketing.

> Inputs com `placeholder=" "` + label flutuante via peer-selector (`peer-focus`/`peer-[:not(:placeholder-shown)]` → `top-2` e `text-[14px]`). Existe um campo **honeypot** oculto `_hp_website` (anti-spam, `className="hidden"`).

### 3. Imagens / mídia
Nenhuma imagem renderizada. A página é puramente tipográfica.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| CON-01 | Fundo decorativo (Contacto) — bg da seção | 16:9 | 2560×1440 | `public/images/CON-01.webp` (existe) | **Lacuna de uso** — asset existe mas **não é referenciado** em `contacto/page.tsx` (slot decorativo OPCIONAL no PLANO Tabela 4.1) |

> Ícones dos canais: `Mail`, `Phone`, `Link2`, `MapPin` (`lucide-react`, `size 18`, `strokeWidth 1.5`, cor `text-gmt-text` = `#0a0a0a`) em caixa `border-gmt-border p-2.5`. Vetor (= `GL-05` na PARTE 4) → **Produzido**. Nota: usa-se `Link2` para LinkedIn porque `Linkedin` não existe nesta versão de `lucide-react`.

### 4. Botões / CTAs

**Canais de contacto** — `<a>` (quando há `href`), wrapper `hover:opacity-80`. Sem fundo; cor texto conforme tabela acima.

**Formulário (`ContactForm.tsx`):**
- **Checkboxes "Serviços de interesse"** (8 `<button type="button">` toggle, `aria-pressed`): círculo `size-6 rounded-full border`. Inativo: `border-gmt-border` (sem preenchimento). Ativo: `border-gmt-accent bg-gmt-accent text-white` (`#2563eb` fundo, `#ffffff` ícone `Check` size 12). Wrapper `opacity-80 → hover:opacity-100`.
- **Botão submit** — `Enviar mensagem` → classe `.btn-submit` (`group`).
  - Fundo `rgb(255 255 255 / 0.7)` · Texto `#000` · `border-radius 9999px` · `padding 0.75rem 2rem` · DM Sans 18px peso 500.
  - Hover: `bg rgb(255 255 255 / 0.85)` + `scale(1.02)`. Disabled: `opacity 0.6`.
  - Estado `submitting`: ícone `Loader2` (animação `animate-spin`) + texto `A enviar…`. Estado normal: texto + seta `→` (`group-hover:translate-x-1`).
- **Estado de sucesso** (substitui o form): `<h3>` `Mensagem enviada` (`.type-h3`, `#0a0a0a`) + `<p>` `Obrigado pelo contacto. Responderemos em breve.` (`.type-body`, `#575757`).

> Submissão é **estática** (`console.log`, sem backend). Validação nativa via `form.checkValidity()`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cabeçalho, canais, form | Framer Motion (`RevealOnScroll`) | on-scroll | `2.1s`, ease `[0.22,1,0.36,1]`; canais com stagger `delay = i*0.08`; form `delay 0.08` |
| Labels flutuantes | CSS (peer-selector) | on-focus / preenchido | `transition-all 200ms` (sobe + `14px`) |
| Checkbox (círculo) | CSS | on-click | `transition-colors 300ms` |
| Validação falhada | CSS keyframe `.form-shake` | on-submit inválido | `0.4s` (translateX ±4px) |
| Durante envio | CSS `.form-fade-out--hidden` | submitting | `opacity 0.3`, `pointer-events none` |
| Sucesso | CSS `.form-success` (`@keyframes form-fade-in`) | on-success | `0.5s` fade-in + `translateY 8px→0` |
| Ícone `Loader2` | CSS (`animate-spin`) | submitting | rotação contínua |

### 6. Responsividade
- **Desktop:** `flex-row`; coluna info `md:w-2/5`, coluna form `md:w-3/5`; `md:min-h-[70vh]`; campos do form `md:grid-cols-2`; checkboxes `md:grid-cols-2`; `pt-[6vw]`, `px-[5vw]`, `gap-[5vw]`.
- **Tablet:** mantém grids `md:grid-cols-2` a partir de `md`.
- **Mobile:** `flex-col`; campos e checkboxes `grid-cols-1`; `pt-28`, `pb-16`, `px-5`, `gap-12`.

### 7. Arquivos relacionados
`src/app/contacto/page.tsx`, `src/components/ui/ContactForm.tsx`, `src/components/ui/RevealOnScroll.tsx`, classes `.input-gmt`/`.btn-submit`/`.form-shake`/`.form-success`/`.form-fade-out*` em `src/styles/globals.css`.

---

# Seção 02 — CTA final

### 1. Objetivo
Conversão alternativa por telefone (faixa preta `.section-cta`, centrada).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Preferimos falar pessoalmente?` | `Agende uma reunião gratuita — respondemos em 24 horas.` |
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
"Ligar agora" — classe `.btn-submit` (link `tel:+351913628211`).
- Fundo `rgb(255 255 255 / 0.7)` · Texto `#000` · `border-radius 9999px` · `padding 0.75rem 2rem` · DM Sans 18px peso 500.
- Hover: `bg rgb(255 255 255 / 0.85)` + `scale(1.02)`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| h2, p e botão | Framer Motion (`RevealOnScroll`) | on-scroll | stagger (`delay 0.08`/`0.16`) |

### 6. Responsividade
- **Todos:** centrado, h2 `max-w-2xl`.
- **Desktop:** `px-[5vw] py-[8vw]`. **Mobile:** `px-5 py-20`.

### 7. Arquivos relacionados
`src/app/contacto/page.tsx`, classes `.btn-submit` e `.section-cta` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados no Contacto (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `--gmt-bg` | `#ffffff` | fundo da Seção 01 |
| `--gmt-bg-alt` | `#f5f5f5` | fundo dos inputs/textarea (`bg-gmt-bg-alt`) |
| `--gmt-text` | `#0a0a0a` | h1, valores dos canais, texto digitado, opção ativa |
| `--gmt-text-muted` | `#575757` | labels, descrição, rótulos de canal, labels do form |
| `--gmt-border` | `#dcdcdc` | bordas de inputs, caixas de ícone, checkbox inativo |
| `--gmt-accent` | `#2563eb` | foco dos inputs (`focus:border-gmt-accent`), checkbox ativo |
| `.btn-submit` | fundo `rgb(255 255 255 / 0.7)`, texto `#000` | botão "Enviar mensagem" e "Ligar agora" |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seção 02 |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por esta página — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*


---

---
## COMPONENTES GLOBAIS
---

# GUIA DE EDIÇÃO — PARTE 08 · COMPONENTES GLOBAIS

> Documentação dos componentes globais (não-páginas) usados em todo o site.
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026.

---

## Montagem no layout

Em `src/app/layout.tsx`, dentro de `<body className="flex min-h-full flex-col bg-gmt-bg text-gmt-text">`:

```
<SmoothScroll />        → inicializa Lenis (sem UI)
<Navbar />              → cabeçalho fixo
<main class="prose prose-gmt max-w-none flex-1">{children}</main>
<Footer />              → rodapé com grid de links
<HomeLanternSection />  → Lanterna GMT (só na Home, após o Footer)
<FloatingCTA />         → botão flutuante "Agendar reunião"
```

Fontes globais (`layout.tsx`): **DM Sans** (`--font-dmsans`, pesos 400/500) e **Host Grotesk** (`--font-hostgrotesk`, pesos 300/400/500/600/700/800), aplicadas via `--font-sans`/`--font-display`. Favicon/apple-icon = `/images/GL-02.webp`.

---

# Componente: Navbar (`src/components/ui/Navbar.tsx`)

### 1. Objetivo
Cabeçalho fixo global: logo (esquerda), pill de navegação central (desktop), hamburger (mobile). Adapta cores conforme hero escuro / scroll.

### 2. Copy / Textos

| Campo | Logo | Links de navegação | Link CTA (menu mobile) |
|---|---|---|---|
| Conteúdo | `GMT` (via `GmtLogo`) | `Sobre` · `Serviços` · `Portfolio` · `Contacto` (array `NAV_LINKS`) | `Agendar reunião →` |
| Elemento HTML | `span` (em `Link`) | `a` (Link) | `a` (Link) |
| Classe | `.gmt-brand` + `.gmt-brand--navbar` | `.type-label` | `.type-label` |
| Família | Host Grotesk | DM Sans | DM Sans |
| Tamanho | `clamp(18px,2.8vw,28px)` | 14px | 14px |
| Peso | **800** (`--font-weight-brand`) | 400 | 400 |
| Cor da fonte | `#ffffff` (`logo-gmt--on-dark`, sempre `tone="on-dark"`) | pill escuro `text-white/70 → #fff`; pill claro `#575757 (text-gmt-muted) → #0a0a0a` | `rgba(255,255,255,0.8)` (`text-white/80`) → `#fff` |
| `letter-spacing` | **0.02em** (via `.gmt-brand`) | 0.1em | 0.1em |
| `text-transform` | uppercase | uppercase | uppercase |

### 3. Imagens / mídia
Logo é **texto** (`GmtLogo`), não imagem. `GL-01` (logo 7:2) está produzido em `public/images/GL-01.webp` mas **não é usado** pela Navbar.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| GL-01 | Navbar logo (PLANO) | 7:2 | 1400×400 | `public/images/GL-01.webp` | **Produzido**, mas **não referenciado** (logo é texto) |

Ícones: `Menu` / `X` (`lucide-react`, `size 20`) no hamburger.

### 4. Botões / CTAs
- **Logo**: `Link` para `/` com container glass `bg-black/55 backdrop-blur-md rounded-lg` (`px-3 py-2`); glass com `opacity` 0→1 controlada por `logoGlassVisible`.
- **Hamburger** (`<button>`, `<md`): `h-10 w-10 rounded-lg backdrop-blur-md`. Pill escuro → `bg-white/10 text-white`; pill claro → `bg-black/8 text-gmt-text`.
- **Pill de navegação** (`<nav>`, desktop): `rounded-full border px-7 py-2.5 backdrop-blur-md`. Escuro → `border-white/20 bg-black/30`; claro → `border-black/8 bg-white/88 shadow-sm`.
- **CTA mobile** "Agendar reunião →": `rounded-full border border-white/30 px-5 py-2.5 text-white/80`, hover `border-white/60 text-white`.

> O CTA "Agendar reunião" foi **removido da navbar desktop** e substituído pelo `FloatingCTA` global (existe apenas dentro do menu mobile aberto).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Estado `scrolled` | Framer Motion (`useScroll` + `useMotionValueEvent`) | on-scroll | `scrolled = scrollY > 60` |
| Cores do pill / hamburger | CSS | mudança de estado | `transition-all 500ms` (pill), `300ms` (hamburger/links) |
| Glass do logo | CSS | scroll / tipo de página | `transition-opacity 500ms` |
| Menu mobile | render condicional (`open`) | on-click | aparece/desaparece (sem transição declarada) |

Lógica de tema:
- `isHeroPageDark(pathname)` = `true` em `/` e `/servicos/[slug]` (heroes escuros).
- `pillDark = isHeroPageDark && !scrolled`.
- `logoGlassVisible = scrolled || !isHeroPageDark` (na Home só aparece após scroll).

### 6. Responsividade
- **Desktop (`md+`):** pill central visível (`hidden ... md:flex`); altura `h-20`, `px-[3vw]`.
- **Mobile (`<md`):** pill oculto; hamburger visível (`md:hidden`); menu dropdown `bg-black/90 backdrop-blur-xl`; altura `h-16`, `px-5`.

### 7. Arquivos relacionados
`src/components/ui/Navbar.tsx`, `src/components/ui/GmtLogo.tsx`, `src/lib/utils.ts` (`cn`), classes `.gmt-brand`/`.gmt-brand--navbar`/`.logo-gmt--on-dark` em `src/styles/globals.css`.

---

# Componente: FloatingCTA (`src/components/ui/FloatingCTA.tsx`)

### 1. Objetivo
Botão flutuante global "Agendar reunião" que aparece após sair do hero e some perto do footer.

### 2. Copy / Textos

| Campo | Botão |
|---|---|
| Conteúdo | `Agendar reunião` + ícone `ArrowRight` |
| Elemento HTML | `a` (Link) |
| Classe | utilitárias inline `text-sm font-medium tracking-wide` |
| Família | DM Sans (`--font-sans`, herdada) |
| Tamanho | `text-sm` = 14px (0.875rem) |
| Peso | 500 (`font-medium`) |
| Cor da fonte | `#ffffff` (`text-white`) |
| `letter-spacing` | `tracking-wide` (0.025em) |
| `text-transform` | none |

### 3. Imagens / mídia
Nenhuma. Ícone `ArrowRight` (`lucide-react`, `size 14`). **Não identificado no projeto** (sem criativo).

### 4. Botões / CTAs
"Agendar reunião" (link `/contacto`):
- Fundo `rgba(0,0,0,0.8)` (`bg-black/80`) · Texto `#ffffff` · `backdrop-blur-md` · `rounded-full` · `px-6 py-3.5`.
- Hover: `bg-black` (`#000000`) + ícone `ArrowRight` com `translate-x-0.5`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Entrada/saída | Framer Motion (`AnimatePresence`) | scroll (threshold) | `0.35s`, ease `[0.16,1,0.3,1]`, `opacity 0↔1` + `y 14↔0` |
| Ícone | CSS | on-hover | `translate-x-0.5`, 300ms |

Lógica de visibilidade (listener de `scroll`): `pastHero = scrollY > viewportHeight * 0.8`; `nearFooter = scrollY + viewportHeight >= pageHeight - 220`; **visível** = `pastHero && !nearFooter`.

### 6. Responsividade
Posição fixa idêntica em todos os tamanhos: `fixed bottom-8 left-1/2 z-[60] -translate-x-1/2`. Wrapper `pointer-events-none`; o `Link` restaura `pointer-events-auto`.

### 7. Arquivos relacionados
`src/components/ui/FloatingCTA.tsx`.

---

# Componente: Footer (`src/components/ui/Footer.tsx`)

### 1. Objetivo
Rodapé global: logo, grid de 3 colunas de navegação (gerado a partir dos dados) e barra de copyright. Inclui textura de fundo.

### 2. Copy / Textos

| Campo | Logo | Título de coluna | Links | Copyright |
|---|---|---|---|---|
| Conteúdo | `GMT` (via `GmtLogo asLink`) | `Automação & IA` · `Marketing Digital` · `Empresa` | nomes dos serviços/páginas | `© 2026 Growth Marketing Technology · Lisboa, Portugal` |
| Elemento HTML | `span` (em Link) | `h3` | `a` (Link) | `p` |
| Classe | `.gmt-brand` + `.gmt-brand--navbar` | `.type-label` | `.type-body` | `.type-label normal-case tracking-normal` |
| Família | Host Grotesk | DM Sans | DM Sans | DM Sans |
| Tamanho | `clamp(18px,2.8vw,28px)` | 14px | 18px | 14px |
| Peso | **800** | 400 | 400 | 400 |
| Cor da fonte | `#ffffff` (`logo-gmt--on-dark`) | `rgba(182,182,182,0.8)` (`text-gmt-muted` na `.section-footer`) | `text-gmt-muted` → hover `#ffffff` (`text-gmt-text`) | `rgba(182,182,182,0.8)` (`text-gmt-muted`) |
| `letter-spacing` | **0.02em** | 0.1em | — | normal (`tracking-normal`) |
| `text-transform` | uppercase | uppercase | none | `normal-case` |

Conteúdo das colunas:
- **Automação & IA** — os 15 `agentes` (links `/servicos/{slug}`).
- **Marketing Digital** — os 3 `pacotes` + `Todos os serviços` (`/servicos`).
- **Empresa** — `Sobre` · `Portfolio` · `Contacto`.

### 3. Imagens / mídia
Cruzado com PLANO Tabela 4.6.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| GL-03 | Textura de secção (fundo do footer) | 16:9 | 2560×1440 | `public/images/GL-03.webp` | **Produzido** |

> Render via `PlaceholderMedia` `id="GL-03"`, `opacity-15`, `pointer-events-none absolute inset-0`, `sizes="100vw"`. Cor de fallback `#101010`.

### 4. Botões / CTAs
Sem botões — apenas links de texto (`.type-body`, hover para `#ffffff`). Logo é `Link` para `/`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cor dos links | CSS | on-hover | `transition-colors 300ms` |

Sem reveal on-scroll neste componente.

### 6. Responsividade
- **Desktop (`md+`):** grid `md:grid-cols-3`; `px-[5vw]`.
- **Mobile:** grid `grid-cols-1`; `px-5`. Margem `my-[10vw]`; padding interno `py-16`.

### 7. Arquivos relacionados
`src/components/ui/Footer.tsx`, `src/components/ui/GmtLogo.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/servicos.ts` (`agentes`, `pacotes`), classe `.section-footer` em `src/styles/globals.css`.

---

# Componente: HomeLanternSection (`src/components/home/HomeLanternSection.tsx`)

### 1. Objetivo
Wrapper client-side que renderiza a Lanterna GMT **apenas na Home** (`pathname === "/"`), posicionada no layout global **após** o `Footer`.

### 2. Montagem
- Importado em `src/app/layout.tsx`, imediatamente após `<Footer />`.
- Delega para `GMTLightFooter`.

### 7. Arquivos relacionados
`src/app/layout.tsx`, `src/components/home/HomeLanternSection.tsx`, `src/components/ui/GMTLightFooter.tsx`.

---

# Componente: GMTLightFooter (`src/components/ui/GMTLightFooter.tsx`)

### 1. Objetivo
Secção decorativa de branding na Home: "GMT" gigante revelado por um foco de luz que segue o cursor. **Última secção visual da Home**, após o Footer Navigation. Sem links nem CTAs.

### 2. Copy / Textos

| Campo | Texto (2 camadas sobrepostas, `aria-hidden`) |
|---|---|
| Conteúdo | `GMT` |
| Elemento HTML | `p` |
| Classe | `.gmt-brand` + `.gmt-brand--footer` |
| Família | Host Grotesk (`--font-display`) |
| Tamanho | `clamp(8rem, 33vw, 36rem)` |
| Peso | **800** (`--font-weight-brand`) |
| Cor da fonte | camada base `#111111`; camada reveal `#d4d4d4` |
| `letter-spacing` | **0.02em** |
| `text-transform` | uppercase |
| `transform` | `scaleX(1.03)`, `transform-origin: center` |

> `line-height: 0.85` (variante `--footer`). Fundo da secção `#000000` (`bg-black`).

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Foco de luz (reveal do texto) | CSS `mask-image` (radial) + JS `requestAnimationFrame` | on-hover (movimento do cursor) | `radial-gradient circle 20vw` em `var(--mx)/var(--my)`; atualização sem re-render React |
| Opacidade do reveal | CSS transition | on-enter / on-leave | `0.5s ease` |

Touch (`hover: none, pointer: coarse`): iluminação estática centrada (`opacity 0.55`). **Não** usa Framer Motion.

### 6. Responsividade
- **Desktop:** cursor-follow ativo; `md:py-20`.
- **Mobile/touch:** fallback estático centrado; `py-12`. Texto fluido por `clamp()`/`vw`.

### 7. Arquivos relacionados
`src/components/home/HomeLanternSection.tsx`, `src/components/ui/GMTLightFooter.tsx`, `src/app/layout.tsx`.

---

# Componente: SectionLabel (`src/components/ui/SectionLabel.tsx`)

### 1. Objetivo
Rótulo discreto de secção (topo esquerdo), usado na Home para "O que fazemos", "Por que a GMT" e "Trabalhos recentes".

### 2. Copy / Textos
| Campo | Valor |
|---|---|
| Classe | `.section-label` + `.section-label--on-light` ou `--on-dark` |
| Família | DM Sans |
| Tamanho | **12px** (`--type-section-label`) |
| Peso | 500 |
| `letter-spacing` | 0.14em |
| `text-transform` | uppercase |
| Cor (`on-light`) | `#575757` (`--gmt-text-muted`) |
| Cor (`on-dark`) | `rgba(255,255,255,0.55)` |

Envolve `RevealOnScroll` para animação on-scroll.

### 7. Arquivos relacionados
`src/components/ui/SectionLabel.tsx`, classes `.section-label*` em `src/styles/globals.css`.

---

# Componente: GmtLogo (`src/components/ui/GmtLogo.tsx`)

### 1. Objetivo
Render do logo textual "GMT" reutilizável (navbar e footer), com variação de tom claro/escuro.

### 2. Copy / Textos

| Campo | Marca |
|---|---|
| Conteúdo | `GMT` |
| Elemento HTML | `span` (ou dentro de `Link` se `asLink`) |
| Classe | `.gmt-brand` + `.gmt-brand--navbar` + `logo-gmt--on-light` / `logo-gmt--on-dark` |
| Família | Host Grotesk (`--font-display`) |
| Tamanho | `clamp(18px,2.8vw,28px)` |
| Peso | **800** (`--font-weight-brand`) |
| Cor da fonte | `on-light` → `#0a0a0a`; `on-dark` → `#ffffff` |
| `letter-spacing` | **0.02em** |
| `transform` | `scaleX(1.03)`, `transform-origin: center` |
| `text-transform` | uppercase |

### Props
| Prop | Tipo | Default | Efeito |
|---|---|---|---|
| `tone` | `"on-light" \| "on-dark"` | `"on-light"` | cor do texto (preto/branco) |
| `className` | `string` | — | classes extra |
| `asLink` | `boolean` | `false` | envolve em `Link` para `/` (com `aria-label="GMT — início"`) |

### 3. Imagens / mídia
Nenhuma (logo textual). `GL-01`/`GL-02` não são usados por este componente.

### 4. Botões / CTAs
Quando `asLink`, é um `Link` para `/`. Sem estilo de botão.

### 5. Animações
`.gmt-brand--navbar` herda transição de cor via contexto; `logo-gmt--*` define a cor.

### 6. Responsividade
Tamanho fluido por `clamp()`. Sem breakpoints discretos.

### 7. Arquivos relacionados
`src/components/ui/GmtLogo.tsx`, `src/lib/utils.ts` (`cn`), classes `.gmt-brand`/`.gmt-brand--navbar`/`.logo-gmt--on-light`/`.logo-gmt--on-dark` em `src/styles/globals.css`.

---

# Componente: RevealOnScroll (`src/components/ui/RevealOnScroll.tsx`)

### 1. Objetivo
Componente central de animação de revelação on-scroll (Framer Motion), usado em quase todas as seções e dentro de `PlaceholderMedia`.

### Props
| Prop | Tipo | Default | Efeito |
|---|---|---|---|
| `children` | `ReactNode` | — | conteúdo a revelar |
| `className` | `string` | — | classes (aplicadas ao elemento `as` no modo texto) |
| `delay` | `number` | `0` | atraso adicional (segundos) |
| `variant` | `"text" \| "media"` | auto | `text` se `children` é string; senão `media` |
| `as` | `ElementType` | `div` | tag do elemento de texto |

### 2. Copy / Textos
Não define copy próprio — herda a do filho. As classes/tamanhos dependem do uso.

### 3. Imagens / mídia
Nenhuma própria.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
Constantes: `REVEAL_DURATION = 2.1s`, ease `REVEAL_EASE_OUT = [0.22,1,0.36,1]`, `REVEAL_LINE_GAP = 0.06s`, `REVEAL_TEXT_Y = 32`, `REVEAL_MEDIA_Y = 24`. Viewport `{ once: true, margin: "-8% 0px" }`.

| Variante | Gatilho | Efeito |
|---|---|---|
| `text` (string) | on-scroll (entra no viewport) | divide em linhas visuais (`splitTextIntoLines`) e revela **sequencialmente** linha-a-linha (`delay + i * (REVEAL_DURATION + REVEAL_LINE_GAP)`), `y 32→0` + `opacity 0→1` |
| `media` | on-scroll | bloco único `y 24→0` + `opacity 0→1` |

Respeita `prefers-reduced-motion` (render estático via `useReducedMotion`).

### 6. Responsividade
Independente de breakpoint (baseado em viewport intersection). A medição de linhas usa `ResizeObserver` (re-divide ao redimensionar).

### 7. Arquivos relacionados
`src/components/ui/RevealOnScroll.tsx`, `src/lib/split-text-lines.ts`, `src/hooks/useReducedMotion.ts`, `src/lib/utils.ts`.

---

# Componente: HeroTitle (`src/components/hero/HeroTitle.tsx`)

### 1. Objetivo
Título animado da Home — marca "GMT" + subtítulo, revelados letra-a-letra, com blink ao regressar. Envolvido por `HeroSection.tsx` (`bg-black`, `h-screen`, `[--gmt-text:#ffffff]`).

### 2. Copy / Textos

| Campo | `<h1>` | `<p>` subtítulo |
|---|---|---|
| Conteúdo | `GMT` | `Growth Marketing Technology` |
| Elemento HTML | `h1` (`motion.h1`) | `p` (`motion.p`) |
| Classe | `.gmt-brand` + `.gmt-brand--hero` | `.type-hero-subtitle` |
| Família | Host Grotesk | DM Sans |
| Tamanho | `clamp(6rem,15vw,14rem)` ≡ `clamp(96px,15vw,224px)` | `clamp(3rem,4.5vw,4.5rem)` ≡ `clamp(48px,4.5vw,72px)` |
| Peso | **800** | 400 |
| Cor da fonte | `#ffffff` (`text-white`) | `#ffffff` (`text-white`) |
| `letter-spacing` | **0.02em** | 0.05em |
| `text-transform` | uppercase | uppercase |

> `line-height` 1 (h1) / 1.2 (p); `white-space: nowrap` em ambos.

### Props
Sem props (componente sem parâmetros). Usa `useReducedMotion` internamente.

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Revelação letra-a-letra | Framer Motion (`useAnimation` + variants) | on-load (após `setTimeout 80ms`) | char `0.28s`, ease `[0.2,0.65,0.3,0.9]`, `opacity 0→1` + `y 10→0` + `blur(4px)→0`. Stagger: linha 1 `0.1s` (delay 0.1s); linha 2 `0.055s` (delay 0.55s) |
| Blink ao regressar | Framer Motion (`useInView` `amount: 0.1`) | on-view (re-entrada) | `0.8s`, `opacity [1,0.06,…,1]` (não pisca na 1ª vez) |

`prefers-reduced-motion` → render estático (h1 + p sem animação).

### 6. Responsividade
Tamanhos por `clamp()`/`vw`. Em `<320px` pode haver overflow (`white-space: nowrap`).

### 7. Arquivos relacionados
`src/components/hero/HeroTitle.tsx`, `src/components/hero/HeroSection.tsx`, `src/hooks/useReducedMotion.ts`, classes `.gmt-brand`/`.gmt-brand--hero`/`.type-hero-subtitle` em `src/styles/globals.css`.

---

# Componente: SmoothScroll (`src/components/ui/SmoothScroll.tsx`)

### 1. Objetivo
Inicializa o smooth scroll global (biblioteca **Lenis**). Sem UI.

### 2. Copy / Textos
Nenhum (`return null`).

### 3. Imagens / mídia
Nenhuma.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Scroll suave de toda a página | Lenis | mount (loop `requestAnimationFrame`) | contínuo; `lenis.destroy()` no unmount |

Estilos auxiliares em `globals.css`: `html.lenis`, `.lenis.lenis-smooth { scroll-behavior: auto !important }`, `.lenis.lenis-stopped { overflow: clip }`.

### 6. Responsividade
Global, sem variação por breakpoint.

### 7. Arquivos relacionados
`src/components/ui/SmoothScroll.tsx`, dependência `lenis`, regras `.lenis*` em `src/styles/globals.css`.

---

# Componentes órfãos (definidos mas NÃO importados)

> Verificado por busca de imports: estes componentes existem mas não são usados por nenhuma página/componente ativo. Mantidos para referência.

| Componente | Arquivo | Propósito (no código) | Observação |
|---|---|---|---|
| `HeroSlider` | `src/components/ui/HeroSlider.tsx` | Slider de hero com 5 slides (texto + fundo `HER-01`), arrasto (`drag`), barra de progresso e keyframes `.hero-*`. Usa `RevealText` e `PlaceholderMedia`. | **Órfão** — a Home usa `HeroSection`/`HeroTitle`. As keyframes `.hero-slide-*`/`.hero-fill`/`.hero-darken`/`.hero-bar-fade-out` em `globals.css` só serviriam este componente. `HER-01` (vídeo 16:9, 2560×1440) está **Produzido** em `public/videos/HER-01.webp` mas não é renderizado. |
| `ServiceCard` | `src/components/ui/ServiceCard.tsx` | Card de serviço (imagem + nome + headline) com `RevealOnScroll`. | **Órfão** — a Home usa `ServiceOverlayCard` (`src/components/home/ServiceOverlayCard.tsx`). |
| `RevealItem` | `src/components/ui/RevealItem.tsx` | Reveal genérico (`opacity 0→1`, `y 30→0`, `0.6s`) com easings `default`/`services`/`portfolio`. | **Órfão** — nenhuma página o importa. |
| `RevealText` | `src/components/ui/RevealText.tsx` | Reveal letra-a-letra (`staggerChildren 0.02`, `y 40→0`, `0.6s`, ease `[0.65,0.05,0.1,1]`). | Importado **apenas** por `HeroSlider` (que é órfão) → sem efeito visível no site atual. |

### Props dos órfãos (resumo)
- **`HeroSlider`** — sem props (slides fixos no array `SLIDES`).
- **`ServiceCard`** — `servico: Servico`, `placeholderId: string`, `delay?: number`.
- **`RevealItem`** — `children`, `className?`, `easing?: "default"|"services"|"portfolio"`, `delay?`.
- **`RevealText`** — `children: string`, `as?: "h1"|"h2"|"h3"|"h4"|"p"|"span"`, `className?`.

---

## Apêndice — tokens e classes de cor relevantes (de `globals.css`)

| Token / Classe | Valor | Usado por |
|---|---|---|
| `.gmt-brand` (base) | Host Grotesk **800**, `ls 0.02em`, `scaleX(1.03)`, uppercase | Hero, Navbar, Footer logo, Lanterna |
| `.gmt-brand--hero` | `clamp(96px,15vw,224px)` | `HeroTitle` |
| `.gmt-brand--navbar` | `clamp(18px,2.8vw,28px)` | `GmtLogo` (Navbar + Footer) |
| `.gmt-brand--footer` | `clamp(8rem,33vw,36rem)`, `lh 0.85` | `GMTLightFooter` |
| `.section-label` | DM Sans **12px**, 500, `ls 0.14em`, uppercase | `SectionLabel` (Home) |
| `.logo-gmt--on-light` / `--on-dark` | `#0a0a0a` / `#ffffff` | `GmtLogo` |
| `.type-label` | DM Sans 14px, 400, `ls 0.1em`, uppercase | Navbar (links), Footer (títulos/copyright) |
| `.type-body` | DM Sans 18px, 400, `lh 1.5` | Footer (links) |
| `.section-footer` | bg `#101010`, text `#ffffff`, muted `rgba(182,182,182,0.8)`, border `#242424` | Footer |
| `--gmt-text` / `--gmt-text-muted` | `#0a0a0a` / `#575757` | navbar pill claro |
| `--ease` / `--color-transition` | `cubic-bezier(0.65,0.05,0.1,1)` / `1s` | transição de cor do logo |
| `FloatingCTA` (inline) | bg `rgba(0,0,0,0.8)` → `#000`, text `#ffffff` | FloatingCTA |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por estes componentes — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*

---
## DESIGN SYSTEM
---

# GUIA DE EDIÇÃO — PARTE 09 · DESIGN SYSTEM

> Resumo do design system do projeto: fontes, escala tipográfica, cores/tokens, botões, animações e lacunas de mídia.
>
> **Fontes de verdade:** `src/styles/globals.css`, `src/styles/tokens.css`, `src/app/layout.tsx`, `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/data/media-spec.ts`, inventário real de `public/images` e `public/videos`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Esta parte documenta o **sistema**, não páginas.
>
> **Extração:** 28 Jun 2026.

> **Nota sobre `tokens.css`:** o arquivo `src/styles/tokens.css` existe e define tokens legados (`--color-primary`, `--color-foreground`, `--font-geist-*`, `--text-*`, `--space-*`, `--radius-*`, além de um bloco `@media (prefers-color-scheme: dark)`). **Nenhum deles é referenciado** pelas páginas/componentes atuais — a fonte de verdade efetiva é `globals.css`. Documentado aqui apenas para registo.

---

## 1. Fontes ativas no projeto

Carregadas em `src/app/layout.tsx` via `next/font/google`:

| Papel | Família | Pesos carregados | Variável CSS | Token de uso (`@theme inline`) |
|---|---|---|---|---|
| Display / títulos | **Host Grotesk** | 300, 400, 500, 600, 700, **800** | `--font-hostgrotesk` | `--font-display` (`var(--font-hostgrotesk), ui-sans-serif, sans-serif`) |
| Corpo / labels | **DM Sans** | 400, 500 | `--font-dmsans` | `--font-sans` (`var(--font-dmsans), ui-sans-serif, sans-serif`) |
| Mono (números/índices) | **Sistema** | — | — | `--font-mono` (`ui-monospace, "SFMono-Regular", Menlo, monospace`) |

Outros pesos definidos em `@theme inline`: `--font-weight-normal: 400`, `--font-weight-medium: 500`. `display: "swap"` em ambas as fontes Google.

**Notas:**
- Peso **800** (`--font-weight-brand`) é usado exclusivamente pela marca GMT (`.gmt-brand`).
- Host Grotesk **300** é usado só em `.type-category`.
- `LaCerchia` (serif decorativa citada nos design maps) **não está ativa** no projeto.
- Favicon / apple-icon: `/images/GL-02.webp` (definido em `metadata.icons`).

---

## 2. Escala tipográfica completa

Tokens definidos em `:root` (`globals.css`) e classes utilitárias correspondentes. Coluna "px em 1440px" calcula o valor efetivo de `clamp()` num viewport de 1440px.

| Token | Valor (código) | px em 1440px | Classe | Família · peso · extras |
|---|---|---|---|---|
| `--type-label` | `14px` | 14 | `.type-label` | DM Sans · 400 · uppercase · `ls 0.1em` · `lh 1.25` |
| `--type-section-label` | `12px` | 12 | `.section-label` | DM Sans · 500 · uppercase · `ls 0.14em` · `lh 1` |
| `--type-body` | `18px` | 18 | `.type-body` | DM Sans · 400 · `lh 1.5` |
| `--type-body-lg` | `21px` | 21 | `.type-body-lg` | DM Sans · 400 · `lh 1.55` |
| `--type-h3` | `36px` | 36 | `.type-h3` | Host Grotesk · 400 · `lh 1.2` · cor `--gmt-text` |
| `--type-h2` | `72px` (classe usa `clamp(42px,6vw,72px)`) | 72 (6vw=86 → cap 72) | `.type-h2` | Host Grotesk · 400 · `lh 1.1` · cor `--gmt-text` |
| `--type-hero` | `clamp(52px,9vw,108px)` | 108 (9vw=130 → cap 108) | `.type-hero` | Host Grotesk · 400 · cor `--gmt-text` |
| `--type-hero-leading` | `clamp(1, 8vw, 1.1)` | 1.1 (cap) | `.type-hero--fullscreen` (line-height) | aplica `line-height` ao `.type-hero` |
| `--type-hero-brand` | `clamp(6rem,15vw,14rem)` ≡ `clamp(96px,15vw,224px)` | ~216 (15vw=216 < 224) | `.gmt-brand--hero` (com `.gmt-brand`) | Host Grotesk · **800** · uppercase · `ls 0.02em` · `scaleX(1.03)` · `lh 1` · `nowrap` |
| `--type-hero-subtitle` | `clamp(3rem,4.5vw,4.5rem)` ≡ `clamp(48px,4.5vw,72px)` | ~65 (4.5vw=64.8) | `.type-hero-subtitle` | DM Sans · 400 · uppercase · `ls 0.05em` · `lh 1.2` · `nowrap` |
| *(ad hoc)* | `clamp(36px,5vw,48px)` | 48 (5vw=72 → cap 48) | `.type-category` | Host Grotesk · **300** · uppercase · `ls 0.1em` · `lh 1.1` · cor `--gmt-text` |
| *(ad hoc)* | `clamp(1.125rem,2.8vw,1.75rem)` ≡ `clamp(18px,2.8vw,28px)` | 28 (2.8vw=40 → cap 28) | `.gmt-brand--navbar` | Host Grotesk · **800** · uppercase · `ls 0.02em` · `scaleX(1.03)` · `lh 1` |
| *(ad hoc)* | `clamp(8rem,33vw,36rem)` | ~475 (33vw=475) | `.gmt-brand--footer` | Host Grotesk · **800** · uppercase · `ls 0.02em` · `scaleX(1.03)` · `lh 0.85` |
| — | `font-weight: 800` | — | `.gmt-brand` (base) | identidade GMT partilhada (navbar, hero, lanterna) |
| — | `font-weight: 500` | — | `.type-medium` | modificador de peso |

**Classes de cor do logo:** `.logo-gmt--on-light` = `#0a0a0a`; `.logo-gmt--on-dark` = `#ffffff`.

> A escala condiz com `docs/TIPOGRAFIA_PAGINAS.md`. Tamanhos "mono" (`font-mono`) são definidos inline por Tailwind (ex.: `text-5xl`, `md:text-[10vw]`, `.type-body`), não há token mono próprio.

---

## 3. Cores / tokens encontrados no código

### 3.1 Tokens base — `:root` (tema claro, padrão), `globals.css`

| Token | Valor | Função |
|---|---|---|
| `--gmt-bg` | `#ffffff` | fundo padrão das páginas |
| `--gmt-bg-alt` | `#f5f5f5` | fundos alternados / cartões / inputs |
| `--gmt-border` | `#dcdcdc` | bordas |
| `--gmt-text` | `#0a0a0a` | texto principal |
| `--gmt-text-muted` | `#575757` | texto secundário |
| `--gmt-accent` | `#2563eb` | acento primário (links, ícones, foco, botão sidebar) |
| `--gmt-accent-2` | `#7c3aed` | acento secundário (hover) |

### 3.2 Tokens dark / dual-mode — `:root`

| Token | Valor |
|---|---|
| `--gmt-bg-dark` | `#0a0f1e` |
| `--gmt-bg-dark-alt` | `#0f1729` |
| `--gmt-border-dark` | `#1e293b` |
| `--gmt-text-on-dark` | `#ffffff` |
| `--gmt-muted-on-dark` | `#94a3b8` |
| `--gmt-bg-light` | `#ebebeb` |
| `--gmt-bg-light-alt` | `#e0e0e0` |
| `--gmt-border-light` | `#dcdcdc` |
| `--gmt-text-on-light` | `#0a0a0a` |
| `--gmt-muted-on-light` | `#575757` |
| `--gmt-footer` | `#101010` |

### 3.3 Cores por contexto de seção (classes temáticas)

| Classe | Fundo | Texto | Muted | Border |
|---|---|---|---|---|
| (padrão) / `.section-light` | `#ffffff` | `#0a0a0a` | `#575757` | `#dcdcdc` |
| `bg-gmt-bg-alt` | `#f5f5f5` | — | — | — |
| `.section-cta` | `#000000` | `#ffffff` | `#94a3b8` | `#242424` (`--gmt-bg-alt` aqui = `#1a1a1a`) |
| `.section-footer` | `#101010` (`--gmt-footer`) | `#ffffff` | `rgba(182,182,182,0.8)` | `#242424` |
| Hero da Home (`HeroSection`) | `#000000` (`bg-black`) | `#ffffff` (override local `[--gmt-text:#ffffff]`) | — | — |

> Em `.section-cta`, regras `:where(...)`: `.type-h2/.type-h3/.type-hero/.type-label` → `var(--gmt-text)` (= `#ffffff`); `.type-body/.type-body-lg/p` → `var(--gmt-text-muted)` (= `#94a3b8`).

### 3.4 Cores fora dos tokens (hardcoded em componentes)

| Cor | Onde | Arquivo |
|---|---|---|
| `#111111` (texto base) / `#d4d4d4` (reveal) | Lanterna GMT | `GMTLightFooter.tsx` |
| `#ffffff → #000000` (anim. de fundo) / `#111827` (fallback img) | Frame expansivo | `ExpandingFrame.tsx` |
| `#1E293B` | placeholders "em breve" (portfolio/home) | páginas |
| Famílias (placeholder de serviço) — F1 `#92400E` · F2 `#1E3A5F` · F3 `#3B0764` · F4 `#0F172A` · MKT `#1A3A2A` · AV `#1A3A2A` | `CORES_FAMILIA` | `src/data/servicos.ts` |
| `#134E4A` | placeholder do portfolio NARA | `COR_PORTFOLIO` em `src/data/portfolio.ts` |

### 3.5 Overlays e efeitos

| Efeito | Valor | Onde |
|---|---|---|
| Overlay hero serviço | `bg-gradient-to-t from-black via-black/40 to-transparent` | `/servicos/[slug]` Sec0 |
| Manifesto Sobre (Sec. 03) | `bg-black` + `text-white` |
| Gradiente hero slider (órfão) | `from-gmt-bg/80 to-transparent` | `HeroSlider` |
| Glass navbar (logo) | `bg-black/55 backdrop-blur-md` | `Navbar` |
| Glass pill (escuro/claro) | `bg-black/30` / `bg-white/88` | `Navbar` |
| Glass FloatingCTA | `bg-black/80 backdrop-blur-md` → hover `bg-black` | `FloatingCTA` |
| Textura do footer | `GL-03` com `opacity-15` | `Footer` |

### 3.6 Tokens legados (`tokens.css` — NÃO usados)

`--color-primary #2563eb` · `--color-primary-hover #1d4ed8` · `--color-secondary #7c3aed` · `--color-accent #06b6d4` · `--color-background #ffffff` · `--color-foreground #0f172a` · `--color-muted #64748b` · `--color-border #e2e8f0` · `--color-surface #f8fafc` (+ overrides `prefers-color-scheme: dark`). Também `--font-geist-*`, `--text-*`, `--space-*`, `--radius-*`. **Sem uso confirmado** no código atual.

---

## 4. Padrão de botões recorrentes

| Botão / Classe | Fundo | Texto | Radius | Padding | Peso/Fonte | Hover |
|---|---|---|---|---|---|---|
| `.btn-submit` (CTA principal) | `rgb(255 255 255 / 0.7)` | `#000` | `9999px` | `0.75rem 2rem` | DM Sans 18px / 500 | bg `0.85` + `scale(1.02)`; disabled `opacity 0.6` |
| `.btn-nav` (hero slider, órfão) | `color-mix(in srgb, var(--gmt-text) 12%, transparent)` | `var(--gmt-text)` | `0.5rem` → `1vw` (md) | `inline 1.25rem`, `h 3rem`→`3.35vw` | DM Sans 18px / 500 | bg `20%` |
| `.btn-nav--on-light` | `color-mix(#000 8%)` | `--gmt-text-on-light` | igual | igual | igual | bg `#000 14%` |
| `.tag-pill` | `rgb(255 255 255 / 0.8)` | `#000` | `0.5vw` | `0.4vw 1vw` | DM Sans `clamp(13px,0.9vw,15px)` / 400 | — (sem hover) |
| "Ver todos os serviços" (Home, inline) | `#000000` | `#ffffff` | `9999px` | `px-8 py-3.5` | `.type-label` 14px / 400 | `bg-black/80` |
| "Ver Produto →" (Home NARA, inline) | transparente, borda `white/30` | `#ffffff` | `9999px` | `px-6 py-3` | `.type-label` 14px / 400 | borda `white/60` + `bg-white/10` |
| "Ver portfólio completo" (Home, inline) | transparente, borda `white/30` | `#ffffff` | `9999px` | `px-8 py-3.5` | `.type-label` 14px / 400 | borda `white/60` + `bg-white/10` |
| "Falar sobre um projeto" (case, inline) | `--gmt-accent` `#2563eb` | `#ffffff` | `0.5rem` (`rounded-lg`) | `px-6 py-3` | `.type-body`+`.type-medium` 18px / 500 | `--gmt-accent-2` `#7c3aed` |
| FloatingCTA (inline) | `rgba(0,0,0,0.8)` | `#ffffff` | `9999px` | `px-6 py-3.5` | DM Sans 14px / 500 | `#000` + ícone `translate-x-0.5` |
| Accordion header (`<button>`) | transparente → `bg-black` (aberto/hover) | `#0a0a0a` → `#ffffff` | `0.5rem` (`rounded-lg`) | `px-4 py-5` | `.type-body-lg` 21px / 400 | `hover:bg-black` |
| Navbar pill / hamburger | glass (ver §3.5) | conforme tema | `full` / `0.5rem` | `px-7 py-2.5` / `h-10 w-10` | `.type-label` 14px | troca de tema 300–500ms |

**Transições globais** (`globals.css`): `a, button, [role="button"]` → `transition: color/background-color/border-color 0.3s var(--ease)`. `button[type="submit"]` adiciona `transform 0.2s` + `:hover scale(1.02)`.

---

## 5. Padrão de animações e contextos de uso

| Animação | Biblioteca | Contexto / Gatilho | Duração / efeito |
|---|---|---|---|
| Reveal de conteúdo (texto/mídia) | Framer Motion (`RevealOnScroll`) | quase todas as seções; on-scroll | `2.1s`, ease `[0.22,1,0.36,1]`, stagger `0.14` (linhas) / `0.08` (itens); `y 50→0` (texto) / `36→0` (mídia) |
| Hero brand letra-a-letra + blink | Framer Motion (`HeroTitle`) | Home Hero; on-load + on-view | char `0.28s` ease `[0.2,0.65,0.3,0.9]`; blink `0.8s` |
| Frame expansivo | Framer Motion `useScroll`/`useTransform` | Home transição; on-scroll | scale `35%→100%`/`45vh→100vh` a partir de `SCALE_START≈0.4`; bg `#fff→#000` em janela curta (`0.4→0.52`); radius `16→0`; slideshow 700ms |
| Service overlay hover | CSS (`group-hover`) | Home "O que fazemos"; on-hover | `blur(4px)` + `saturate(0.35)` na imagem; descrição `opacity 0→1` |
| Lanterna GMT | CSS `mask-image` (radial) + JS `rAF` | Home — após Footer; on-hover cursor | foco `circle 20vw`; `opacity 0.5s` |
| FloatingCTA | Framer Motion `AnimatePresence` | global; scroll threshold | `0.35s`, `opacity`+`y 14` |
| Navbar (tema) | Framer Motion `useScroll` | global; scroll > 60px | transição CSS 300–500ms |
| Accordion | CSS `grid-template-rows` | `/servicos`; on-click | `0.3s cubic-bezier(0.4,0,0.2,1)`; chevron rotação 180° |
| Hover global (links/botões) | CSS | global; on-hover | `0.3s var(--ease)` cor/bg/borda |
| Media zoom | CSS (`.media-zoom`) | cards/thumbs com imagem; on-hover | `scale(1.03)`, 400ms; fade-in da imagem (`data-loaded`) |
| Submit (scale) | CSS | botões submit; on-hover | `scale(1.02)`, 200ms |
| Form (shake / fade / success) | CSS keyframes | Contacto; on-submit/erro/sucesso | `form-shake 0.4s`; `form-fade-out`; `form-fade-in 0.5s` |
| `Loader2` (spinner) | CSS (`animate-spin`) | Contacto; submitting | rotação contínua |
| Smooth scroll | Lenis | global; sempre | loop `rAF` |
| Hero slider keyframes (`.hero-*`) | CSS | **inativos** (componente `HeroSlider` órfão) | `slide-in/out var(--slide-duration)=1.5s`, `fill 7s`, `darken`, `bar-fade-out` |

**Motion tokens** (`:root`): `--ease: cubic-bezier(0.65,0.05,0.1,1)`; `--ease-services: cubic-bezier(0.76,0,0.24,1)`; `--ease-portfolio: cubic-bezier(0.22,1,0.36,1)`; `--slide-duration: 1.5s`; `--fade-duration: 1s`; `--color-transition: 1s`.

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` zera animações/transições globais e desativa as keyframes `.hero-*`; os componentes Framer (`RevealOnScroll`, `HeroTitle`, etc.) renderizam estático via `useReducedMotion`.

---

## 6. Lacunas de mídia (IDs cruzados com PARTE 4 do Plano)

### 6.1 IDs definidos em `media-spec.ts` SEM asset em `public/`

| ID | Slot (PARTE 4) | Proporção | Export | Status |
|---|---|---|---|---|
| SERV-AV-01 | Home Sec2 — Card overlay Criação de Conteúdo (Tabela 4.4-B) | 7:5 | 1400×1000 | **Lacuna** |
| SERV-AV-02 | Home Sec2 — Card overlay Publicidade Digital | 7:5 | 1400×1000 | **Lacuna** |
| SERV-AV-03 | Home Sec2 — Card overlay Branding & Estratégia | 7:5 | 1400×1000 | **Lacuna** |
| SERV-AV-04 | Home Sec2 — Card overlay Websites | 7:5 | 1400×1000 | **Lacuna** |
| SERV-AV-05 | Home Sec2 — Card overlay Inteligência Artificial | 7:5 | 1400×1000 | **Lacuna** |
| SERV-AV-06 | Home Sec2 — Card overlay Analytics & Otimização | 7:5 | 1400×1000 | **Lacuna** |
| PF-EB1 | Portfolio Geral — slot vazio (Tabela 4.5 / PF-SLOT-G) | 9:16 | 1080×1920 | **Lacuna** (intencional) |
| PF-EB2 | Portfolio Geral — slot vazio | 9:16 | 1080×1920 | **Lacuna** (intencional) |
| PF-EB3 | Portfolio Geral — slot vazio | 9:16 | 1080×1920 | **Lacuna** (intencional) |

### 6.2 IDs referenciados em código mas SEM registo em `media-spec.ts` (placeholder puro)

| ID | Onde | Status |
|---|---|---|
| PF-02a | Home Sec "Trabalhos recentes" — card "em breve" 1 (PF-SLOT-H) | **Lacuna** (intencional) |
| PF-02b | Home Sec "Trabalhos recentes" — card "em breve" 2 (PF-SLOT-H) | **Lacuna** (intencional) |
| PF-EB1/2/3 (também no grid hero do Portfolio) | Portfolio Geral — grid | **Lacuna** (intencional) |

### 6.3 Lacunas da PARTE 4 sem implementação/asset

| ID / Item | Onde (PARTE 4) | Observação |
|---|---|---|
| TEST-BANNER | Tabela 4.4-D (planeado para testemunhos) | **Secção removida da Home** — ID sem uso activo |
| GL-04 | Avatar testimonial (Tabela 4.6) | Asset **existe** (`public/images/GL-04.webp`) mas **não é renderizado** |
| HER-SLD-02..05 | Home hero slider (slides 2–5) | **Lacuna** — futuros 16:9; o `HeroSlider` é órfão (não usado) |
| PF-SLOT-N | Portfolio Item — "Próximo projeto" | **Lacuna** — renderizado como `PF-02` cinza; depende de novos cases |
| GL-05 | Ícones de UI (Tabela 4.6) | Sem produção externa — `lucide-react` (vetor) |
| GL-06 | Cursor/preview interativo (Tabela 4.6) | Sem produção — efeito (ex.: Lanterna GMT) |
| CON-01 | Contacto — fundo decorativo (Tabela 4.1) | Asset **existe** mas **não referenciado** no JSX (OPCIONAL) |

### 6.4 Assets PRODUZIDOS mas NÃO usados (referência)

| ID | Arquivo | Observação |
|---|---|---|
| GL-01 | `public/images/GL-01.webp` | logo 7:2 — o site usa logo **textual** (`GmtLogo`) |
| HER-01 | `public/videos/HER-01.webp` | hero 16:9 — usado só pelo `HeroSlider` (órfão) |
| GL-04 | `public/images/GL-04.webp` | avatar 1:1 — sem secção de testemunhos na Home |
| CON-01 | `public/images/CON-01.webp` | fundo 16:9 — não referenciado em `/contacto` |

### 6.5 Inventário de assets presentes em `public/`

- **`public/images/`:** HER-02..HER-05, ABT-01..ABT-05, CON-01, AGP-F1..F4, AG-01..AG-15, MKT-01..MKT-03, AV-01..AV-06, PF-01..PF-12, GL-01..GL-04.
- **`public/videos/`:** HER-01, AGH-F1..AGH-F4, MKT-04. *(Cópias legadas de ABT-01/02 podem existir em `videos/`; o código aponta para `images/`.)*
- Todos em `.webp` (vídeos ainda como `.webp`; MP4/WebM previstos no futuro pelo PLANO).

> Resumo: as únicas **lacunas reais de produção** actualmente activas no site são os **6 cards overlay `SERV-AV-01..06`** (Home "O que fazemos"). As demais lacunas (`PF-EB*`, `PF-02a/b`, `PF-SLOT-N`) são **intencionais** ("Em breve") por falta de novos cases.

---

## 7. Arquivos relacionados (sistema)

| Tema | Arquivo |
|---|---|
| Tokens, classes tipográficas, cores de seção, botões, keyframes, reduced-motion | `src/styles/globals.css` |
| Tokens legados (não usados) | `src/styles/tokens.css` |
| Fontes (DM Sans, Host Grotesk), metadata, favicon, montagem global | `src/app/layout.tsx` |
| Especificação de mídia (ratio, px, pasta, container) | `src/data/media-spec.ts` |
| Mapeamentos slug→ID, helpers de mídia | `src/lib/media.ts` |
| Cores de família / portfolio | `src/data/servicos.ts`, `src/data/portfolio.ts` |
| Reveal / motion | `src/components/ui/RevealOnScroll.tsx`, `src/lib/split-text-lines.ts`, `src/hooks/useReducedMotion.ts` |
| Tipografia por página (referência) | `docs/TIPOGRAFIA_PAGINAS.md` |
| Inventário de mídia (referência) | `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4) |

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*
