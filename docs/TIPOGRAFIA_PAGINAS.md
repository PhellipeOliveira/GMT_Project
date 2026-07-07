# Tipografia por página — GMT site

Mapeamento completo de cada secção e elemento textual: família, tamanho, peso e notas de implementação.

**Última actualização:** 28 Jun 2026 (pós-refactor Home)  
**Fonte de verdade:** `src/styles/globals.css` + `src/app/(site)/layout.tsx`

---

## Famílias activas (referência rápida)

| Papel | Família | Pesos carregados | Token CSS |
|-------|---------|-----------------|-----------|
| **Display / títulos** | Host Grotesk | 300, 400, 500, 600, 700, **800** | `var(--font-display)` |
| **Corpo / labels** | DM Sans | 400, 500 | `var(--font-sans)` |
| **Mono** | Sistema (SFMono / Menlo) | — | `var(--font-mono)` |

---

## Escala de tamanhos (tokens)

| Token | Valor actual | Referência em px (1440px) | Classe utilitária |
|-------|-------------|--------------------------|------------------|
| `--type-label` | `14px` | 14px | `.type-label` |
| `--type-section-label` | `13px` | 13px | `.section-label` (eyebrow) |
| `--type-body-sm` | `16px` | 16px | `.type-body-sm` |
| `--type-body` | `18px` | 18px | `.type-body` |
| `--type-body-lg` | `21px` | 21px | `.type-body-lg` |
| `--type-section-title` | `clamp(30px, 4vw, 46px)` | 46px | `.type-section-title` |
| `--type-h3` | `36px` | 36px | `.type-h3` |
| `--type-h2` | `clamp(42px, 6vw, 72px)` | 72px | `.type-h2` |
| `--type-hero` | `clamp(52px, 9vw, 108px)` | 108px | `.type-hero` |
| `--type-hero-brand` | `clamp(6rem, 15vw, 14rem)` ≡ `clamp(96px, 15vw, 224px)` | ~216px | `.gmt-brand--hero` |
| `--type-hero-subtitle` | `clamp(3rem, 4.5vw, 4.5rem)` ≡ `clamp(48px, 4.5vw, 72px)` | ~65px | `.type-hero-subtitle` |
| *(ad hoc)* | `clamp(36px, 5vw, 48px)` | 48px | `.type-category` |

---

## Página: Home (`/`)

### Secção: Hero

> Fundo preto (`bg-black`). Texto branco (`--gmt-text: #ffffff` local).  
> Componente: `HeroTitle.tsx` — animação letra-a-letra com `framer-motion` + blink ao regressar.

| Elemento | Texto | Classe | Família | Tamanho actual | Peso | Notas |
|----------|-------|--------|---------|----------------|------|-------|
| `<h1>` | "GMT" | `.gmt-brand` + `.gmt-brand--hero` | Host Grotesk | `clamp(96px, 15vw, 224px)` | **800** | uppercase, `letter-spacing: 0.02em`, `scaleX(1.03)`, `white-space: nowrap`, animação letra-a-letra |
| `<p>` | "Growth Marketing Technology" | `.type-hero-subtitle` | DM Sans | `clamp(48px, 4.5vw, 72px)` | 400 | uppercase, `letter-spacing: 0.05em`, `white-space: nowrap`, animação letra-a-letra |

---

### Secção: O que fazemos

| Elemento | Texto exemplo | Classe | Família | Tamanho | Peso |
|----------|--------------|--------|---------|---------|------|
| Título de secção | "O que fazemos" | `.type-section-title` (via `SectionLabel variant="title"`) | Host Grotesk | clamp(30px → 46px) | 400 |
| Overlay `<h3>` | Nome do serviço | `.type-body-lg` + `font-medium` (`md:text-2xl`) | DM Sans | 21px → 24px | 500 |
| Overlay `<p>` (hover) | Copy editorial (`homeOverlay.body`) | `.type-body-sm` | DM Sans | 16px | 400 |
| Overlay CTA (hover) | Pergunta (`homeOverlay.cta`) | `.type-body-sm` + `font-medium` | DM Sans | 16px | 500 |

