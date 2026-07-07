# GUIA DE EDIÇÃO — PARTE 08 · COMPONENTES GLOBAIS

> Documentação dos componentes globais (não-páginas) usados em todo o site.
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** Jul 2026 · Footer redesenhado; GMT Lantern via `.gmt-lantern-section`; chat widget global.

---

## Montagem no layout

**Root** (`src/app/layout.tsx`): fontes, metadata, `<body>`.

**Site** (`src/app/(site)/layout.tsx`):

```
<SmoothScroll />
<Navbar />
<main class="prose prose-gmt max-w-none flex-1">{children}</main>
<GMTLightFooter />
<Footer />
<ChatWidgetLoader />
```

> Ordem visual: conteúdo → GMT Lantern → Footer → Chat launcher (canto inferior direito).

Favicon: `src/app/icon.svg` (App Router — sem `metadata.icons`). Fontes: DM Sans + Host Grotesk.

---

# Componente: Navbar (`src/components/ui/Navbar.tsx`)

### 1. Objetivo
Cabeçalho fixo global: logo (esquerda), pill de navegação central (desktop), hamburger (mobile). Adapta cores conforme hero escuro / scroll.

### 2. Copy / Textos

| Campo | Logo | Links de navegação |
|---|---|---|
| Conteúdo | `GMT` (via `GmtLogo`) | `Sobre` · `Serviços` · `Portfolio` · `Contacto` (array `NAV_LINKS`) |
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
- **Logo**: `Link` para `/` com container glass `bg-black/55 backdrop-blur-md rounded-full` (`px-5 py-2.5`).
- **Hamburger** (`<button>`, `<md`): pill escuro/claro conforme `overDark`.
- **Pill de navegação** (`<nav>`, desktop): `rounded-full border px-7 py-2.5 backdrop-blur-md`.
- **Menu mobile:** apenas `NAV_LINKS` — **sem** CTA "Agendar reunião".

> Conversão global via `ChatWidgetLoader` / `ChatLauncher` (canto inferior direito).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Estado `scrolled` | Framer Motion (`useScroll` + `useMotionValueEvent`) | on-scroll | `scrolled = scrollY > 60` |
| Cores do pill / hamburger | CSS | mudança de estado | `transition-all 500ms` (pill), `300ms` (hamburger/links) |
| Glass do logo | CSS | scroll / tipo de página | `transition-opacity 500ms` |
| Menu mobile | render condicional (`open`) | on-click | aparece/desaparece (sem transição declarada) |

Lógica de tema (`useNavTone`):
- Lê `[data-nav-tone="dark"]` nas secções sob a navbar.
- `pillDark = overDark` (não depende de scroll).
- `logoGlassVisible = scrolled || !overDark`.

### 6. Responsividade
- **Desktop (`md+`):** pill central visível (`hidden ... md:flex`); altura `h-20`, `px-[3vw]`.
- **Mobile (`<md`):** pill oculto; hamburger visível (`md:hidden`); menu dropdown `bg-black/90 backdrop-blur-xl`; altura `h-16`, `px-5`.

### 7. Arquivos relacionados
`src/components/ui/Navbar.tsx`, `src/components/ui/GmtLogo.tsx`, `src/lib/utils.ts` (`cn`), classes `.gmt-brand`/`.gmt-brand--navbar`/`.logo-gmt--on-dark` em `src/styles/globals.css`.

---

# Componente: ChatWidgetLoader (`src/components/agent/ChatWidgetLoader.tsx`)

### 1. Objetivo
Carrega dinamicamente o `ChatWidget` (agente IA) no canto inferior direito. Substitui o antigo `FloatingCTA`.

### 2. Comportamento
- `dynamic()` com `ssr: false` — só no cliente.
- `ChatLauncher` com label contextual (`data-agent-hint` por secção ou fallback por rota).
- Painel de chat expansível (`ChatHeader`, `ChatMessages`, `ChatInput`).
- Posição: `fixed bottom-4 right-4 z-[70]`.
- Renderiza `null` se agente desactivado (`useAgentConfig`).

