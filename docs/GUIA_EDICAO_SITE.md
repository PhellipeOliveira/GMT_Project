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
| Globais (via `layout.tsx`) | `Navbar`, `GMTLightFooter`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das secções (conteúdo + layout global):**

1. Seção 01 — Hero
2. Seção 02 — O que fazemos
3. Seção 03 — Por que a GMT
4. Seção 04 — Transição expansiva (`ExpandingFrame`)
5. Seção 05 — Trabalhos recentes (fundo preto)
6. GMT Lantern + Footer Navigation *(via `layout.tsx` — ver PARTE 08)*

> **Nota:** o Hero usa `HeroSection`/`HeroTitle` (marca "GMT" animada, fundo preto). O componente `src/components/ui/HeroSlider.tsx` (que usaria `HER-01`) **existe mas está órfão** — não é importado em `page.tsx`.
>
> **GMT Lantern:** renderizada por `GMTLightFooter` em `layout.tsx`, **acima** de `<Footer />`, em **todas** as páginas. Ver `docs/guia/PARTE_08_COMPONENTES_GLOBAIS.md`.

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

> `PortfolioCard` **não** é usado na Home nem em `/servicos/[slug]` (componente existe no repo, sem consumidores activos).

---

# Secções removidas (não existem no código actual)

As seguintes secções foram **removidas** da Home e não devem ser documentadas como activas:

| Secção | Conteúdo removido |
|---|---|
| Testemunhos | Label "Testemunhas", H2 "Em breve — depoimentos…", botão "Agendar agora" |
| CTA final | H2 "Pronto para automatizar o seu negócio?", parágrafo, botão "Agendar agora" |

> O agendamento global permanece via `FloatingCTA` no layout (`layout.tsx`).

---

> **GMT Lantern:** documentação completa em `docs/guia/PARTE_08_COMPONENTES_GLOBAIS.md` § GMTLightFooter. Posição global: **acima** do Footer Navigation; padding `py-[2.04rem] md:py-[3.4rem]` (−15%).

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
### GMT Lantern (global — acima do Footer Navigation)

| Variante | Onde | Tamanho |
|---|---|---|
| `.gmt-brand--footer` | `GMTLightFooter` — todas as páginas | `clamp(8rem, 33vw, 36rem)` |

> Detalhes: `docs/guia/PARTE_08_COMPONENTES_GLOBAIS.md`. Padding da faixa: `py-[2.04rem] md:py-[3.4rem]`.

*Documento gerado a partir do código do repositório. Nenhuma informação foi inventada.*


---
## SERVIÇOS · LISTAGEM (/servicos)
---

# GUIA DE EDIÇÃO — PARTE 03 · SERVIÇOS · LISTAGEM (`/servicos`)

> Documentação da página de listagem de Serviços.
>
> **Arquivo principal:** `src/app/servicos/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/data/media-spec.ts`, `src/lib/media.ts`, `src/data/servicos.ts`.
>
> **Actualização:** 28 Jun 2026 — CTA final removida; página enxuta.

---

## Visão geral

A rota `/servicos` apresenta toda a oferta da GMT organizada em três categorias expansíveis (Accordion). É uma página de **descoberta e navegação** — cada item leva ao detalhe em `/servicos/[slug]`.

| Campo | Detalhe |
|---|---|
| Rota | `/servicos` |
| Arquivo | `src/app/servicos/page.tsx` |
| Componentes | `RevealOnScroll`, `RevealSequence`, `PlaceholderMedia`, `Accordion` |
| Dados | `agentes`, `pacotes`, `avulsos` (`src/data/servicos.ts`); `SERVICOS_HERO_THUMBS` (`src/lib/media.ts`); `CATEGORIAS` + `toItems()` no próprio arquivo |
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
- **Thumbnails:** grid `sm:grid-cols-3` de `SERVICOS_HERO_THUMBS`; `PlaceholderMedia`, `reveal={false}`, fallback `#1E293B`
- **CTAs nesta secção:** nenhum (thumbs não são clicáveis)

### Categorias (Accordion) — 3 secções em loop

Geradas a partir de `CATEGORIAS`:

| Secção | Label | Descrição | Itens |
|---|---|---|---|
| Automação & IA | `Automação & IA` | 15 agentes inteligentes… | 15 agentes |
| Pacotes de Marketing | `Pacotes de Marketing` | 3 pacotes para iniciar… | 3 pacotes |
| Serviços Avulsos | `Serviços Avulsos` | 6 áreas de especialização… | 6 avulsos |