> Cards: `ServiceOverlayCard` — texto sobre imagem; no hover o gradiente dá lugar a um overlay preto (`bg-black/90`) e revela o parágrafo + CTA. Copy em `servico.homeOverlay` (`src/data/servicos.ts`).

---

### Secção: Por que a GMT

| Elemento | Texto exemplo | Classe | Família | Tamanho | Peso |
|----------|--------------|--------|---------|---------|------|
| Título de secção | "Por que a GMT" | `.type-section-title` (via `SectionLabel variant="title"`) | Host Grotesk | clamp(30px → 46px) | 400 |
| Item | "Experiência comprovada" (etc.) | `.type-body` | DM Sans | 18px | 400 |

> Layout minimalista: ícone + texto curto, sem cards com caixa.

---

### Secção: Trabalhos recentes

| Elemento | Texto exemplo | Classe | Família | Tamanho | Peso |
|----------|--------------|--------|---------|---------|------|
| Título de secção | "Trabalhos recentes" | `.type-section-title` (via `SectionLabel variant="title"`) | Host Grotesk | clamp(30px → 46px) | 400 |
| Projecto `<h3>` | "NARA" | `.type-h3` | Host Grotesk | 36px | 400 |
| Descrição | `resumo` do case | `.type-body` | DM Sans | 18px | 400 |
| Botão | "Ver Produto →" | `.type-label` | DM Sans | 14px | 400 |

> Layout: `HomePortfolioRow` — 2 colunas (imagem | descrição + botão). Sem tags nem metadados secundários.

---

### GMT Lantern (global — acima do Footer Navigation)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<p>` ×2 | "GMT" | `.gmt-brand` + `.gmt-brand--footer` | Host Grotesk | `clamp(8rem, 33vw, 36rem)` | **800** |

> Renderizada via `GMTLightFooter` em `(site)/layout.tsx` — **antes** de `<Footer />`. Padding: `.gmt-lantern-section` (`globals.css`).

---

### Marca GMT — identidade unificada (`.gmt-brand`)

| Variante | Onde | Tamanho | Peso | Tracking | Transform |
|----------|------|---------|------|----------|-----------|
| `.gmt-brand` (base) | partilhada | — | **800** | `0.02em` | `scaleX(1.03)`, `origin: center` |
| `.gmt-brand--hero` | Hero | `clamp(96px, 15vw, 224px)` | 800 | 0.02em | scaleX(1.03) |
| `.gmt-brand--navbar` | Navbar, Footer logo | `clamp(18px, 2.8vw, 28px)` | 800 | 0.02em | scaleX(1.03) |
| `.gmt-brand--footer` | Lanterna GMT | `clamp(8rem, 33vw, 36rem)` | 800 | 0.02em | scaleX(1.03) |

---

## Página: Sobre (`/sobre`)

### Secção: Introdução

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Label | "Sobre a GMT" | `.type-label` | DM Sans | 14px | 400 |
| `<h1>` | "Agência especialista em automações…" | `.type-h2` | Host Grotesk | clamp(42px → 72px) | 400 |
| `<p>` | "Objetivo claro: gerar resultados reais." | `.type-body-lg` | DM Sans | 21px | 400 |

---

### Secção: Contadores (`AboutCounterGrid`)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Valor numérico | "24+", "15+", "3+" (contagem animada de 0) | `font-mono text-5xl md:text-[8vw] lg:text-6xl` | Mono sistema | 48px → fluido → 60px (`lg`) | 400 |
| Legenda | "serviços disponíveis" / "agentes de IA prontos para trabalhar" / "pacotes de marketing" | `.type-label` | DM Sans | 14px | 400 |

Layout: card largo superior (`col-span-2`) + dois cards inferiores lado a lado.

---

### Secção: Slideshow expansivo (Sec. 02)

Sem tipografia — apenas mídia `ABT-01`…`ABT-05` em `ExpandingFrame`. Ver `docs/guia/PARTE_02_SOBRE.md`.

---

