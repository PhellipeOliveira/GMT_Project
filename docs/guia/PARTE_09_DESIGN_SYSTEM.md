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
| Display / títulos | **Host Grotesk** | 300, 400, 500 | `--font-hostgrotesk` | `--font-display` (`var(--font-hostgrotesk), ui-sans-serif, sans-serif`) |
| Corpo / labels | **DM Sans** | 400, 500 | `--font-dmsans` | `--font-sans` (`var(--font-dmsans), ui-sans-serif, sans-serif`) |
| Mono (números/índices) | **Sistema** | — | — | `--font-mono` (`ui-monospace, "SFMono-Regular", Menlo, monospace`) |

Outros pesos definidos em `@theme inline`: `--font-weight-normal: 400`, `--font-weight-medium: 500`. `display: "swap"` em ambas as fontes Google.

**Notas:**
- Peso **600/700 não carregado**. Host Grotesk **300** é usado só em `.type-category`.
- `LaCerchia` (serif decorativa citada nos design maps) **não está ativa** no projeto.
- Favicon / apple-icon: `/images/GL-02.webp` (definido em `metadata.icons`).

---

## 2. Escala tipográfica completa

Tokens definidos em `:root` (`globals.css`) e classes utilitárias correspondentes. Coluna "px em 1440px" calcula o valor efetivo de `clamp()` num viewport de 1440px.

| Token | Valor (código) | px em 1440px | Classe | Família · peso · extras |
|---|---|---|---|---|
| `--type-label` | `14px` | 14 | `.type-label` | DM Sans · 400 · uppercase · `ls 0.1em` · `lh 1.25` |
| `--type-body` | `18px` | 18 | `.type-body` | DM Sans · 400 · `lh 1.5` |
| `--type-body-lg` | `21px` | 21 | `.type-body-lg` | DM Sans · 400 · `lh 1.55` |
| `--type-h3` | `36px` | 36 | `.type-h3` | Host Grotesk · 400 · `lh 1.2` · cor `--gmt-text` |
| `--type-h2` | `72px` (classe usa `clamp(42px,6vw,72px)`) | 72 (6vw=86 → cap 72) | `.type-h2` | Host Grotesk · 400 · `lh 1.1` · cor `--gmt-text` |
| `--type-hero` | `clamp(52px,9vw,108px)` | 108 (9vw=130 → cap 108) | `.type-hero` | Host Grotesk · 400 · cor `--gmt-text` |
| `--type-hero-leading` | `clamp(1, 8vw, 1.1)` | 1.1 (cap) | `.type-hero--fullscreen` (line-height) | aplica `line-height` ao `.type-hero` |
| `--type-hero-brand` | `clamp(6rem,15vw,14rem)` ≡ `clamp(96px,15vw,224px)` | ~216 (15vw=216 < 224) | `.type-hero-brand` | Host Grotesk · 500 · uppercase · `ls 0.18em` · `lh 1` · `nowrap` |
| `--type-hero-subtitle` | `clamp(3rem,4.5vw,4.5rem)` ≡ `clamp(48px,4.5vw,72px)` | ~65 (4.5vw=64.8) | `.type-hero-subtitle` | DM Sans · 400 · uppercase · `ls 0.05em` · `lh 1.2` · `nowrap` |
| *(ad hoc)* | `clamp(36px,5vw,48px)` | 48 (5vw=72 → cap 48) | `.type-category` | Host Grotesk · **300** · uppercase · `ls 0.1em` · `lh 1.1` · cor `--gmt-text` |
| *(ad hoc)* | `clamp(1.125rem,2.8vw,1.75rem)` ≡ `clamp(18px,2.8vw,28px)` | 28 (2.8vw=40 → cap 28) | `.type-logo-gmt` | Host Grotesk · 500 · uppercase · `ls 0.18em` · `lh 1` |
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
| Overlay manifesto | `bg-black/25` | `/sobre` Sec3 |
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
| "Ver portfolio completo" (Home, inline) | transparente, borda `white/30` | `#ffffff` | `9999px` | `px-8 py-3.5` | `.type-label` 14px / 400 | borda `white/60` + `bg-white/10` |
| "Falar sobre um projeto" (case, inline) | `--gmt-accent` `#2563eb` | `#ffffff` | `0.5rem` (`rounded-lg`) | `px-6 py-3` | `.type-body`+`.type-medium` 18px / 500 | `--gmt-accent-2` `#7c3aed` |
| FloatingCTA (inline) | `rgba(0,0,0,0.8)` | `#ffffff` | `9999px` | `px-6 py-3.5` | DM Sans 14px / 500 | `#000` + ícone `translate-x-0.5` |
| Accordion header (`<button>`) | transparente → `bg-black` (aberto/hover) | `#0a0a0a` → `#ffffff` | `0.5rem` (`rounded-lg`) | `px-4 py-5` | `.type-body-lg` 21px / 400 | `hover:bg-black` |
| Navbar pill / hamburger | glass (ver §3.5) | conforme tema | `full` / `0.5rem` | `px-7 py-2.5` / `h-10 w-10` | `.type-label` 14px | troca de tema 300–500ms |

