# Tipografia — guia de implementação

Este documento descreve como o repositório define fontes, escalas e estilos de texto no website GMT. Use-o ao alterar tipografia, carregar novas fontes ou pedir mudanças a um agente de IA.

---

## Resumo executivo

| Pergunta | Resposta |
|----------|----------|
| Onde vive a tipografia? | `src/styles/globals.css` (tokens + classes), `src/app/layout.tsx` (carregamento de fontes), `tailwind.config.ts` (espelho para utilitários Tailwind) |
| Fontes activas | **DM Sans** (corpo, labels) e **Host Grotesk** (títulos display) via `next/font/google` |
| Escala de tamanhos | Tokens `--type-*` em px / clamp; classes utilitárias `.type-*` |
| Pesos usados | 400, 500 (corpo); 300–800 (display, marca GMT em **800**) |
| Onde mudar para trocar fontes? | `layout.tsx` (import) + `globals.css` (`@theme inline` e classes `.type-*`) + `tailwind.config.ts` |

---

## Arquitetura em camadas

```
┌─────────────────────────────────────────────────────────────┐
│  Componentes (TSX)                                          │
│  className="type-h2"  /  className="type-label text-gmt-muted" │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────▼────────┐                    ┌─────────▼────────┐
│ Classes .type-* │                    │ Tailwind text-*  │
│ (globals.css)  │                    │ text-label, etc. │
└───────┬────────┘                    └─────────┬────────┘
        │                                       │
        └───────────────────┬───────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Tokens CSS (:root + @theme inline)                         │
│  --type-body, --font-sans, --font-display                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  next/font (layout.tsx)                                     │
│  --font-dmsans, --font-hostgrotesk                          │
└─────────────────────────────────────────────────────────────┘
```

**Regra de ouro:** preferir classes `.type-*` nos componentes. Elas encapsulam família, tamanho, peso e line-height de forma consistente.

---

## Famílias tipográficas

### Carregamento (`src/app/layout.tsx`)

```ts
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dmsans",
  display: "swap",
});

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-hostgrotesk",
  display: "swap",
});
```

As variáveis são injectadas no `<html>` via `className={dmSans.variable} ${hostGrotesk.variable}`.

### Papéis

| Papel | Variável next/font | Token tema | Classe Tailwind | Uso no site |
|-------|-------------------|------------|-----------------|-------------|
| **Sans / corpo** | `--font-dmsans` | `--font-sans` | `font-sans` | Body, labels, botões, formulários, parágrafos |
| **Display / títulos** | `--font-hostgrotesk` | `--font-display` | `font-display` | H1 hero, H2 de secção, H3 de cartão (via `.type-h2`, `.type-h3`, `.type-hero`) |
| **Mono** | — (sistema) | `--font-mono` | `font-mono` | Números grandes (estatísticas Sobre), índice de portfolio, IDs em placeholders |

### O que não está activo

- **LaCerchia** — referenciada nos design maps (`docs/referencias/site_json/`) como fonte serif decorativa; **não está carregada** no código actual.
- **Geist** — apenas no legado `src/styles/tokens.css` (não importado).

---

## Escala tipográfica

### Tokens (`:root` em `globals.css`)

**Última actualização da escala:** Junho 2026 — aumento global ~12–20% para melhor legibilidade.

| Token | Valor | Papel semântico |
|-------|-------|-----------------|
| `--type-label` | `14px` | Labels uppercase, metadados, botões CTA |
| `--type-section-label` | `12px` | Rótulos de secção (topo esquerdo, Home) |
| `--type-body` | `18px` | Texto corrido, inputs, botões (também no `body`) |
| `--type-body-lg` | `21px` | Lead / parágrafo introdutório |
| `--type-h3` | `36px` | Títulos de cartão, nomes de projeto |
| `--type-h2` | `72px` | Títulos de secção (com clamp responsivo na classe) |
| `--type-hero` | `clamp(52px, 9vw, 108px)` | H1 de hero fullscreen (serviços) |
| `--type-hero-brand` | `clamp(6rem, 15vw, 14rem)` | Tamanho da variante `.gmt-brand--hero` |
| `--type-hero-subtitle` | `clamp(3rem, 4.5vw, 4.5rem)` | Subtítulo «Growth Marketing Technology» |
| `--type-hero-leading` | `clamp(1, 8vw, 1.1)` | Line-height viewport-relative só em heroes |

### Classes utilitárias (preferidas)

Definidas em `src/styles/globals.css`:

| Classe | Fonte | Tamanho | Peso | Detalhes |
|--------|-------|---------|------|----------|
| `.type-label` | DM Sans | 14px | 400 | `letter-spacing: 0.1em`, uppercase |
| `.section-label` | DM Sans | 12px | 500 | `letter-spacing: 0.14em`, uppercase — rótulos de secção |
| `.type-body` | DM Sans | 18px | 400 | line-height 1.5 — **tamanho base do site** |
| `.type-body-lg` | DM Sans | 21px | 400 | line-height 1.55 |
| `.type-h3` | Host Grotesk | 36px | 400 | line-height 1.2, cor `gmt-text` |
| `.type-h2` | Host Grotesk | clamp(42px, 6vw, 72px) | 400 | line-height 1.1 |
| `.type-hero` | Host Grotesk | clamp hero | 400 | cor `gmt-text` |
| `.gmt-brand` | Host Grotesk | — | **800** | base da marca GMT: `ls 0.02em`, `scaleX(1.03)` |
| `.gmt-brand--hero` | Host Grotesk | clamp brand | 800 | Home Hero |
| `.gmt-brand--navbar` | Host Grotesk | clamp(18px, 2.8vw, 28px) | 800 | Navbar + Footer logo |
| `.gmt-brand--footer` | Host Grotesk | clamp(8rem, 33vw, 36rem) | 800 | Lanterna GMT |
| `.type-hero-subtitle` | DM Sans | clamp subtitle | 400 | Home — uppercase, tracking 0.05em |
| `.type-hero--fullscreen` | — | — | — | Line-height viewport-relative |
| `.type-medium` | — | — | 500 | Modificador de peso |

### Exemplos de uso real

```tsx
{/* Rótulo de secção (Home) */}
<SectionLabel tone="on-dark">Trabalhos recentes</SectionLabel>

{/* Marca GMT */}
<h1 className="gmt-brand gmt-brand--hero text-white">GMT</h1>

{/* Título de página */}
<RevealText as="h1" className="type-h2 mt-4">...</RevealText>

{/* Hero fullscreen */}
<RevealText as="h1" className="type-hero type-hero--fullscreen mt-5">...</RevealText>

{/* Botão */}
<button className="type-body type-medium ...">Enviar</button>
```

### Utilitários Tailwind alternativos (`tailwind.config.ts`)

Espelham a escala para quem preferir `text-*` em vez de `.type-*`:

| Classe Tailwind | Equivalente aproximado |
|-----------------|----------------------|
| `text-label` | `.type-label` |
| `text-body` | `.type-body` |
| `text-body-lg` | `.type-body-lg` |
| `text-h3` | `.type-h3` |
| `text-h2` | `.type-h2` |
| `text-hero` | `.type-hero` |

Na prática, **quase todos os componentes usam `.type-*`**, não `text-label`. Ao adicionar código novo, siga essa convenção.

### Tamanhos ad hoc (evitar quando possível)

Alguns componentes usam valores viewport-relative herdados do design de referência:

- `md:text-[8vw] lg:text-6xl` — números dos contadores na página Sobre (`AboutCounterGrid`)
- `text-5xl`, `text-xs` — excepções pontuais

Ao reconstruir a escala, considere absorver estes valores em novos tokens (ex.: `--type-stat`) em vez de deixá-los espalhados.

---

## Pesos

| Peso | Token / config | Uso |
|------|----------------|-----|
| 400 | `--font-weight-normal`, `.type-*` default | Quase todo o texto |
| 500 | `--font-weight-medium`, `.type-medium`, `font-medium` | Botões, ênfase, `.section-label` |
| 800 | `--font-weight-brand`, `.gmt-brand` | Marca GMT exclusivamente |

Host Grotesk está carregada com 300, 400, 500, 600, 700 e 800. DM Sans com 400 e 500.

---

## Prose (conteúdo longo)

O `<main>` em `layout.tsx` aplica:

```tsx
<main className="prose prose-gmt max-w-none flex-1">
```

- `prose` — plugin `@tailwindcss/typography`, tema **claro** (fundo branco)
- `prose-gmt` — overrides em `globals.css` para cores de headings e parágrafos (`--gmt-text`, `--gmt-text-muted`)

Ver também `docs/PALETA_DE_CORES.md` para o ritmo branco → CTA preto → footer.

---

## Body global

```css
body {
  font-family: var(--font-sans);   /* DM Sans */
  font-size: var(--type-body);     /* 18px */
  font-weight: 400;
}
```

Elementos sem classe `.type-*` herdam corpo 18px DM Sans.

---

## Nomenclatura: como falar sobre tipografia neste repo

### Use

- **Label** → `.type-label` (14px, uppercase, tracking largo)
- **Rótulo de secção** → `.section-label` (12px, via `SectionLabel`)
- **Marca GMT** → `.gmt-brand` + variante (`--hero`, `--navbar`, `--footer`)
- **Corpo** → `.type-body` ou `.type-body-lg`
- **Título de secção** → `.type-h2`
- **Título de cartão** → `.type-h3`
- **Hero** → `.type-hero` (+ `--fullscreen` se viewport-leading)
- **Fonte display** → Host Grotesk
- **Fonte corpo** → DM Sans
- **Ênfase média** → `.type-medium` (500)

### Evite ambiguidade

- "Fonte principal" → especifique display ou corpo
- "Título grande" → diga hero (`type-hero`) ou secção (`type-h2`)
- Referências aos design maps (`text-6xl`, `text-[1vw]`) — são do site auditado, não necessariamente do código GMT