### 3. Arquivos relacionados
`src/components/agent/ChatWidgetLoader.tsx`, `ChatWidget.tsx`, `ChatLauncher.tsx`, hooks `useAgentConfig`, `useChat`, `useSectionAgentHint`.

---

# Componente: Footer (`src/components/ui/Footer.tsx`)

### 1. Objetivo
Rodapé global: subtítulo institucional centrado, grid de 3 colunas de navegação e copyright. Fundo preto sólido — **sem logo textual nem textura GL-03**.

### 2. Copy / Textos

| Campo | Subtítulo | Título de coluna | Links | Copyright |
|---|---|---|---|---|
| Conteúdo | `Growth Marketing Technology` | `Automação & IA` · `Marketing Digital` · `Empresa` | nomes dos serviços/páginas | `© 2026 Growth Marketing Technology · Lisboa, Portugal` |
| Elemento HTML | `p` | `h3` | `a` (Link) | `p` |
| Classe | `.type-footer-subtitle` | `.type-label` | `.type-body text-white` | `.type-label normal-case` |
| Cor | `#ffffff` | `#ffffff` | `#ffffff` hover `white/75` | `#ffffff` |

### 3. Layout e espaçamento

| Propriedade | Valor no código |
|---|---|
| Padding | `py-20 md:py-28`, `px-5 md:px-[5vw]` |
| Subtítulo → grid | `mb-16 md:mb-24` |
| Grid | `grid-cols-1 md:grid-cols-3`, `gap-[2.4rem]` |
| Fundo | `bg-black` (`.section-footer`) |

### 4. Imagens / mídia
Nenhuma renderizada. `GL-03.webp` existe no inventário mas **não é usado** pelo Footer actual.

### 5. Botões / CTAs
Links de texto apenas.

### 6. Arquivos relacionados
`src/components/ui/Footer.tsx`, `src/data/servicos.ts`, `.section-footer` e `.type-footer-subtitle` em `globals.css`.

---

# Componente: GMTLightFooter — GMT Lantern (`src/components/ui/GMTLightFooter.tsx`)

### 1. Objetivo
Faixa decorativa de branding **global**: "GMT" gigante revelado por foco de luz que segue o cursor. Posicionada **acima** do Footer Navigation em **todas** as páginas. Sem links nem CTAs — apenas transição visual entre o conteúdo e a navegação do rodapé.

### 2. Montagem
| Campo | Detalhe |
|---|---|
| Componente | `GMTLightFooter` (`src/components/ui/GMTLightFooter.tsx`) |
| Onde renderiza | `src/app/(site)/layout.tsx` — **antes** de `<Footer />` |
| Escopo | **Global** (todas as rotas com Footer Navigation) |
| Papel | Transição visual / branding — independente do `<main>` |

### 3. Layout e espaçamento
| Propriedade | Valor no código | Notas |
|---|---|---|
| Padding | `.gmt-lantern-section` — `--gmt-lantern-pad-y: 0.75rem` (mobile) / `1rem` (md); padding-top extra 7% da altura total |
| Máscara | `circle 16vw` centrada no cursor (`--mx` / `--my`) |
| Tipografia | `.gmt-brand--footer` — `clamp(6.4rem, 26.4vw, 28.8rem)` |
| Fundo | `bg-black` (`#000000`) | Contínuo com Footer Navigation |
| Overflow | `overflow-hidden` | Texto gigante cortado nas bordas |
| Alinhamento texto | `flex items-center justify-center` | Base e reveal partilham o mesmo contentor centrado |
| Respiração | Entre `<main>` e `<Footer />` | Separa conteúdo da grelha de links; contacto directo (sem margem entre blocos) |

### 4. Copy / tipografia

