# GUIA DE EDIÇÃO — PARTE 01 · HOME (`/`)

> Documentação completa da página Home para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/data/media-spec.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Última actualização:** Jul 2026 (hero HER-01 · h-[45vw]; frame expansivo 16:9).

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
Primeira impressão institucional: fundo **HER-01** (16:9) com título animado **GMT** letra-a-letra sobre overlay escuro.

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
Componente: `HeroSection` → `PlaceholderMedia` (`HER-01`). Cruzado com PLANO Tabela 4.1.

| ID | Slot | Proporção (asset) | Export | Arquivo | Status |
|---|---|---|---|---|---|
| HER-01 | Hero background | **16:9** | 2560×1440 | `public/images/HER-01.webp` | **Produzido** |

**Container vs asset:**

| Camada | Comportamento |
|---|---|
| **Secção** | `h-[45vw]` — **20% menos altura** que um 16:9 full-bleed (`56.25vw`); fundo `bg-black` |
| **Wrapper interno** | `h-full aspect-video` — moldura **16:9** centrada; largura visível ≈ **80vw** |
| **Imagem** | `fill` + `object-cover` — asset 16:9 encaixa **sem distorção** dentro do wrapper |
| **Overlay** | `bg-black/40` sobre a secção inteira |

> O **35%** / frame expansivo **não** se aplica aqui — isso é Secção 04 (`ExpandingFrame`).

### 4. Botões / CTAs
Nenhum nesta secção.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Revelação letra-a-letra | Framer Motion | on-load | char `0.28s`, ease `[0.2,0.65,0.3,0.9]`, `opacity 0→1`, `y 10→0`, `blur(4px)→0`. Stagger: linha 1 `0.1s` (delay 0.1s); linha 2 `0.055s` (delay 0.55s) |
| Blink ao regressar | Framer Motion | on-view (re-entrada no viewport) | `0.8s`, `opacity [1,0.06,…,1]` |

Respeita `prefers-reduced-motion` (render estático).

### 6. Responsividade
- **Desktop / Tablet / Mobile:** altura fluida `45vw` (80% de 16:9 full-bleed); wrapper 16:9 centrado; título por `clamp()`/`vw`.
- Em viewports < 320px pode haver overflow lateral (efeito do `white-space: nowrap` no título).

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/hero/HeroSection.tsx`, `src/components/hero/HeroTitle.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/hooks/useReducedMotion.ts`, `src/data/media-spec.ts`.

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
Transição cinematográfica entre o bloco claro e o bloco preto: um **frame pai** começa pequeno, cresce no scroll enquanto cicla **6 imagens do mesmo conjunto** e o fundo do container passa de branco a preto **no início da expansão**.

> **Importante:** HER-02…07 **não** são imagens isoladas. Pertencem a **um único slide expansivo** (`ExpandingFrame`). O **35%** refere-se à **largura inicial do bloco pai**, não ao tamanho de cada imagem.

### 2. Copy / Textos
Nenhum texto. Secção puramente visual.

### 3. Imagens / mídia

Componente: `src/components/ui/ExpandingFrame.tsx` (array `HOME_FRAME_IMAGES`). Cruzado com PLANO Tabela 4.4-C.

**Conjunto único — 6 slides (mesmo padrão de produção):**

| ID | Posição | Proporção (asset) | Export | Arquivo | Status |
|---|---|---|---|---|---|
| HER-02 | Slide 1 | **16:9** | 2560×1440 | `public/images/HER-02.webp` | **Produzido** |
| HER-03 | Slide 2 | **16:9** | 2560×1440 | `public/images/HER-03.webp` | **Produzido** |
| HER-04 | Slide 3 | **16:9** | 2560×1440 | `public/images/HER-04.webp` | **Produzido** |
| HER-05 | Slide 4 | **16:9** | 2560×1440 | `public/images/HER-05.webp` | **Produzido** |
| HER-06 | Slide 5 | **16:9** | 2560×1440 | `public/images/HER-06.webp` | **Produzido** |
| HER-07 | Slide 6 | **16:9** | 2560×1440 | `public/images/HER-07.webp` | **Produzido** |

**Regras de renderização:**

| Regra | Detalhe |
|---|---|
| **Grupo** | Os 6 IDs partilham o mesmo `ExpandingFrame` — slideshow interno, não secções separadas |
| **Produção** | Todos os slides: **16:9 · 2560×1440** — mesmo padrão que o frame pai |
| **Frame pai** | `aspect-video` (16:9); largura animada **35% → 90%** |
| **Estado inicial** | **35% largura** (16:9), centrado — **não** é o tamanho isolado do asset |
| **Expansão máxima** | **90% largura** (16:9); depois o scroll **continua** pela secção |
| **Render** | `PlaceholderMedia` com `fill` + `object-cover` dentro do frame 16:9 |
| **Ratio visível** | Frame pai e asset **ambos 16:9** — encaixe sem distorção |
| **Safe zone** | Compor assunto no **centro 55–60%** |

> Cor de fallback `#0a0a0a`. Spec em `media-spec.ts`: 16:9 para produção; frame pai usa `aspect-video`.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Tamanho do **frame pai** | Framer Motion (`useScroll`/`useTransform`) | on-scroll | **35% → 90% largura**, **16:9** (`aspect-video`); progress `SCALE_START`→1 |
| `border-radius` | Framer Motion | on-scroll | `16px → 0px` |
| Fundo do container | Framer Motion | on-scroll | `#ffffff → #000000` (progress **`0.4 → 0.52`**, janela de ~12% do scroll) |
| Slideshow dos 6 slides | `setInterval` + CSS | tempo (700ms) | crossfade `opacity`, 500ms |

**Comportamento observável:**
1. A secção entra pelo fundo do viewport (fundo branco, **frame pai pequeno** ~35% largura).
2. O frame sobe até ao centro (~40% do progress da secção de 250vh).
3. Quando o sticky activa e a expansão **começa**, o fundo inicia transição rápida branco → preto.
4. Durante a expansão, o **frame pai** cresce até **90%** mantendo 16:9; imagens internas acompanham via `fill`.
5. Após **90%**, o scroll **continua** pela secção até à seguinte.
6. Scroll para cima inverte tudo.

A secção tem `250vh`; o container é `sticky top-0`. Totalmente reversível com o scroll.

### 6. Responsividade
Comportamento idêntico em todos os tamanhos (medidas em `%`/`vw`/`vh`, sem breakpoints específicos). O **35%** aplica-se à largura do frame pai em qualquer viewport.

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/ui/ExpandingFrame.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`.

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
| Hero (`HeroSection`) | bg `#000000`, text `#ffffff`, altura `45vw` | Secção 01 |
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
