# GUIA DE EDIÇÃO — PARTE 01 · HOME (`/`)

> Documentação completa da página Home para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/page.tsx`
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
| Rota | `/` |
| Arquivo | `src/app/page.tsx` |
| Componentes | `HeroSection` (→ `HeroTitle`), `RevealOnScroll`, `PlaceholderMedia`, `ExpandingFrame`, `PortfolioCard`, `GMTLightFooter`, ícones `lucide-react` |
| Dados | `avulsos` (`src/data/servicos.ts`), `getCaseBySlug("nara")` (`src/data/portfolio.ts`); arrays `DIFERENCIAIS` e `SERV_IMAGE_IDS` no próprio arquivo |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Hero
2. Seção 02 — O que fazemos
3. Seção 03 — Porquê a GMT
4. Seção 04 — Frame expansivo (transição branco → preto)
5. Seção 05 — Trabalhos recentes (fundo preto)
6. Seção 06 — Testemunhas (temporário)
7. Seção 07 — CTA final
8. Seção 08 — Lanterna GMT (decorativo)

> **Nota:** o Hero usa `HeroSection`/`HeroTitle` (marca "GMT" animada, fundo preto). O componente `src/components/ui/HeroSlider.tsx` (que usaria `HER-01`) **existe mas está órfão** — não é importado em `page.tsx`.

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
| Classe | `.type-hero-brand` | `.type-hero-subtitle` |
| Família | Host Grotesk (`--font-display`) | DM Sans (`--font-sans`) |
| Tamanho | `clamp(6rem, 15vw, 14rem)` ≡ `clamp(96px,15vw,224px)` | `clamp(3rem, 4.5vw, 4.5rem)` ≡ `clamp(48px,4.5vw,72px)` |
| Peso | 500 | 400 |
| Cor da fonte | `#ffffff` (`text-white`; a classe herda `--gmt-text`, que é `#ffffff` localmente em `HeroSection`) | `#ffffff` (`text-white`) |
| `letter-spacing` | 0.18em | 0.05em |
| `text-transform` | uppercase | uppercase |

> Outros: `line-height` 1 (h1) / 1.2 (p); `white-space: nowrap` em ambos. Fundo da secção `bg-black` (`#000000`) com override local `[--gmt-text:#ffffff]`.

### 3. Imagens / mídia
Nenhuma. Hero puramente tipográfico → **Não identificado no projeto** (sem criativo na PARTE 4 para este hero; `HER-01` pertence ao `HeroSlider`, que está inativo).

### 4. Botões / CTAs
Nenhum nesta seção.

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
`src/app/page.tsx`, `src/components/hero/HeroSection.tsx`, `src/components/hero/HeroTitle.tsx`, `src/hooks/useReducedMotion.ts`, classes `.type-hero-brand`/`.type-hero-subtitle` em `src/styles/globals.css`.

---

# Seção 02 — O que fazemos

### 1. Objetivo
Apresentar as 6 áreas de **Serviços Avulsos** em cards com imagem, ligando a cada página de detalhe.

### 2. Copy / Textos

| Campo | Label | Card `<h3>` | Card `<p>` | Botão |
|---|---|---|---|---|
| Conteúdo | `O que fazemos` | Nome do serviço (de `avulsos`) | 1.ª funcionalidade do serviço | `Ver todos os serviços →` |
| Elemento HTML | `p` | `h3` | `p` | `a` (Link) |
| Classe | `.type-label` | `.type-body` + `font-medium` | `.type-body` | `.type-label` |
| Família | DM Sans | DM Sans | DM Sans | DM Sans |
| Tamanho | 14px | 18px | 18px | 14px |
| Peso | 400 | 500 | 400 | 400 |
| Cor da fonte | `#0a0a0a` (`text-gmt-text`) | `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) | `#ffffff` (`text-white`) |
| `letter-spacing` | 0.1em | — | — | 0.1em |
| `text-transform` | uppercase | none | none | uppercase |

Os 6 cards (de `servicos.ts`, `tipo: "avulso"`): Criação de Conteúdo · Publicidade Digital · Branding & Estratégia · Websites · Inteligência Artificial · Analytics & Otimização.

### 3. Imagens / mídia
Proporção `7:5` (de `media-spec.ts`). IDs em `SERV_IMAGE_IDS`. Cruzado com PLANO Tabela 4.4-B.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| SERV-AV-01 | Card Criação de Conteúdo | 7:5 | 1400×1000 | (não existe) | **Lacuna** |
| SERV-AV-02 | Card Publicidade Digital | 7:5 | 1400×1000 | (não existe) | **Lacuna** |
| SERV-AV-03 | Card Branding & Estratégia | 7:5 | 1400×1000 | (não existe) | **Lacuna** |
| SERV-AV-04 | Card Websites | 7:5 | 1400×1000 | (não existe) | **Lacuna** |
| SERV-AV-05 | Card Inteligência Artificial | 7:5 | 1400×1000 | (não existe) | **Lacuna** |
| SERV-AV-06 | Card Analytics & Otimização | 7:5 | 1400×1000 | (não existe) | **Lacuna** |