| Campo | Texto (2 camadas sobrepostas, `aria-hidden`) |
|---|---|
| Conteúdo | `GMT` |
| Elemento HTML | `p` |
| Classe | `.gmt-brand` + `.gmt-brand--footer` |
| Família | Host Grotesk (`--font-display`) |
| Tamanho | `clamp(8rem, 33vw, 36rem)` — **inalterado** (legibilidade preservada) |
| Peso | **800** (`--font-weight-brand`) |
| `line-height` | **0.85** (`.gmt-brand--footer`) |
| Cor | base `#111111` · reveal `#d4d4d4` |
| `letter-spacing` | **0.02em** · uppercase · `scaleX(1.03)` |

> **Hierarquia:** elemento **decorativo de marca** — não é título de secção, card nem thumbnail. Sem relação com `.type-hero` ou `.section-label`.

### 5. Imagens / mídia
Nenhuma asset de ficheiro. Efeito puro CSS/JS (ID conceptual **GL-06** no Plano Mestre).

### 6. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Foco de luz (reveal) | CSS `mask-image` radial + JS `rAF` | hover + movimento cursor | `circle 20vw` em `var(--mx)/var(--my)` (% do contentor) |
| Opacidade reveal | CSS transition | mouseenter / mouseleave | `0.5s ease`; ao sair, máscara repõe-se a `50%/50%` |
| Simetria | JS `resetMaskCenter()` | mouseleave | evita deslocamento lateral entre estados |

Touch (`hover: none`): iluminação estática centrada (`opacity 0.55`). **Não** usa Framer Motion.

### 7. Responsividade
- **Desktop:** cursor-follow; padding `md:py-[3.4rem]` (3.4rem × 2 ≈ 6.8rem vertical só de padding).
- **Mobile/touch:** fallback estático; padding `py-[2.04rem]` (2.04rem × 2).

### 8. Arquivos relacionados
`src/components/ui/GMTLightFooter.tsx`, `src/app/layout.tsx`, classes `.gmt-brand`/`.gmt-brand--footer` em `src/styles/globals.css`.

---

## Apêndice — tipos de mídia e hierarquia (referência rápida)

Fonte canónica: `src/data/media-spec.ts` + `PlaceholderMedia`. Usar esta tabela ao produzir assets ou documentar secções.

| Tipo | `container` na spec | Comportamento no código | Exemplos de ID |
|---|---|---|---|
| **Thumbnail + hero serviço** | `aspect` · ratio **3:2** · 1200×800 | Listagem Accordion + hero Sec0 `/servicos/[slug]`; `object-fit: cover` em banner vh | `AG-01…15`, `MKT-01…03`, `AV-01…06` |
| **Card overlay** | `aspect` · ratio **7:5** · 1400×1000 | Home `ServiceOverlayCard`; texto no overlay | `SERV-AV-01…06` |
| **Frame / hero full-bleed** | thumb **3:2** em container vh | `fill` + gradiente; altura `70–80vh`; cover | `AG/MKT/AV` via `getServicoHeroId` |
| ~~**Hero 3:1 partilhado**~~ | — | **Removido Jul 2026** | ~~`AGH-F1…4`, `MKT-04`~~ |
| **Frame expansivo** | `aspect` variável (slideshow) | `ExpandingFrame`; slides com `fill` + cover | `HER-02…05`, `ABT-01…05` |
| **Timeline (processo)** | `ComoFuncionaTimeline` | — | **N/A** | **OK** | Sem mídia — linha + círculos + texto |
| **Portfolio / case** | `aspect` · 3:4 ou 9:16 | Cards ou galeria com ratio da spec | `PF-01`, `PF-02` |
| **Textura de secção** | `full-bleed` · 16:9 | Fundo decorativo com opacidade reduzida | `GL-03` (Footer) |
| **Vídeo (futuro)** | `folder: "videos"` | Mesmas regras de ratio; ficheiro `.webp` por agora | `HER-01` |

### Espaçamentos tipográficos frequentes (não-tokens — valores do código)

