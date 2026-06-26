# Tipografia por página — GMT site

Mapeamento completo de cada secção e elemento textual: família, tamanho, peso e notas de implementação.

**Última actualização:** Junho 2026  
**Fonte de verdade:** `src/styles/globals.css` + `src/app/layout.tsx`

---

## Famílias activas (referência rápida)

| Papel | Família | Pesos carregados | Token CSS |
|-------|---------|-----------------|-----------|
| **Display / títulos** | Host Grotesk | 300, 400, 500 | `var(--font-display)` |
| **Corpo / labels** | DM Sans | 400, 500 | `var(--font-sans)` |
| **Mono** | Sistema (SFMono / Menlo) | — | `var(--font-mono)` |

---

## Escala de tamanhos (tokens)

| Token | Valor | Classe utilitária |
|-------|-------|------------------|
| `--type-label` | 14px | `.type-label` |
| `--type-body` | 18px | `.type-body` |
| `--type-body-lg` | 21px | `.type-body-lg` |
| `--type-h3` | 36px | `.type-h3` |
| `--type-h2` | `clamp(42px, 6vw, 72px)` | `.type-h2` |
| `--type-hero` | `clamp(52px, 9vw, 108px)` | `.type-hero` |
| `--type-hero-brand` | `clamp(72px, 14vw, 176px)` | `.type-hero-brand` |
| `--type-hero-subtitle` | `clamp(144px, 24vw, 240px)` | `.type-hero-subtitle` |
| *(ad hoc)* | `clamp(36px, 5vw, 48px)` | `.type-category` |

---

## Página: Home (`/`)

### Secção: Hero

> Fundo preto (`bg-black`). Texto branco (`--gmt-text: #ffffff` local).

| Elemento | Texto | Classe | Família | Tamanho | Peso | Notas |
|----------|-------|--------|---------|---------|------|-------|
| `<h1>` | "GMT" | `.type-hero-brand` | Host Grotesk | clamp(72px → 176px) | 500 | uppercase, tracking 0.18em, animação letra-a-letra |
| `<p>` | "Growth Marketing Technology" | `.type-hero-subtitle` | DM Sans | clamp(144px → 240px) | 400 | uppercase, tracking 0.22em, `w-[60%]`, animação letra-a-letra |

---

### Secção: O que fazemos

| Elemento | Texto exemplo | Classe | Família | Tamanho | Peso |
|----------|--------------|--------|---------|---------|------|
| Label | "O que fazemos" | `.type-label` | DM Sans | 14px | 400 |
| Card `<h3>` | Nome do serviço | `.type-body` | DM Sans | 18px | 400 |
| Card `<p>` | 1.ª funcionalidade | `.type-body` | DM Sans | 18px | 400 |

---

### Secção: Porquê a GMT

| Elemento | Texto exemplo | Classe | Família | Tamanho | Peso |
|----------|--------------|--------|---------|---------|------|
| Label | "Porquê a GMT" | `.type-label` | DM Sans | 14px | 400 |
| `<h2>` | "Cada negócio, por mais pequeno…" | `.type-h3` | Host Grotesk | 36px | 400 |
| `<h3>` diferencial | "Experiência comprovada" | `.type-body` | DM Sans | 18px | 400 |
| `<p>` diferencial | Texto descritivo | `.type-body` | DM Sans | 18px | 400 |

---

### Secção: Trabalho recente

| Elemento | Texto exemplo | Classe | Família | Tamanho | Peso |
|----------|--------------|--------|---------|---------|------|
| Label | "Trabalho recente" | `.type-label` | DM Sans | 14px | 400 |
| Card `<h3>` | Nome do projecto | `.type-h3` | Host Grotesk | 36px | 400 |
| Card `<h4>` | Local / Indústria | `.type-body` | DM Sans | 18px | 400 |

---

### Secção: CTA final

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` | "Pronto para automatizar o seu negócio?" | `.type-h3` | Host Grotesk | 36px | 400 |
| `<p>` | "Reunião gratuita e sem compromisso." | `.type-body` | DM Sans | 18px | 400 |
| Botão | "Agendar agora" | `.btn-submit` → base `.type-body` | DM Sans | 18px | 500 |

---

## Página: Sobre (`/sobre`)

### Secção: Introdução

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Label | "Sobre a GMT" | `.type-label` | DM Sans | 14px | 400 |
| `<h1>` | "Agência especialista em automações…" | `.type-h2` | Host Grotesk | clamp(42px → 72px) | 400 |
| `<p>` | "Objetivo claro: gerar resultados reais." | `.type-body-lg` | DM Sans | 21px | 400 |

---

### Secção: Contadores

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Valor numérico | "15", "24", "70/30" | `font-mono text-5xl md:text-[10vw]` | Mono sistema | 48px → ~144px | 400 |
| Legenda | "agentes de IA prontos a trabalhar" | `.type-label` | DM Sans | 14px | 400 |

---

### Secção: Manifesto (imagem fullscreen)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<p>` cita | "O nosso compromisso é simples…" | `.type-h3 italic` | Host Grotesk | 36px | 400 |