> Como o asset não existe, o `PlaceholderMedia` renderiza o placeholder com cor de fallback `servico.corPlaceholder` (família AV = `#1A3A2A`).

### 4. Botões / CTAs
"Ver todos os serviços →" — classes inline (não utilitária CSS): `.type-label` + `rounded-full bg-black px-8 py-3.5 text-white`.
- Fundo `#000000` · Texto `#ffffff` · `border-radius 9999px` · `padding 0.875rem 2rem`.
- Hover: `bg-black/80` (transição `colors 300ms`).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, cards e botão | Framer Motion (`RevealOnScroll`) | on-scroll | `1.75s` ease `[0.16,1,0.3,1]`; cards com stagger `delay = i*0.08` |
| Card (borda) | CSS | on-hover | `border-gmt-border → border-gmt-accent`, 300ms |
| Imagem do card | CSS (`.media-zoom`) | on-hover | `scale(1.03)`, 400ms |

### 6. Responsividade
- **Desktop:** `px-[5vw] py-[8vw]`, grid `md:grid-cols-2`.
- **Tablet:** `sm:grid-cols-2`.
- **Mobile:** `px-5 py-20`, `grid-cols-1`.

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/components/ui/RevealOnScroll.tsx`, `src/data/servicos.ts`.

---

# Seção 03 — Porquê a GMT

### 1. Objetivo
Reforçar os 6 diferenciais institucionais da agência (fundo alternado `bg-gmt-bg-alt`).

### 2. Copy / Textos

| Campo | Label | `<h2>` | Card `<h3>` | Card `<p>` |
|---|---|---|---|---|
| Conteúdo | `Porquê a GMT` | `Cada negócio, por mais pequeno que seja, merece uma presença digital profissional e eficaz.` | Título do diferencial | Texto do diferencial |
| Elemento HTML | `p` | `h2` | `h3` | `p` |
| Classe | `.type-label` | `.type-h3` | `.type-body` + `font-medium` | `.type-body` |
| Família | DM Sans | Host Grotesk | DM Sans | DM Sans |
| Tamanho | 14px | 36px | 18px | 18px |
| Peso | 400 | 400 | 500 | 400 |
| Cor da fonte | `#0a0a0a` (`text-gmt-text`) | `var(--gmt-text)` = `#0a0a0a` (definida em `.type-h3`) | `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`); `opacity-0 → group-hover:opacity-100` |
| `letter-spacing` | 0.1em | — | — | — |
| `text-transform` | uppercase | none | none | none |

Os 6 diferenciais (array `DIFERENCIAIS`): Experiência comprovada · Técnica + criatividade · Tecnologia de ponta · Acompanhamento próximo · Foco em pequenas empresas · Resultados mensuráveis.

### 3. Imagens / mídia
Nenhuma imagem. Cada card usa um **ícone** `lucide-react` (`Trophy`, `Layers`, `Zap`, `Users`, `Target`, `TrendingUp`), `size 22`, `strokeWidth 1.5`. Corresponde a `GL-05` na PARTE 4 (ícones de UI, sem produção externa). Status: ícones vetoriais → **Produzido** (lucide-react).

### 4. Botões / CTAs
Nenhum. Os cards são `cursor-default` (não clicáveis).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, h2 e cards | Framer Motion (`RevealOnScroll`) | on-scroll | stagger `delay = i*0.08` |
| Card (fundo) | CSS | on-hover | `bg-gmt-bg → bg-gmt-bg-alt`, 300ms |
| Caixa do ícone | CSS | on-hover (group) | `border-gmt-accent` + `text-gmt-accent` |
| Parágrafo descritivo | CSS | on-hover (group) | `opacity-0 → opacity-100`, 300ms |

### 6. Responsividade
- **Desktop:** `md:px-[5vw] md:py-[8vw]`, grid `lg:grid-cols-3`.
- **Tablet:** `sm:grid-cols-2`.
- **Mobile:** `px-5 py-20`, `grid-cols-1`.

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/ui/RevealOnScroll.tsx`.

---

# Seção 04 — Frame expansivo (transição branco → preto)

### 1. Objetivo
Transição cinematográfica entre o bloco claro e o bloco preto: um frame cresce no scroll enquanto cicla imagens e o fundo do container passa de branco a preto.

### 2. Copy / Textos
Nenhum texto. **Não identificado no projeto** (seção puramente visual).

### 3. Imagens / mídia
Componente: `src/components/ui/ExpandingFrame.tsx` (array `FRAME_IMAGES`). Cruzado com PLANO Tabela 4.4-C.

| ID | Slot | Proporção (spec) | Export | Arquivo atual | Status |
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
| Tamanho do frame | Framer Motion (`useScroll`/`useTransform`) | on-scroll | `35% × 45vh → 100% × 100vh` (progress 0.4→1) |
| `border-radius` | Framer Motion | on-scroll | `16px → 0px` |
| Fundo do container | Framer Motion | on-scroll | `#ffffff → #000000` (progress 0.82→1) |
| Slideshow das 4 imagens | `setInterval` + CSS | tempo (700ms) | fade `opacity`, 500ms |