Cada item do Accordion expõe: nome, headline, lista de `funcionalidades`, link `Ver serviço →` para `/servicos/{slug}`. Um item aberto de cada vez.

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
| Cores de família (ponto) | F1–F4, MKT, AV | ponto colorido por item do Accordion |

*Documento alinhado com `src/app/servicos/page.tsx`. Nenhuma informação foi inventada.*


---
## SERVIÇO · DETALHE (/servicos/[slug])
---

# GUIA DE EDIÇÃO — PARTE 04 · SERVIÇO · DETALHE (`/servicos/[slug]`)

> Documentação do **template único** de página individual de serviço.
>
> **Arquivo principal:** `src/app/servicos/[slug]/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (§ 4.2-C), `src/styles/globals.css`, `src/data/media-spec.ts`, `src/lib/media.ts`, `src/data/servicos.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`.
>
> **Actualização:** 28 Jun 2026 — hero compacta, preenchimento de mídia corrigido, títulos em “Como funciona”.

---

## A. Visão geral

As rotas `/servicos/[slug]` são páginas de detalhe de cada serviço da GMT (agentes, pacotes de marketing e avulsos). Existe **um único template** em `src/app/servicos/[slug]/page.tsx` partilhado por **todos** os slugs.

| Campo | Detalhe |
|---|---|
| Rota | `/servicos/[slug]` (dinâmica) |
| Arquivo | `src/app/servicos/[slug]/page.tsx` |
| Componentes | `RevealOnScroll`, `PlaceholderMedia`, ícone `Check` (`lucide-react`), `Link` (`next/link`) |
| Dados | `servicos`, `getServicoBySlug` (`src/data/servicos.ts`); `getServicoHeroId` (`src/lib/media.ts`); constante `COMO_FUNCIONA_SLOTS` no próprio arquivo |
| Geração estática | `generateStaticParams()` → **24 páginas** (15 agentes + 3 pacotes + 6 avulsos); `generateMetadata()` (title = `servico.nome`, description = `headline` / `solucao` / `nome`) |
| 404 | `notFound()` quando o slug não existe |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem actual das secções:**

1. Hero
2. Desafio / Solução *(condicional)*
3. Benefícios *(condicional)*
4. O que inclui *(sempre)*
5. Como funciona — slots CF-01…CF-05 *(sempre)*
6. Para quem é *(condicional)*
7. Footer global *(via `layout.tsx`)*

> As secções 2–6 estão dentro de `<div className="section-light">`. A Hero fica fora desse wrapper. **Não existe** CTA final nem secção “Em prática” nesta página.

**Removido do template (não documentar como activo):**

- CTA final “Quer este serviço no seu negócio?” + botão “Agendar reunião”
- Secção “Em prática” com case NARA e `PortfolioCard`
- Array `PROCESSO` (5 passos textuais)
- `RevealSequence` na hero
- Imports: `PortfolioCard`, `getCaseBySlug`, `getFamiliaProcessBg`, `RevealSequence`

---

## B. Hero

### Objetivo
Abertura full-bleed (70–80vh) com nome e headline do serviço sobre imagem/vídeo da família visual. Headline **centralizada**; botão de voltar no **canto inferior esquerdo**.

### Layout
- Container: `not-prose`, `h-[80vh] md:h-[70vh]`, `overflow-hidden`, fundo inline `backgroundColor: servico.corPlaceholder`
- Overlay: `bg-gradient-to-t from-black via-black/40 to-black/10` (topo com leve escurecimento — evita faixa branca do `main` a transparecer)
- Conteúdo textual: `flex h-full flex-col items-center justify-center text-center`
- Bloco título + subtítulo: `flex flex-col items-center gap-2` (8px entre headline e subtítulo)
- Botão voltar: `absolute bottom-0 left-0` com `px-5 pb-12 md:px-[5vw] md:pb-[5vw]`

### Espaçamento headline ↔ subtítulo

| Elemento | Regra no código | Valor efectivo |
|---|---|---|
| Entre linhas do `<h1>` | `!leading-[1.05]` + `[&>div]:!leading-[1.05]` (override de `.type-hero--fullscreen`) | line-height **1.05** — mais compacto que o default `clamp(1, 8vw, 1.1)` |
| Entre `<h1>` e `<p>` headline | wrapper `gap-2` | **8px** (`0.5rem`) |
| Subtítulo anterior | `mt-4` (16px) | **removido** — substituído pelo `gap-2` do wrapper |

> Referência Home: marca GMT usa `line-height: 1`; aqui usa-se **1.05** para legibilidade em nomes longos de serviço, mantendo bloco visual compacto.

### Copy / tipografia

| Campo | Botão voltar | `<h1>` | `<p>` headline |
|---|---|---|---|
| Conteúdo | `← Ver todos os serviços` | `servico.nome` (dados) | `servico.headline` (dados; condicional) |
| Elemento HTML | `a` (`Link`) | `h1` | `p` |
| Classe | `.type-label` + utilitários inline | `.type-hero` + `.type-hero--fullscreen` + `!leading-[1.05]` | `text-[clamp(1.125rem,2.5vw,1.75rem)]` |
| Família | DM Sans | Host Grotesk | DM Sans (tamanho fluido via `clamp`) |
| Tamanho | 14px (label) | `clamp(52px,9vw,108px)` via `--type-hero` | `clamp(1.125rem, 2.5vw, 1.75rem)` — **menor que o h1** |
| Peso | 500 (`font-medium`) | 400 | 400 |
| Cor | `#ffffff` sobre `bg-white/20` translúcido | `#ffffff` (`!text-white`) | `#ffffff` (`text-white`) |