### Secção: Manifesto + Valores (Sec. 03 — `.section-cta`)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<p>` manifesto | "O nosso compromisso é simples…" | `.type-manifesto` + `!text-white` | Host Grotesk | clamp(34px → 64px) | 400 |
| Item valor | Título do diferencial (6 itens) | `.type-body-lg` + `text-white` | DM Sans | 21px | 400 |

Ícones `lucide-react` (`size={30}`, brancos), grelha centrada `sm:grid-cols-2`. **Sem** `SectionLabel` "Nossos valores".

---

### Secção: CTA final

**Removida.** Conversão via `ChatWidgetLoader` global (`(site)/layout.tsx`).

---

## Página: Serviços (`/servicos`)

### Secção: Cabeçalho

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Label | "Os nossos serviços" | `.type-label` | DM Sans | 14px | 400 |
| `<h1>` | "Serviços" | `.type-h2` | Host Grotesk | clamp(42px → 72px) | 400 |
| `<p>` | "Agência especialista em automações…" | `.type-h3` | Host Grotesk | 36px | 400 |

---

### Secção: Categorias (Accordion)

| Elemento | Texto exemplo | Classe | Família | Tamanho | Peso |
|----------|--------------|--------|---------|---------|------|
| `<h2>` categoria | "Automação & IA" | `.type-category` | Host Grotesk | clamp(36px → 48px) | **300** |
| `<p>` descrição | "15 agentes inteligentes…" | `.type-body` | DM Sans | 18px | 400 |
| Accordion título | Nome do serviço | `.type-body-lg` | DM Sans | 21px | 400 |
| Accordion subtítulo | Headline do serviço | `.type-body` | DM Sans | 18px | 400 |
| Accordion item | Funcionalidade | `.type-body` | DM Sans | 18px | 400 |
| Link "Ver serviço →" | — | `.type-body` | DM Sans | 18px | 400 |

---

### Secção: CTA final

**Removida.** A página termina após as três categorias do Accordion. Conversão via `ChatWidgetLoader` global (`layout.tsx`).

---

## Página: Serviço — detalhe (`/servicos/[slug]`)

### Secção: Hero do serviço (fullscreen 70–80vh, fundo escuro)

| Elemento | Texto | Classe | Família | Tamanho | Peso | Cor |
|----------|-------|--------|---------|---------|------|-----|
| Link anterior | "← Serviço anterior" | `.type-label` + `HERO_NAV_LINK` (vidro branco) | DM Sans | 14px | **500** | `#ffffff` |
| Link próximo | "Próximo serviço →" | idem | DM Sans | 14px | **500** | `#ffffff` |
| `<h1>` | Nome do serviço (centrado) | `.type-hero .type-hero--fullscreen` + `!leading-[1.05]` + `!text-white` | Host Grotesk | clamp(52px → 108px) | 400 | `#ffffff` |
| `<p>` | Headline do serviço (centrado) | `text-[clamp(1.125rem,2.5vw,1.75rem)]` + `text-white` | DM Sans | clamp(18px → 28px) | 400 | `#ffffff` |

> Espaçamento: wrapper `gap-3` entre h1 e headline; line-height do h1 override local **1.05** (mais compacto que o token global). Headline em `text-white/90`.

> **Padrão de secção (todo o corpo da página):** cada secção usa o par **Kicker + título**. O *Kicker* é um eyebrow visível (barra de destaque `bg-gmt-accent` + `.type-label text-gmt-text`, não cinzento) e o título é `.type-section-title` (Host Grotesk, clamp 30→46px). Secções separadas por `border-t border-gmt-border` e envolvidas em `not-prose` para controlo total. Conteúdo textual em coluna 1/3 (heading) + 2/3 (conteúdo).

---

### Secção: O desafio (hook)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Kicker | "O desafio" | barra `bg-gmt-accent` + `.type-label` `text-gmt-text` | DM Sans | 14px | 400 |
| `<p>` problema | Texto do desafio (hook prominente) | `.type-section-title` | Host Grotesk | clamp(30→46px) | 400 |