A secção tem `250vh`; o container é `sticky top-0`. Totalmente reversível com o scroll.

### 6. Responsividade
Comportamento idêntico em todos os tamanhos (medidas em `%`/`vw`/`vh`, sem breakpoints específicos).

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/ui/ExpandingFrame.tsx`, `src/components/ui/PlaceholderMedia.tsx`.

---

# Seção 05 — Trabalhos recentes (fundo preto)

### 1. Objetivo
Mostrar o case **NARA** + 2 slots "em breve" em faixa preta (`.section-cta`).

### 2. Copy / Textos

| Campo | Label | Card NARA `<h3>` | Card NARA `<h4>` | Cards "em breve" | Botão |
|---|---|---|---|---|---|
| Conteúdo | `Trabalhos recentes` | `NARA` | local / indústria / serviços | `Projeto` + `Em breve` | `Ver portfolio completo →` |
| Elemento HTML | `p` | `h3` | `h4` | `h3` / `p` | `a` (Link) |
| Classe | `.type-label` | `.type-h3` | `.type-body` | `.type-h3` / `.type-label` | `.type-label` |
| Família | DM Sans | Host Grotesk | DM Sans | Host Grotesk / DM Sans | DM Sans |
| Tamanho | 14px | 36px | 18px | 36px / 14px | 14px |
| Peso | 400 | 400 | 400 | 400 | 400 |
| Cor da fonte | `#ffffff` (`var(--gmt-text)` redefinido em `.section-cta`) | `#ffffff` | `#94a3b8` (`text-gmt-muted` na `.section-cta`) | `#ffffff` / `#94a3b8` | `#ffffff` (`text-white`) |

> Em `.section-cta` (regra `:where(...)` no `globals.css`): títulos/labels = `#ffffff`; `p`/body = `#94a3b8`. Dados NARA de `src/data/portfolio.ts` (nome, local `Portugal · Internacional`, indústria `Tecnologia`, serviços `Website + IA`, tags `Branding/Website/Chatbots/Campanhas`).

### 3. Imagens / mídia
Componente: `PortfolioCard`. Cruzado com PLANO Tabela 4.5.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| PF-01 | Card showcase NARA | 3:4 | 1200×1600 | `public/images/PF-01.webp` | **Produzido** |
| PF-02a | Card "em breve" 1 | (sem spec) | — | (não existe) | **Lacuna** (intencional) |
| PF-02b | Card "em breve" 2 | (sem spec) | — | (não existe) | **Lacuna** (intencional) |

> Cor NARA = `#134E4A` (`COR_PORTFOLIO`). Cards "em breve" usam cor `#1E293B` + prop `emBreve`. `PF-02a/PF-02b` não estão em `media-spec.ts` (correspondem a `PF-SLOT-H` da PARTE 4).

### 4. Botões / CTAs
"Ver portfolio completo →" — inline: `.type-label` + `rounded-full border border-white/30 px-8 py-3.5 text-white`.
- Fundo transparente · borda `rgba(255,255,255,0.3)` · Texto `#ffffff` · `border-radius 9999px`.
- Hover: `border-white/60` + `bg-white/10` (transição `all 300ms`).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, cards e botão | Framer Motion (`RevealOnScroll`) | on-scroll | stagger (`delay 0.08`/`0.16`) |
| Card NARA | CSS | on-hover | `hover:opacity-90` + zoom da mídia (`scale 1.03`) |

### 6. Responsividade
- **Desktop:** `md:px-[5vw] md:py-[8vw]`, grid `md:grid-cols-2`.
- **Tablet / Mobile:** `px-5 py-20`, `grid-cols-1`.

### 7. Arquivos relacionados
`src/app/page.tsx`, `src/components/ui/PortfolioCard.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`.

---

# Seção 06 — Testemunhas (temporário)

### 1. Objetivo
Placeholder para depoimentos (lacuna de conteúdo). Faixa preta `.section-cta`, centrada.

### 2. Copy / Textos