> O subtítulo **não** usa `.type-body-lg` nem tamanho fixo em px.  
> O h1 usa override local `!leading-[1.05]` — não altera tokens globais.

### Botão “← Ver todos os serviços”
- Destino: `/servicos`
- Estilo vidro branco translúcido: `rounded-lg border border-white/25 bg-white/20 px-5 py-3 font-medium text-white backdrop-blur-md`
- Hover: `hover:bg-white/30`
- Peso da fonte: **500** (`font-medium` — override local sobre `.type-label` 400)
- Seta para trás mantida no copy (`←`)
- **Não existe** botão dinâmico com o nome do serviço nem link antigo `← Serviços`
- **Um único** botão na hero (sem duplicados)

### Mídia de fundo

Hero resolvido por `getServicoHeroId(servico)` (`src/lib/media.ts`). Render `fill`, `priority`, `sizes="100vw"`, `reveal={false}`. Classes extra na hero: `[&_img]:object-cover [&_img]:object-center [&_img]:scale-[1.02]` (elimina frestas de subpixel).

**Proporção — exportação vs. viewport (fonte: `media-spec.ts` + `page.tsx`):**

| Camada | Valor | Notas |
|---|---|---|
| **Exportação (produção)** | **3:1 · 2560×860** | `ratio: [3, 1]`, `exportPx` em `media-spec.ts`; assets AGH-F1…4 confirmados em disco |
| **Container (runtime)** | `w-full` × `h-[80vh] md:h-[70vh]` | Sem `aspect-ratio` fixo — a proporção visível depende da viewport |
| **Render** | `object-fit: cover` + `fill` | Crop nas bordas; safe zone **centro 55%** |
| **≠ 16:9** | — | 16:9 aplica-se a **HER-01** (Home) e outros slots; hero de serviço usa **3:1** na spec |

**Mapeamento ID → tipo de serviço** (fonte: `src/lib/media.ts` + `src/data/media-spec.ts`):

| Tipo | Condição | ID hero | Proporção spec | Export (px) | Pasta | Ficheiro |
|---|---|---|---|---|---|---|
| Agente | `familia` F1 | AGH-F1 | 3:1 | 2560×860 | `public/images/` | `AGH-F1.webp` |
| Agente | `familia` F2 | AGH-F2 | 3:1 | 2560×860 | `public/images/` | `AGH-F2.webp` |
| Agente | `familia` F3 | AGH-F3 | 3:1 | 2560×860 | `public/images/` | `AGH-F3.webp` |
| Agente | `familia` F4 | AGH-F4 | 3:1 | 2560×860 | `public/images/` | `AGH-F4.webp` |
| Pacote | qualquer | MKT-04 | 3:1 | 2560×860 | `public/videos/` | `MKT-04.webp` |
| Avulso | por slug | AV-01…AV-06 | 3:2 | 1200×800 | `public/images/` | `AV-0X.webp` |

> **AGH-F1…4:** imagens WebP em `public/images/` (antes em `videos/`). **MKT-04** permanece em `public/videos/` até migração futura.  
> **Avulsos:** o código reutiliza o thumb 3:2 (`getServicoThumbId`) com `object-fit: cover` no container 70–80vh. Compor o assunto no **centro 55%** (safe zone das specs AGH).