---

### Secção: A solução + benefícios

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Kicker | "A solução" | barra + `.type-label` | DM Sans | 14px | 400 |
| `<h2>` | "Como resolvemos" | `.type-section-title` | Host Grotesk | clamp(30→46px) | 400 |
| `<p>` solução | Texto da solução (só `tipo !== pacote`) | `.type-body-lg` | DM Sans | 21px | 400 |
| Benefício (card) | Item de benefício | `.type-body` em card `border` | DM Sans | 18px | 400 |

---

### Secção: O que inclui

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Kicker | "Em detalhe" | barra + `.type-label` | DM Sans | 14px | 400 |
| `<h2>` | "O que inclui" | `.type-section-title` | Host Grotesk | clamp(30→46px) | 400 |
| Preâmbulo (pacotes) | "Inclui tudo do X, mais:" | `.type-body` | DM Sans | 18px | 400 |
| Funcionalidade | Índice `01` + texto | `.type-body-lg` (índice `font-mono text-sm`) | DM Sans | 21px | 400 |

---

### Secção: Como funciona (5 slots CF-01…CF-05)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Kicker | "O processo" | barra + `.type-label` | DM Sans | 14px | 400 |
| `<h2>` | "Como funciona" | `.type-section-title` | Host Grotesk | clamp(30→46px) | 400 |
| Título do card (overlay) | Índice + "Reunião inicial" · etc. | `.type-body` + `bg-white/80 backdrop-blur-md` (rodapé do card) | DM Sans | 18px | 400 |
| Slots mídia | CF-01…CF-05 | `PlaceholderMedia` em card `aspect-[3/4] md:aspect-[2/3]` | — | — | — |

---

### Secção: Para quem é

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Kicker | "Ideal para" | barra + `.type-label` | DM Sans | 14px | 400 |
| `<h2>` | "Para quem é" | `.type-section-title` | Host Grotesk | clamp(30→46px) | 400 |
| Tag pill / fallback | Caso de uso (ou texto genérico) | `.tag-pill` / `.type-body-lg` | DM Sans | 18–21px | 400 |
| CTA | "Falar sobre este serviço →" | `.type-label` + `rounded-full bg-black text-white` | DM Sans | 14px | 400 |

> Todas as secções sempre presentes (avulsos e pacotes agora têm `problema`, `solucao` e `beneficios` preenchidos a partir de `docs/referencias`). Footer global vem do `layout.tsx`.

---

## Página: Portfolio (`/portfolio`)

### Secção: Cabeçalho

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Label | "Trabalho recente" | `.type-section-title` (via `SectionLabel variant="title"`) | Host Grotesk | clamp(30→46px) | 400 |
| `<h1>` | "Portfolio" | `.type-h2` | Host Grotesk | clamp(42px → 72px) | 400 |
| `<p>` | "Criámos integralmente o NARA…" | `.type-body-lg` | DM Sans | 21px | 400 |

---

### Secção: Lista de projectos

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Índice | "01", "02"… | `font-mono .type-body` | Mono sistema | 18px | 400 |
| `<h3>` projecto | Nome do case | `.type-h3` | Host Grotesk | 36px | 400 |
| Local | Localização | `.type-body` | DM Sans | 18px | 400 |
| Tag pill | Tag | `.tag-pill` → `.type-body` | DM Sans | 18px | 400 |
| Seta | "→" | inline | DM Sans | 18px | 400 |

> Apenas o case **NARA** listado. Sem CTA final nesta página — conversão via `ChatWidgetLoader` global.

---

## Página: Case — detalhe (`/portfolio/[slug]`)

### Secção: Ficha lateral (sticky)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Link | "← Portfolio" | `.type-label` | DM Sans | 14px | 400 |
| `<h1>` | Nome do case | `.type-h2` | Host Grotesk | clamp(42px → 72px) | 400 |
| Tag | Tags do projecto | `.type-body` | DM Sans | 18px | 400 |
| `<p>` resumo | Resumo do case | `.type-body-lg` | DM Sans | 21px | 400 |
| `<dt>` | "Localização" / "Indústria" / "Serviços" | `.type-label` | DM Sans | 14px | 400 |
| `<dd>` | Valor correspondente | `.type-body` | DM Sans | 18px | 400 |
| CTA botão | "Falar sobre um projecto" | `.type-body .type-medium` | DM Sans | 18px | **500** |

