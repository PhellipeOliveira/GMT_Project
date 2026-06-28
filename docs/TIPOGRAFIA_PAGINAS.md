# Tipografia por página — GMT site

Mapeamento completo de cada secção e elemento textual: família, tamanho, peso e notas de implementação.

**Última actualização:** 28 Jun 2026 (pós-refactor Home)  
**Fonte de verdade:** `src/styles/globals.css` + `src/app/layout.tsx`

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
| `--type-section-label` | `12px` | 12px | `.section-label` |
| `--type-body` | `18px` | 18px | `.type-body` |
| `--type-body-lg` | `21px` | 21px | `.type-body-lg` |
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
| Label | "O que fazemos" | `.section-label` + `--on-light` | DM Sans | **12px** | 500 |
| Overlay `<h3>` | Nome do serviço | `.type-body` + `font-medium` | DM Sans | 18px | 500 |
| Overlay `<p>` (hover) | 1.ª funcionalidade | `.type-body` | DM Sans | 18px | 400 |

> Cards: `ServiceOverlayCard` — texto sobre imagem, gradiente escuro, hover com blur/saturate.

---

### Secção: Por que a GMT

| Elemento | Texto exemplo | Classe | Família | Tamanho | Peso |
|----------|--------------|--------|---------|---------|------|
| Label | "Por que a GMT" | `.section-label` + `--on-light` | DM Sans | **12px** | 500 |
| Item | "Experiência comprovada" (etc.) | `.type-body` | DM Sans | 18px | 400 |

> Layout minimalista: ícone + texto curto, sem cards com caixa.

---

### Secção: Trabalhos recentes

| Elemento | Texto exemplo | Classe | Família | Tamanho | Peso |
|----------|--------------|--------|---------|---------|------|
| Label | "Trabalhos recentes" | `.section-label` + `--on-dark` | DM Sans | **12px** | 500 |
| Projecto `<h3>` | "NARA" | `.type-h3` | Host Grotesk | 36px | 400 |
| Descrição | `resumo` do case | `.type-body` | DM Sans | 18px | 400 |
| Botão | "Ver Produto →" | `.type-label` | DM Sans | 14px | 400 |

> Layout: `HomePortfolioRow` — 2 colunas (imagem | descrição + botão). Sem tags nem metadados secundários.

---

### GMT Lantern (global — acima do Footer Navigation)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<p>` ×2 | "GMT" | `.gmt-brand` + `.gmt-brand--footer` | Host Grotesk | `clamp(8rem, 33vw, 36rem)` | **800** |

> Renderizada via `GMTLightFooter` em `layout.tsx` — **antes** de `<Footer />`, em todas as páginas. Padding: `py-[2.4rem] md:py-16`.

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

### Secção: Manifesto (Sec. 03 — fundo preto, sem imagem)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<p>` citação | "O nosso compromisso é simples…" | `.type-h3` + `text-white` | Host Grotesk | 36px | 400 |

---

### Secção: Nossos valores (Sec. 04 — `.section-cta`)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Label | "Nossos valores" | `.section-label` + `.section-label--on-dark` | DM Sans | 14px | 400 |
| Item | Título do diferencial (6 itens de `DIFERENCIAIS`) | `.type-body-lg` + `text-white` | DM Sans | 21px | 400 |

Ícones `lucide-react` (`size={22}`, brancos) na segunda coluna; primeira coluna vazia em desktop.

---

### Secção: CTA final

**Removida.** Conversão via `FloatingCTA` global (`layout.tsx`).

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

**Removida.** A página termina após as três categorias do Accordion. Conversão via `FloatingCTA` global (`layout.tsx`).

---

## Página: Serviço — detalhe (`/servicos/[slug]`)

### Secção: Hero do serviço (fullscreen 70–80vh, fundo escuro)

| Elemento | Texto | Classe | Família | Tamanho | Peso | Cor |
|----------|-------|--------|---------|---------|------|-----|
| Link | "← Ver todos os serviços" | `.type-label` + `bg-white/20 border-white/25 font-medium text-white backdrop-blur-md` | DM Sans | 14px | **500** | `#ffffff` |
| `<h1>` | Nome do serviço (centrado) | `.type-hero .type-hero--fullscreen` + `!leading-[1.05]` + `!text-white` | Host Grotesk | clamp(52px → 108px) | 400 | `#ffffff` |
| `<p>` | Headline do serviço (centrado) | `text-[clamp(1.125rem,2.5vw,1.75rem)]` + `text-white` | DM Sans | clamp(18px → 28px) | 400 | `#ffffff` |

> Espaçamento: wrapper `gap-2` (8px) entre h1 e headline; line-height do h1 override local **1.05** (mais compacto que o token global).

---

### Secção: Proposta de valor

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` | "O desafio" / "A solução" | `.type-label` | DM Sans | 14px | 400 |
| `<p>` problema | Texto do desafio | `.type-h3` | Host Grotesk | 36px | 400 |
| `<p>` solução | Texto da solução | `.type-body-lg` | DM Sans | 21px | 400 |

---

### Secção: Benefícios

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` | "Benefícios" | `.type-label` | DM Sans | 14px | 400 |
| Item | Texto de benefício | `.type-body` | DM Sans | 18px | 400 |

---

### Secção: O que inclui

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` | "O que inclui" | `.type-label` | DM Sans | 14px | 400 |
| Funcionalidade | Texto da funcionalidade | `.type-body-lg` | DM Sans | 21px | 400 |

---

### Secção: Como funciona (5 slots CF-01…CF-05)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` | "Como funciona" | `.type-label` | DM Sans | 14px | 400 |
| Título do card (overlay) | Reunião inicial · Proposta… · etc. | `.type-body-lg` + `bg-white/75 backdrop-blur-md text-gmt-text` | DM Sans | 21px | 400 |
| Slots mídia | CF-01…CF-05 | `PlaceholderMedia` em card `aspect-[3/4] md:aspect-[2/3]` | — | — | — |