### Comportamento da mídia (anti-barra no topo)

| Camada | Função |
|---|---|
| `<section>` | `backgroundColor: servico.corPlaceholder` — fallback se a imagem demorar ou houver fresta |
| `PlaceholderMedia` | `absolute inset-0`, `object-cover object-center`, `scale-[1.02]` na imagem |
| Overlay gradiente | `to-black/10` no topo (em vez de `to-transparent`) — não expõe o branco do `main` |

**Diagnóstico:** a faixa sólida no topo era causada principalmente pelo **código** (gradiente transparente no topo + fundo branco do `main` visível em frestas de subpixel), não por dimensão incorrecta dos assets AGH (2560×860 confirmado). Avulsos em 3:2 exigem crop via `cover`; composição centralizada no asset evita barras baked-in.

Cruzado com PLANO § 4.2-B (heroes família), § 4.3 (MKT-04), § 4.4 (thumbs avulsos).

### Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| h1, headline | `RevealOnScroll` (texto) | on-scroll | `REVEAL_DURATION` 2.75s; headline `delay={0.08}` |
| Botão voltar | `RevealOnScroll variant="media"` | on-scroll | translateY + opacity, 2.75s |
| Mídia de fundo | — | — | `reveal={false}` |

> A hero **não** usa `RevealSequence`. Cada bloco anima de forma independente ao entrar no viewport.

### Responsividade
- **Desktop:** `h-[70vh]`; conteúdo centrado, `px-[5vw]`; botão `md:pb-[5vw]`
- **Mobile:** `h-[80vh]`; conteúdo centrado, `px-5`; botão `pb-12`

### Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/lib/media.ts`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`, classes `.type-hero`/`.type-hero--fullscreen` em `src/styles/globals.css`.

---

## C. Secções da página

### Dados vs. estrutura do template

| Origem | Conteúdo |
|---|---|
| **Dados — `servicos.ts` (por serviço)** | `nome`, `headline`, `problema`, `solucao`, `beneficios[]`, `funcionalidades[]`, `casosDeUso[]`, `familia`, `corPlaceholder`, `tipo` |
| **Dados — `lib/media.ts`** | ID do hero (`getServicoHeroId`) |
| **Estrutural — fixo no template** | Rótulos (`O desafio`, `A solução`, `Benefícios`, `O que inclui`, `Como funciona`, `Para quem é`); constante `COMO_FUNCIONA_SLOTS` (CF-01…05); copy do botão hero |
| **Condicional** | Sec. Desafio/Solução se `problema \|\| solucao`; Benefícios se `beneficios.length > 0`; intro “O que inclui” (solução repetida) só se `tipo === "pacote"`; Para quem é se `casosDeUso.length > 0` |

### Secção 01 — Proposta de valor (desafio + solução)

> Condicional: só renderiza se `servico.problema` ou `servico.solucao` existir.

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Desafio | `O desafio` · `.type-label` | `servico.problema` · `.type-h3` |
| Solução | `A solução` · `.type-label` | `servico.solucao` · `.type-body-lg` |

Layout: `flex-col md:flex-row`, cada coluna `md:w-1/2`, `gap-10 md:gap-[5vw]`, `pt-16 md:pt-[5vw]`.

### Secção 01b — Benefícios

> Condicional: só renderiza se `servico.beneficios.length > 0`.

Grid `grid-cols-1 md:grid-cols-3` de cartões com ícone `Check` (`lucide-react`, `text-gmt-accent`). Cada item: `.type-body` dentro de `border-gmt-border bg-gmt-bg-alt rounded-lg p-5`.

### Secção 02 — O que inclui

> **Sempre** renderizada (todos os serviços têm `funcionalidades[]`).

Lista `divide-y divide-gmt-border` com cada funcionalidade em `.type-body-lg`. Para pacotes (`tipo === "pacote"`), repete `servico.solucao` como parágrafo introdutório (`.type-body`).

### Secção 04 — Para quem é

> Condicional: só renderiza se `servico.casosDeUso.length > 0` (**9 de 24** serviços não têm casos de uso).

Tags `.tag-pill` com `servico.casosDeUso[]`. Padding inferior próprio: `pb-16 md:pb-[8vw]`.

### Padding inferior (evitar buracos visuais)