---

### Secção: Lista de projectos

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Índice | "01" | `font-mono .type-body` | Mono sistema | 18px | 400 |
| `<h3>` | Nome do case (`NARA`) | `.type-h3` | Host Grotesk | 36px | 400 |
| Local | Localização | `.type-body` | DM Sans | 18px | 400 |
| Tag pill | Tags | `.tag-pill` | DM Sans | 18px | 400 |
| Seta | "→" | inline | DM Sans | 18px | 400 |

> Apenas cases reais de `portfolio.ts`. Sem placeholders "Em breve" nem CTA final — conversão via `ChatWidgetLoader` global.

---

## Página: Contacto (`/contacto`)

### Secção: Cabeçalho

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Label | "Contacto" | `.type-section-title` (via `SectionLabel variant="title"`) | Host Grotesk | clamp(30→46px) | 400 |
| `<h1>` | "Vamos conversar" | `.type-h2` | Host Grotesk | clamp(42px → 72px) | 400 |
| `<p>` | "Agende uma reunião gratuita…" | `.type-body-lg` | DM Sans | 21px | 400 |

### Secção: Formulário (split)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Label coluna | "Conte-nos o essencial" | `.type-section-title` | Host Grotesk | clamp(30→46px) | 400 |
| Link telefone | "Prefere ligar? +351…" | `.type-label` + underline | DM Sans | 14px | 400 |
| Labels campos | "Nome", "Email"… | `.type-body` (flutuante) | DM Sans | 18px → 14px | 400 |
| Inputs | Texto digitado | `.type-body` | DM Sans | 18px | 400 |
| Botão enviar | "Enviar mensagem" | `.btn-submit` | DM Sans | 18px | 500 |

> **Sem** secção CTA final "Preferimos falar pessoalmente?". **Sem** bloco de canais (Email/WhatsApp/LinkedIn) na UI.

---

## Elementos globais (Navbar + Footer)

### Navbar

> Componente: `Navbar.tsx` — `fixed inset-x-0 top-0 z-50`.  
> Logo com container glass (`bg-black/55 backdrop-blur-md`): sempre visível em páginas claras; aparece no scroll na Home.  
> Pill de navegação adapta cores conforme hero escuro / scroll.

| Elemento | Texto | Classe | Família | Tamanho | Peso | Notas |
|----------|-------|--------|---------|---------|------|-------|
| Logo "GMT" | "GMT" | `.gmt-brand` + `.gmt-brand--navbar` | Host Grotesk | `clamp(18px, 2.8vw, 28px)` | **800** | sempre `tone="on-dark"`; `ls 0.02em`, `scaleX(1.03)`; glass transparente na Home até scroll |
| Links de navegação | "Serviços", "Portfolio"… | `.type-label` | DM Sans | 14px | 400 | pill dark ou light conforme contexto |
| ~~Botão CTA~~ | ~~"Agendar reunião"~~ | — | — | — | — | **removido** — substituído pelo `ChatWidgetLoader` global |

---

### ChatWidgetLoader (agente IA global)

> Componente: `ChatWidgetLoader.tsx` → `ChatWidget` — `fixed bottom-4 right-4 z-[70]`.  
> Label contextual via `data-agent-hint` ou rota. Painel expansível com `AnimatePresence`.

| Elemento | Texto | Classe | Notas |
|----------|-------|--------|-------|
| Launcher | Label contextual | `ChatLauncher` | canto inferior direito |
| Painel | Chat do agente | `ChatHeader`, `ChatMessages`, `ChatInput` | `ssr: false` |

---