### Exemplo de pedido claro a um agente

> Trocar display para **Instrument Serif** e corpo para **Inter**. Carregar via next/font em `layout.tsx`, actualizar `--font-display` e `--font-sans` no `@theme inline`, e rever todas as classes `.type-*` em `globals.css`. Manter a escala actual (label 14px, body 18px, h2 72px, hero clamp).

---

## Procedimento: adoptar nova tipografia

### Passo 1 — Escolher fontes e papéis

Defina:

1. Fonte de corpo (sans)
2. Fonte de títulos (display) — pode ser a mesma família com peso diferente
3. Fonte mono (opcional; hoje é stack de sistema)
4. Pesos necessários (mínimo 400 e 500)

### Passo 2 — Carregar fontes (`src/app/layout.tsx`)

1. Importar de `next/font/google` (ou `next/font/local` para ficheiros em `public/fonts/`)
2. Configurar `variable: "--font-..."` 
3. Adicionar a variável ao `className` do `<html>`
4. Remover imports antigos se substituir completamente

### Passo 3 — Actualizar tokens (`src/styles/globals.css`)

No `@theme inline`:

```css
--font-display: var(--font-NOVA_DISPLAY), ui-sans-serif, sans-serif;
--font-sans: var(--font-NOVA_SANS), ui-sans-serif, sans-serif;
```

Rever cada classe `.type-*` — especialmente qual família usa cada nível (hoje display = Host Grotesk, corpo = DM Sans).

### Passo 4 — Actualizar `tailwind.config.ts`

Sincronizar `theme.extend.fontFamily` e, se a escala mudar, `fontSize` / `fontWeight`.

### Passo 5 — Ajustar escala (se necessário)

Alterar tokens `--type-*` no `:root` e os valores correspondentes nas classes `.type-*` e em `tailwind.config.ts` **em conjunto**.

Se mudar `--type-h2`, a classe `.type-h2` já usa `clamp(36px, 6vw, var(--type-h2))` — basta actualizar o token.

### Passo 6 — Verificar componentes com excepções

```bash
rg 'text-\[|text-xl|text-2xl|text-5xl|text-6xl|font-' src/
```

Actualizar ou tokenizar tamanhos hardcoded.

### Passo 7 — Validar

- [ ] FOUT/FOIT aceitável (`display: "swap"` já configurado)
- [ ] Hierarquia visual: label < body < h3 < h2 < hero
- [ ] Legibilidade de `type-label` uppercase em mobile
- [ ] Formulários e botões com `type-body`
- [ ] Heroes com `type-hero--fullscreen` sem clipping
- [ ] `RevealText` com novas fontes (animación por letra — verificar line-height)
- [ ] `npm run build` sem erros

---

## Componentes tipográficos especiais

### `RevealText`

Animação letra a letra (Framer Motion). Recebe `className` com estilos tipográficos (ex.: `type-h2`). Ao mudar line-height ou tamanho do hero, testar especialmente com textos longos.

### `font-mono` pontual

Usado para **dados**, não para prose:

- Índice `01`, `02` na lista de portfolio
- Números de estatísticas na página Sobre
- Texto em `PlaceholderMedia`

Se adoptar uma mono da marca, carregar em `layout.tsx` e actualizar `--font-mono` no `@theme inline`.

---

## Relação com design maps

Os JSON em `docs/referencias/site_json/` listam tamanhos como `text-6xl`, `md:text-[6vw]` e fontes não carregadas (LaCerchia). O código GMT **simplificou** para a escala `--type-*` + classes `.type-*`.

Ao alinhar com um design map, traduza cada tamanho para um token existente ou crie um token novo — não copie classes viewport-relative sem decisão consciente.

---

## Ficheiro legado `tokens.css`

Contém escala alternativa em `rem` (`--text-xs` … `--text-4xl`) e fontes Geist. **Não está importado.** A escala activa é `--type-*` em `globals.css`.

---

## Checklist rápido

- [ ] Fontes carregadas em `layout.tsx` com pesos correctos
- [ ] Variáveis CSS no `<html>`
- [ ] `@theme inline` actualizado (`--font-sans`, `--font-display`, `--font-mono`)
- [ ] Classes `.type-*` revistas (família + tamanho)
- [ ] `tailwind.config.ts` sincronizado
- [ ] `.prose-gmt` legível com novas fontes
- [ ] Excepções `text-[...]` / `text-5xl` tratadas
- [ ] Teste visual em todas as rotas + formulário

---

## Ficheiros de referência

| Ficheiro | Papel |
|----------|-------|
| `src/app/layout.tsx` | Carregamento next/font, defaults do body |
| `src/styles/globals.css` | Tokens `--type-*`, classes `.type-*`, prose |
| `tailwind.config.ts` | Espelho fontFamily / fontSize para Tailwind |
| `src/styles/tokens.css` | Legado — ignorar |
| `docs/referencias/site_json/design_map_*.json` | Auditoria tipográfica do site de referência |