---

### Secção: Valores / Porquê escolher-nos

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` label | "Porquê escolher-nos" | `.type-label` | DM Sans | 14px | 400 |
| Valor `<h3>` | "Experiência comprovada" | `.type-h3` | Host Grotesk | 36px | 400 |
| Valor `<p>` | Texto descritivo | `.type-body` | DM Sans | 18px | 400 |

---

### Secção: CTA final

Igual ao padrão CTA — `type-h3` + `type-body` + botão `btn-submit`.

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

Padrão: `type-h3` + `type-body` + botão.

---

## Página: Serviço — detalhe (`/servicos/[slug]`)

### Secção: Hero do serviço (fullscreen 70–80vh, fundo escuro)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Link | "← Serviços" | `.type-label` | DM Sans | 14px | 400 |
| `<h1>` | Nome do serviço | `.type-hero .type-hero--fullscreen` | Host Grotesk | clamp(52px → 108px) | 400 |
| `<p>` | Headline do serviço | `.type-body-lg` | DM Sans | 21px | 400 |

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

### Secção: Como funciona (processo)

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` | "Como funciona" | `.type-label` | DM Sans | 14px | 400 |
| Número passo | "01", "02"… | `font-mono .type-body` | Mono sistema | 18px | 400 |
| Título passo | "Reunião inicial" | `.type-body-lg` | DM Sans | 21px | 400 |
| Resumo passo | Texto descritivo | `.type-body` | DM Sans | 18px | 400 |

---

### Secção: Para quem é / Em prática / CTA

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| `<h2>` | "Para quem é" / "Em prática" | `.type-label` | DM Sans | 14px | 400 |
| Tag pill | Caso de uso | `.tag-pill` → `.type-body` | DM Sans | 18px | 400 |
| CTA `<h2>` | "Quer este serviço no seu negócio?" | `.type-h3` | Host Grotesk | 36px | 400 |

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

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Logo "GMT" | "GMT" | `.type-logo-gmt` | Host Grotesk | clamp(18px, 2.8vw, 28px) | 500 |
| Links de navegação | "Serviços", "Portfolio"… | `.type-label` | DM Sans | 14px | 400 |
| Botão CTA | "Agendar reunião" | `.type-label .type-medium` | DM Sans | 14px | **500** |

---

### Footer

| Elemento | Texto | Classe | Família | Tamanho | Peso |
|----------|-------|--------|---------|---------|------|
| Logo "GMT" | "GMT" | `.type-logo-gmt` | Host Grotesk | clamp(18px, 2.8vw, 28px) | 500 |
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
HERO BRAND     → Host Grotesk 500  · clamp(72px → 176px)   ← só Home
HERO SUBTITLE  → DM Sans 400       · clamp(144px → 240px)  ← só Home
HERO SERVICE   → Host Grotesk 400  · clamp(52px → 108px)   ← heroes de serviço
─────────────────────────────────────────────────────────────
H2 de secção   → Host Grotesk 400  · clamp(42px → 72px)
Category       → Host Grotesk 300  · clamp(36px → 48px)
H3 / CTA       → Host Grotesk 400  · 36px
─────────────────────────────────────────────────────────────
Body large     → DM Sans 400       · 21px
Body           → DM Sans 400       · 18px  ← tamanho base
Label          → DM Sans 400       · 14px  (uppercase, tracking)
─────────────────────────────────────────────────────────────
Mono           → Sistema           · variável  ← números/índices
```

---

## Notas para ajustes futuros

1. **Para aumentar todo o corpo** — alterar `--type-body` em `:root` no `globals.css`.
2. **Para trocar a fonte display** — alterar `--font-display` em `@theme inline` + importar nova fonte em `layout.tsx`.
3. **Para trocar a fonte de corpo** — alterar `--font-sans` + importar em `layout.tsx`.
4. **Peso 600/700 ainda não carregado** — se precisar, adicionar ao array `weight` em `layout.tsx`.
5. **Host Grotesk 300 só é usado em `.type-category`** — se remover essa classe, pode remover o peso 300 do import.
6. **LaCerchia** — referenciada nos design maps como fonte serif decorativa; não está activa. Para activar, usar `next/font/local` com ficheiro em `public/fonts/`.