**Transições globais** (`globals.css`): `a, button, [role="button"]` → `transition: color/background-color/border-color 0.3s var(--ease)`. `button[type="submit"]` adiciona `transform 0.2s` + `:hover scale(1.02)`.

---

## 5. Padrão de animações e contextos de uso

| Animação | Biblioteca | Contexto / Gatilho | Duração / efeito |
|---|---|---|---|
| Reveal de conteúdo (texto/mídia) | Framer Motion (`RevealOnScroll`) | quase todas as seções; on-scroll | `1.75s`, ease `[0.16,1,0.3,1]`, stagger `0.14` (linhas) / `0.08` (itens); `y 50→0` (texto) / `36→0` (mídia) |
| Hero brand letra-a-letra + blink | Framer Motion (`HeroTitle`) | Home Hero; on-load + on-view | char `0.28s` ease `[0.2,0.65,0.3,0.9]`; blink `0.8s` |
| Frame expansivo | Framer Motion `useScroll`/`useTransform` | Home transição; on-scroll | scale `35%→100%`/`45vh→100vh`; bg `#fff→#000`; radius `16→0`; slideshow 700ms |
| FloatingCTA | Framer Motion `AnimatePresence` | global; scroll threshold | `0.35s`, `opacity`+`y 14` |
| Navbar (tema) | Framer Motion `useScroll` | global; scroll > 60px | transição CSS 300–500ms |
| Lanterna GMT | CSS `mask-image` (radial) + JS `rAF` | Home footer decorativo; on-hover cursor | foco `circle 20vw`; `opacity 0.5s` |
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
| SERV-AV-01 | Home Sec1 — Card Criação de Conteúdo (Tabela 4.4-B) | 7:5 | 1400×1000 | **Lacuna** |
| SERV-AV-02 | Home Sec1 — Card Publicidade Digital | 7:5 | 1400×1000 | **Lacuna** |
| SERV-AV-03 | Home Sec1 — Card Branding & Estratégia | 7:5 | 1400×1000 | **Lacuna** |
| SERV-AV-04 | Home Sec1 — Card Websites | 7:5 | 1400×1000 | **Lacuna** |
| SERV-AV-05 | Home Sec1 — Card Inteligência Artificial | 7:5 | 1400×1000 | **Lacuna** |
| SERV-AV-06 | Home Sec1 — Card Analytics & Otimização | 7:5 | 1400×1000 | **Lacuna** |
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
| TEST-BANNER | Home Sec5 Testemunhas (Tabela 4.4-D) | **Lacuna** — secção mostra só "Em breve"; sem asset |
| GL-04 | Home Sec4 avatar testimonial (Tabela 4.6) | Asset **existe** (`public/images/GL-04.webp`) mas **não é renderizado** (lacuna de conteúdo: sem depoimentos) |
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
| GL-04 | `public/images/GL-04.webp` | avatar 1:1 — secção de testemunhas não renderiza avatares |
| CON-01 | `public/images/CON-01.webp` | fundo 16:9 — não referenciado em `/contacto` |

### 6.5 Inventário de assets presentes em `public/`

- **`public/images/`:** HER-02, HER-03, HER-04, HER-05, ABT (não), CON-01, AGP-F1..F4, AG-01..AG-15, MKT-01, MKT-02, MKT-03, AV-01..AV-06, PF-01..PF-12, GL-01, GL-02, GL-03, GL-04.
- **`public/videos/`:** HER-01, ABT-01, ABT-02, AGH-F1, AGH-F2, AGH-F3, AGH-F4, MKT-04.
- Todos em `.webp` (vídeos ainda como `.webp`; MP4/WebM previstos no futuro pelo PLANO).

> Resumo: as únicas **lacunas reais de produção** atualmente ativas no site são os **6 cards `SERV-AV-01..06`** (Home "O que fazemos"). As demais lacunas (`PF-EB*`, `PF-02a/b`, `PF-SLOT-N`, `TEST-BANNER`) são **intencionais** ("Em breve") por falta de novos cases/depoimentos.

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