### Footer

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Subtítulo | "Growth Marketing Technology" | `.type-footer-subtitle` (centrado, branco) | Host Grotesk | clamp(24px → 80px) | 400 |
| Headline coluna | "Automação & IA" (etc.) | `.type-label` + `text-white` | DM Sans | 14px | 400 |
| Links | Navegação | `.type-body` + `text-white` | DM Sans | 18px | 400 |
| Copyright | Texto legal | `.type-label` + `text-white` | DM Sans | 14px | 400 |

> **Fundo:** `bg-black` / `.section-footer`. **Espaçamento:** `py-20 md:py-28`, `mb-16 md:mb-24` (subtítulo).

---

## Padrão CTA (secção final preta — Home e Sobre)

Apenas **`/`** e **`/sobre`** terminam com `.section-cta`. Outras rotas terminam em fundo claro antes do GMT Lantern.

```
Fundo: #000000 (section-cta)
Texto: branco

h2  → .type-h3 · Host Grotesk · 36px · weight 400
p   → .type-body · DM Sans · 18px · weight 400
btn → .btn-submit → base .type-body · DM Sans · 18px · weight 500
```

---

## Hierarquia visual resumida

```
HERO BRAND     → Host Grotesk 800  · clamp(96px, 15vw, 224px)   ← Home Hero · ls 0.02em · scaleX(1.03)
HERO SUBTITLE  → DM Sans 400       · clamp(48px, 4.5vw, 72px)   ← só Home · tracking 0.05em
HERO SERVICE   → Host Grotesk 400  · clamp(52px, 9vw, 108px)    ← heroes de serviço
─────────────────────────────────────────────────────────────────────────────
H2 / página    → Host Grotesk 400  · clamp(42px, 6vw, 72px)     ← títulos de página / hero
SECTION TITLE  → Host Grotesk 400  · clamp(30px, 4vw, 46px)     ← título de cada secção de conteúdo
Category       → Host Grotesk 300  · clamp(36px, 5vw, 48px)
H3 / cartão    → Host Grotesk 400  · 36px
─────────────────────────────────────────────────────────────────────────────
Body large     → DM Sans 400       · 21px  (lead / introdução)
Body           → DM Sans 400       · 18px  ← tamanho base
Body small     → DM Sans 400       · 16px  (overlays, legendas, denso)
Eyebrow        → DM Sans 500       · 13px  (uppercase — acima do título)
Label          → DM Sans 400       · 14px  (uppercase, tracking)
ChatWidgetLoader    → DM Sans 500       · 14px  (fixed global, z-60)
─────────────────────────────────────────────────────────────────────────────
Mono           → Sistema           · variável  ← números/índices
Logo GMT       → Host Grotesk 800  · clamp(18px, 2.8vw, 28px)  (navbar + footer)
Lanterna GMT   → Host Grotesk 800  · clamp(6.4rem, 26.4vw, 28.8rem)
```

---

## Notas para ajustes futuros

1. **Para aumentar todo o corpo** — alterar `--type-body` em `:root` no `globals.css`.
2. **Para trocar a fonte display** — alterar `--font-display` em `@theme inline` + importar nova fonte em `layout.tsx`.
3. **Para trocar a fonte de corpo** — alterar `--font-sans` + importar em `layout.tsx`.
4. **Peso 800** — usado pela marca GMT (`.gmt-brand`); pesos 600/700 também carregados mas sem uso activo fora da marca.
5. **Host Grotesk 300 só é usado em `.type-category`** — se remover essa classe, pode remover o peso 300 do import.
6. **LaCerchia** — referenciada nos design maps como fonte serif decorativa; não está activa. Para activar, usar `next/font/local` com ficheiro em `public/fonts/`.
7. **`letter-spacing` do subtítulo Hero** — `0.05em` (26 Jun 2026).
8. **ChatWidgetLoader** — agente IA; `fixed bottom-4 right-4`; label contextual por secção.
9. **`white-space: nowrap` no Hero** — aplicado em `.gmt-brand--hero` e `.type-hero-subtitle`.
10. **Section labels** — eyebrow `.section-label` (**13px**) vs título `.type-section-title` via `SectionLabel variant="title"`.