| Campo | Label | `<h2>` |
|---|---|---|
| Conteúdo | `Testemunhas` | `Em breve — depoimentos dos nossos primeiros clientes.` |
| Elemento HTML | `p` | `h2` |
| Classe | `.type-label` + `text-white/40` | `.type-h3` |
| Família | DM Sans | Host Grotesk |
| Tamanho | 14px | 36px |
| Peso | 400 | 400 |
| Cor da fonte | `rgba(255,255,255,0.4)` (`text-white/40`) | `#ffffff` |
| `letter-spacing` | 0.1em | — |
| `text-transform` | uppercase | none |

### 3. Imagens / mídia
Nenhuma renderizada. A PARTE 4 prevê `TEST-BANNER` (3:1) e `GL-04` (avatar 1:1) como **Lacuna** de conteúdo — não há depoimentos reais. (`GL-04.webp` existe em `public/images/` mas não é usado nesta seção.)

### 4. Botões / CTAs
"Agendar agora" — classe `.btn-submit`.
- Fundo `rgb(255 255 255 / 0.7)` · Texto `#000` · `border-radius 9999px` · `padding 0.75rem 2rem` · DM Sans 18px peso 500.
- Hover: `bg rgb(255 255 255 / 0.85)` + `scale(1.02)`.

### 5. Animações
`RevealOnScroll` (Framer Motion) no label, h2 e botão, on-scroll com stagger.

### 6. Responsividade
- **Todos:** `text-center`, h2 `max-w-xl`.
- **Desktop:** `md:px-[5vw] md:py-[8vw]`. **Mobile:** `px-5 py-20`.

### 7. Arquivos relacionados
`src/app/page.tsx`, classe `.btn-submit` em `src/styles/globals.css`.

---

# Seção 07 — CTA final

### 1. Objetivo
Conversão final da Home (fundo preto `.section-cta`).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Pronto para automatizar o seu negócio?` | `Reunião gratuita e sem compromisso.` |
| Elemento HTML | `h2` | `p` |
| Classe | `.type-h3` | `.type-body` |
| Família | Host Grotesk | DM Sans |
| Tamanho | 36px | 18px |
| Peso | 400 | 400 |
| Cor da fonte | `#ffffff` | `#94a3b8` (`text-gmt-muted`) |

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
"Agendar agora" — classe `.btn-submit` (ver Seção 06: fundo `rgb(255 255 255 / 0.7)`, texto `#000`, hover `0.85` + `scale(1.02)`).

### 5. Animações
`RevealOnScroll` (Framer Motion) no h2, p e botão, on-scroll com stagger.

### 6. Responsividade
- **Todos:** centrado, h2 `max-w-2xl`.
- **Desktop:** `md:px-[5vw] md:py-[8vw]`. **Mobile:** `px-5 py-24`.

### 7. Arquivos relacionados
`src/app/page.tsx`, classe `.btn-submit` em `src/styles/globals.css`.

---

# Seção 08 — Lanterna GMT (decorativo)

### 1. Objetivo
Transição decorativa para o footer: "GMT" gigante revelado por um foco de luz que segue o cursor.

### 2. Copy / Textos
Componente: `src/components/ui/GMTLightFooter.tsx`. Duas camadas de texto `GMT` (`aria-hidden`).

| Campo | Texto (2 camadas sobrepostas) |
|---|---|
| Conteúdo | `GMT` |
| Elemento HTML | `p` |
| Classe | inline `style` (sem classe utilitária) |
| Família | `var(--font-display)` (Host Grotesk) |
| Tamanho | `clamp(8rem, 33vw, 36rem)` |
| Peso | 500 |
| Cor da fonte | camada base `#111111`; camada reveal `#d4d4d4` |
| `letter-spacing` | 0.08em |
| `text-transform` | uppercase |

> Outros: `line-height: 0.85`. Fundo da secção `#000000`.

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
Nenhum.

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
`src/app/page.tsx`, `src/components/ui/GMTLightFooter.tsx`.

---

## Apêndice — tokens e cores usados na Home (de `globals.css`)

| Token | Valor | Onde aparece na Home |
|---|---|---|
| `--gmt-bg` | `#ffffff` | fundo Seção 02 |
| `--gmt-bg-alt` | `#f5f5f5` | fundo Seção 03 e cards |
| `--gmt-border` | `#dcdcdc` | bordas dos cards |
| `--gmt-text` | `#0a0a0a` | texto em fundo claro |
| `--gmt-text-muted` | `#575757` | texto secundário (claro) |
| `--gmt-accent` | `#2563eb` | hover de borda dos cards |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seções 05, 06, 07 |
| Hero (`HeroSection`) | bg `#000000`, text `#ffffff` | Seção 01 |
| Família AV (placeholder) | `#1A3A2A` | fallback cards Seção 02 |
| `COR_PORTFOLIO` | `#134E4A` | card NARA (Seção 05) |
| "em breve" / fallback frame | `#1E293B` / `#111827` | Seções 04 e 05 |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** pela Home — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*