> Títulos fixos no template, centrados sobre cada card com caixa branca translúcida. Mídia: 2:3, 1200×1800 (ver `media-spec.ts`).

---

### Secção: Para quem é *(condicional)*

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` | "Para quem é" | `.type-label` | DM Sans | 14px | 400 |
| Tag pill | Caso de uso | `.tag-pill` → `.type-body` | DM Sans | 18px | 400 |

> **Removido desta página:** secção "Em prática" (NARA), CTA final "Quer este serviço no seu negócio?". Footer global vem do `layout.tsx`.

---

## Página: Portfolio (`/portfolio`)

### Secção: Cabeçalho

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Label | "Trabalho recente" | `.type-label` | DM Sans | 14px | 400 |
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

---

### Secção: CTA final

Padrão: `type-h3` + `type-body` + botão.

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

### Secção: "Próximo projecto"

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` | "Próximo projecto" | `.type-label` | DM Sans | 14px | 400 |
| `<h3>` | "Em breve" | `.type-h3` | Host Grotesk | 36px | 400 |
| `<p>` | "Novo case em produção" | `.type-body` | DM Sans | 18px | 400 |

---

### Secção: CTA final

Padrão: `type-h3` + `type-body` + botão.

---

## Página: Contacto (`/contacto`)

### Secção: Cabeçalho + canais

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Label | "Contacto" | `.type-label` | DM Sans | 14px | 400 |
| `<h1>` | "Vamos conversar" | `.type-h2` | Host Grotesk | clamp(42px → 72px) | 400 |
| `<p>` | "Agende uma reunião gratuita…" | `.type-body-lg` | DM Sans | 21px | 400 |
| Canal label | "Email" / "WhatsApp"… | `.type-label` | DM Sans | 14px | 400 |
| Canal valor | "contato@phellipeoliveira.org" | `.type-body` | DM Sans | 18px | 400 |

---

### Secção: Formulário

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Labels campos | "Nome", "Email"… | `.type-label` (presumido) | DM Sans | 14px | 400 |
| Inputs | Texto digitado | `.type-body` | DM Sans | 18px | 400 |
| Botão enviar | "Enviar mensagem" | `.btn-submit` | DM Sans | 18px | 500 |

---

### Secção: CTA final

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` | "Preferimos falar pessoalmente?" | `.type-h3` | Host Grotesk | 36px | 400 |
| `<p>` | "Agende uma reunião gratuita…" | `.type-body` | DM Sans | 18px | 400 |
| Botão | "Ligar agora" | `.btn-submit` | DM Sans | 18px | 500 |

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
| ~~Botão CTA~~ | ~~"Agendar reunião"~~ | — | — | — | — | **removido** — substituído pelo `FloatingCTA` global |

---

### FloatingCTA (botão flutuante global)

> Componente: `FloatingCTA.tsx` — `fixed bottom-8 left-1/2 z-60`.  
> Aparece quando `scrollY > 80% do viewport`; desaparece perto do footer (< 220px do fim da página).  
> Animação: `framer-motion AnimatePresence` — fade + slide-up suave.

| Elemento | Texto | Classe | Família | Tamanho | Peso | Notas |
|----------|-------|--------|---------|---------|------|-------|
| Botão | "Agendar reunião" | `text-sm tracking-wide` | DM Sans | 14px (0.875rem) | 500 | `bg-black/80 backdrop-blur-md`, texto branco, `rounded-full` |

---

### Footer

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Logo "GMT" | "GMT" | `.gmt-brand` + `.gmt-brand--navbar` | Host Grotesk | clamp(18px, 2.8vw, 28px) | **800** |
| Links | Navegação secundária | `.type-label` | DM Sans | 14px | 400 |
| Copyright / legal | Texto legal | `.type-label` | DM Sans | 14px | 400 |

---

## Padrão CTA (secção final preta em todas as páginas)

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
SECTION LABEL  → DM Sans 500       · 12px                        ← rótulos de secção Home
HERO SERVICE   → Host Grotesk 400  · clamp(52px, 9vw, 108px)    ← heroes de serviço
─────────────────────────────────────────────────────────────────────────────
H2 de secção   → Host Grotesk 400  · clamp(42px, 6vw, 72px)
Category       → Host Grotesk 300  · clamp(36px, 5vw, 48px)
H3 / CTA       → Host Grotesk 400  · 36px
─────────────────────────────────────────────────────────────────────────────
Body large     → DM Sans 400       · 21px
Body           → DM Sans 400       · 18px  ← tamanho base
Label          → DM Sans 400       · 14px  (uppercase, tracking)
FloatingCTA    → DM Sans 500       · 14px  (fixed global, z-60)
─────────────────────────────────────────────────────────────────────────────
Mono           → Sistema           · variável  ← números/índices
Logo GMT       → Host Grotesk 800  · clamp(18px, 2.8vw, 28px)  (navbar + footer)
Lanterna GMT   → Host Grotesk 800  · clamp(8rem, 33vw, 36rem)  (global, acima do Footer)
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
8. **FloatingCTA** — botão global; threshold: `scrollY > 80vh`; ocultação: `< 220px` do fim da página.
9. **`white-space: nowrap` no Hero** — aplicado em `.gmt-brand--hero` e `.type-hero-subtitle`.
10. **Section labels** — usar `.section-label` (12px) via `SectionLabel`, não confundir com `.type-label` (14px).