- Quando **não** há “Para quem é”, a Sec. 03 (“Como funciona”) recebe `pb-16 md:pb-[8vw]`.
- Quando “Para quem é” existe, o padding inferior fica na Sec. 04.

---

## D. Como funciona (Sec. 03)

### Objetivo
Grid de **5 slots de mídia** institucionais, partilhados por todas as rotas `/servicos/[slug]`. Substituem os antigos cards de processo com texto (`PROCESSO`) e fundos por família (`AGP-F*`).

### Estrutura no código

Constante `COMO_FUNCIONA_SLOTS` em `page.tsx`:

| ID | Título (overlay) | Cor fallback mídia |
|---|---|---|
| CF-01 | Reunião inicial | `#1E293B` |
| CF-02 | Proposta personalizada | `#134E4A` |
| CF-03 | Planeamento estratégico | `#1A3A5F` |
| CF-04 | Execução & implementação | `#3B0764` |
| CF-05 | Acompanhamento & otimização | `#0F172A` |

### Layout
- Rótulo: `<h2>` “Como funciona” · `.type-label`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`
- Card: `aspect-[3/4] md:aspect-[2/3] rounded-2xl border border-gmt-border overflow-hidden`
- Mídia: `PlaceholderMedia` com `fill`, `reveal={false}`, `sizes="(max-width: 1024px) 50vw, 20vw"`
- **Título sobre o card:** overlay absoluto centrado (`flex items-center justify-center`), caixa `rounded-lg bg-white/75 px-4 py-2.5 backdrop-blur-md text-gmt-text type-body-lg`

### Copy
Títulos dos 5 passos são **estruturais** (fixos no template, iguais em todos os slugs). Não há números 01–05 nem parágrafos descritivos — apenas título em destaque sobre cada card.

### Estado actual dos assets
Até existirem ficheiros em `public/images/CF-*.webp`, o `PlaceholderMedia` exibe fallback de cor. A estrutura está pronta para receber mídias reais — basta produzir e colocar os assets com os IDs correctos.

### Animações
Cada card: `RevealOnScroll variant="media"` com stagger `delay={i * 0.08}`.

---

## E. Relação com mídia e specs

### `src/data/media-spec.ts`
Entradas **CF-01…CF-05**:

| Campo | Valor |
|---|---|
| `ratio` | `[2, 3]` |
| `exportPx` | `{ w: 1200, h: 1800 }` |
| `container` | `aspect` |
| `objectFit` | `cover` |
| `folder` | `images` |
| `page` | `Serviço Item` |
| `slot` | `Sec3 — card mídia posição 1…5` |

### `docs/PLANO_MESTRE_DE_MIDIA.md` — Tabela **4.2-C**
Documenta os 5 slots CF com dimensões 1200×1800, proporção 2:3, posições no grid (col 1–5) e nota de que **AGP-F*** permanece no inventário como **legado** — a Sec3 activa usa **CF-01…05**.

### Correspondência código ↔ documentação

| Posição grid | ID código | ID media-spec | ID PLANO 4.2-C |
|---|---|---|---|
| Col 1 | CF-01 | CF-01 | CF-01 |
| Col 2 | CF-02 | CF-02 | CF-02 |
| Col 3 | CF-03 | CF-03 | CF-03 |
| Col 4 | CF-04 | CF-04 | CF-04 |
| Col 5 | CF-05 | CF-05 | CF-05 |

---

## F. Observações finais

- **Página enxuta:** sem CTA final de conversão; sem showcase de portfolio (NARA); conversão global via `FloatingCTA` do layout.
- **Template único:** qualquer alteração em `page.tsx` afecta os 24 slugs.
- **Hero actualizada:** headline centrada, subtítulo fluido, botão vidro “← Ver todos os serviços”.
- **Sec. Como funciona:** 5 slots CF prontos para mídia; placeholders de cor até produção dos assets.
- **Footer global:** renderizado em `src/app/layout.tsx`, fora do `page.tsx` do serviço.
- **Documentação alinhada** com o código em `src/app/servicos/[slug]/page.tsx`, `src/data/media-spec.ts` e `docs/PLANO_MESTRE_DE_MIDIA.md` § 4.2-C.

---

## Apêndice — tokens e cores (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| Hero overlay | gradiente `from-black via-black/40 to-black/10`; h1 `#ffffff`; headline `text-white` | Sec. Hero |
| Hero fallback | `servico.corPlaceholder` inline no `<section>` | Sec. Hero |
| Título card CF | `bg-white/75 backdrop-blur-md text-gmt-text` | Sec. Como funciona |
| Botão hero | `bg-white/20 border-white/25`, `backdrop-blur-md`, `font-medium text-white` | Sec. Hero |
| `.section-light` | bg `#ffffff`, text `#0a0a0a`, muted `#575757`, border `#dcdcdc` | wrapper Sec. 01–04 |
| `--gmt-text` | `#0a0a0a` | problema (h3), funcionalidades, benefícios |
| `--gmt-text-muted` | `#575757` | rótulos de secção, solução |
| `--gmt-accent` | `#2563eb` | ícone `Check` (benefícios) |
| `--gmt-bg-alt` | `#f5f5f5` | cartões de benefício |
| `--gmt-border` | `#dcdcdc` | bordas de cartões/listas/slots CF |
| `.tag-pill` | fundo `rgb(255 255 255 / 0.8)`, texto `#000` | Sec. Para quem é |
| Cores fallback CF-01…05 | ver tabela Sec. D | slots Como funciona |
| Cores fallback hero | `servico.corPlaceholder` por serviço | Sec. Hero |