| Relação | Padrão típico | Onde |
|---|---|---|
| Label → conteúdo | `mt-10` (40px) | Secções Home com `SectionLabel` |
| Título hero → subtítulo | `gap-2` (8px) | Hero serviço; Home `HeroTitle` usa `gap-6` |
| Rótulo secção → grid | `mt-10` / `mt-12` | Home sec. 2–5 |
| Lantern → Footer nav | 0 (contacto directo) | `GMTLightFooter` imediatamente acima de `<Footer />` — sem gap |
| Footer nav — respiro interno | `pt-[8vw]` + `py-[3.2rem]` + gaps −20% | `Footer.tsx` — altura proporcional ao conteúdo |
| Lantern — altura faixa | `py-[2.04rem]` / `md:py-[3.4rem]` | `GMTLightFooter.tsx` — texto GMT centrado, tamanho inalterado |

---

# Componente: SectionLabel (`src/components/ui/SectionLabel.tsx`)

### 1. Objetivo
Rótulo de secção com duas variantes: `eyebrow` (discreto) ou `title` (título de secção).

### 2. Copy / Textos
| Prop | `variant="eyebrow"` (default) | `variant="title"` |
|---|---|---|
| Elemento | `<p>` | `<h2>` |
| Classe | `.section-label` + `--on-light`/`--on-dark` | `.type-section-title` |
| Tamanho | **13px** (`--type-section-label`) | `clamp(30px,4vw,46px)` |
| Uso actual | raro (eyebrow) | Home, Contacto, Portfolio (`SectionLabel variant="title"`) |

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
Constantes: `REVEAL_DURATION = 2.0s`, ease `REVEAL_EASE_OUT = [0.25,1,0.35,1]`, `REVEAL_TEXT_Y = 28`, `REVEAL_MEDIA_Y = 20`. Viewport `{ once: true, margin: "-4% 0px" }`.

| Variante | Gatilho | Efeito |
|---|---|---|
| `text` | on-scroll | bloco único `y 28→0` + `opacity 0→1` |
| `media` | on-scroll | bloco único `y 20→0` + `opacity 0→1` |

**Excepção:** intro da Home via `Preloader` (GSAP) + scroll em `HeroTitle` — não usa reveal linha-a-linha.

### 7. Arquivos relacionados
`src/components/ui/RevealOnScroll.tsx`, `src/hooks/useReducedMotion.ts`, `src/lib/utils.ts`.

---

# Componente: HeroTitle (`src/components/hero/HeroTitle.tsx`)

### 1. Objetivo
Título da Home — marca "GMT" + subtítulo + barra "Apresentamos". Envolvido por `HeroSection` (`bg-black`, `hero-fullscreen` = `100dvh`).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Efeito |
|---|---|---|---|
| Intro (1ª visita) | GSAP (`Preloader`) | on-load | overlay de entrada |
| Deslize no scroll | GSAP ScrollTrigger | on-scroll | `xPercent` ±38; barra `#hero-bar` muda cor |

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
| `.section-label` | DM Sans **13px**, 500, eyebrow | `SectionLabel variant="eyebrow"` |
| `.type-section-title` | Host Grotesk fluido | `SectionLabel variant="title"` |
| `.logo-gmt--on-light` / `--on-dark` | `#0a0a0a` / `#ffffff` | `GmtLogo` |
| `.type-label` | DM Sans 14px, 400, `ls 0.1em`, uppercase | Navbar (links), Footer (títulos/copyright) |
| `.type-body` | DM Sans 18px, 400, `lh 1.5` | Footer (links) |
| `.section-footer` | bg `#101010`, text `#ffffff`, muted `rgba(182,182,182,0.8)`, border `#242424` | Footer |
| `--gmt-text` / `--gmt-text-muted` | `#0a0a0a` / `#575757` | navbar pill claro |
| `--ease` / `--color-transition` | `cubic-bezier(0.65,0.05,0.1,1)` / `1s` | transição de cor do logo |
| `ChatWidgetLoader` (inline) | bg `rgba(0,0,0,0.8)` → `#000`, text `#ffffff` | ChatWidgetLoader |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por estes componentes — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*