*Documento gerado a partir do código do repositório. Nenhuma informação foi inventada.*


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
| Componentes | `RevealOnScroll`, `RevealSequence`, `PlaceholderMedia` |
| Dados | `portfolio` (`src/data/portfolio.ts`) — **1 case real (NARA)** |
| Metadata | `title: "Portfolio"`; `description` sobre o case NARA |
| Globais (via `layout.tsx`) | `Navbar`, `GMTLightFooter`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Cabeçalho + grid de thumbnails
2. Seção 02 — Lista de projetos

> Documentação completa: `docs/guia/PARTE_05_PORTFOLIO_LISTAGEM.md`.

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

> Documentação completa: `docs/guia/PARTE_05_PORTFOLIO_LISTAGEM.md`.

*Documento gerado a partir do código do repositório. Nenhuma informação foi inventada.*


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
| Globais (via `layout.tsx`) | `Navbar`, `GMTLightFooter`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Ficha lateral (sticky) + galeria
2. Seção 02 — Lista de projetos (cases em `portfolio`)

> Documentação completa: `docs/guia/PARTE_06_PORTFOLIO_DETALHE.md`.

---

## Apêndice — tokens e cores usados no Detalhe de Case (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `--gmt-bg` | `#ffffff` | Secções 01–02 |
| `--gmt-bg-alt` | `#f5f5f5` | pills de tag da ficha |
| `--gmt-text` | `#0a0a0a` | h1, h3, tags, `<dd>` |
| `--gmt-text-muted` | `#575757` | link voltar, resumo, rótulos, local na lista |
| `--gmt-accent` | `#2563eb` | botão ficha + hover título lista |
| `--gmt-accent-2` | `#7c3aed` | hover botão ficha |
| `--gmt-border` | `#dcdcdc` | divisórias da lista |
| `COR_PORTFOLIO` | `#134E4A` | fallback galeria e thumb NARA |

> Documentação completa: `docs/guia/PARTE_06_PORTFOLIO_DETALHE.md`.

*Documento gerado a partir do código do repositório. Nenhuma informação foi inventada.*


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
| Overlay hero serviço | `bg-gradient-to-t from-black via-black/40 to-black/10`; secção com `corPlaceholder` de fallback | `/servicos/[slug]` Sec0 |
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
| "← Ver todos os serviços" (detalhe serviço, hero) | `rgb(255 255 255 / 0.2)` + borda `white/25` | `#ffffff` | `0.5rem` (`rounded-lg`) | `px-5 py-3` | `.type-label` + `font-medium` 14px / **500** | `bg-white/30` |
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
| Lanterna GMT | CSS `mask-image` (radial) + JS `rAF` | global — acima do Footer; on-hover cursor | foco `circle 20vw`; `opacity 0.5s`; padding `py-[2.04rem] md:py-[3.4rem]` |
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

- **`public/images/`:** HER-02..HER-05, ABT-01..ABT-05, CON-01, AGP-F1..F4, AG-01..AG-15, MKT-01..MKT-03, AV-01..AV-06, PF-01..PF-12, GL-01..GL-04, **AGH-F1..AGH-F4** (heroes família de serviço).
- **`public/videos/`:** HER-01, MKT-04. *(Cópias legadas de ABT-01/02 ou AGH-F* podem existir em `videos/`; o código aponta para `images/`.)*
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
