# GUIA DE EDIÇÃO — PARTE 04 · SERVIÇO · DETALHE (`/servicos/[slug]`)

> Documentação do **template único** de página individual de serviço.
>
> **Arquivo principal:** `src/app/servicos/[slug]/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (§ 4.2-C), `src/styles/globals.css`, `src/data/media-spec.ts`, `src/lib/media.ts`, `src/data/servicos.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`.
>
> **Actualização:** 28 Jun 2026 — alinhado ao refactor do template (hero centralizada, slots CF-01…05, remoção de CTA final e secção “Em prática”).

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
- Container: `h-[80vh] md:h-[70vh]`, overlay `bg-gradient-to-t from-black via-black/40 to-transparent`
- Conteúdo textual: `flex h-full flex-col items-center justify-center text-center`
- Botão voltar: `absolute bottom-0 left-0` com `px-5 pb-12 md:px-[5vw] md:pb-[5vw]`

### Copy / tipografia

| Campo | Botão voltar | `<h1>` | `<p>` headline |
|---|---|---|---|
| Conteúdo | `← Ver todos os serviços` | `servico.nome` (dados) | `servico.headline` (dados; condicional) |
| Elemento HTML | `a` (`Link`) | `h1` | `p` |
| Classe | `.type-label` + utilitários inline | `.type-hero` + `.type-hero--fullscreen` | `text-[clamp(1.125rem,2.5vw,1.75rem)]` |
| Família | DM Sans | Host Grotesk | DM Sans (tamanho fluido via `clamp`) |
| Tamanho | 14px (label) | `clamp(52px,9vw,108px)` via `--type-hero` | `clamp(1.125rem, 2.5vw, 1.75rem)` — **menor que o h1** |
| Peso | 400 | 400 | 400 |
| Cor | `text-gmt-text` (`#0a0a0a`) sobre fundo branco translúcido | `#ffffff` (`!text-white`) | `text-white/80` |

> `line-height` do h1 = `var(--type-hero-leading)` = `clamp(1, 8vw, 1.1)` (via `.type-hero--fullscreen`).  
> O subtítulo **não** usa `.type-body-lg` nem tamanho fixo em px.

### Botão “← Ver todos os serviços”
- Destino: `/servicos`
- Estilo vidro: `rounded-lg bg-white/75 px-5 py-3 backdrop-blur-md text-gmt-text`
- Hover: `hover:bg-white/90`
- Seta para trás mantida no copy (`←`)
- **Não existe** botão dinâmico com o nome do serviço nem link antigo `← Serviços`
- **Um único** botão na hero (sem duplicados)

### Mídia de fundo
Hero resolvido por `getServicoHeroId(servico)` (`src/lib/media.ts`): agente → hero da família; pacote → `MKT-04`; avulso → thumb 3:2. Render `fill`, `priority`, `sizes="100vw"`, `reveal={false}`. Cor de fallback = `servico.corPlaceholder`. Cruzado com PLANO § 4.2-B / 4.3 / 4.4.

| ID | Quando | Proporção | Export | Status |
|---|---|---|---|---|
| AGH-F1…F4 | Agentes por família | 3:1 | 2560×860 | **Produzido** |
| MKT-04 | Pacotes | 3:1 | 2560×860 | **Produzido** |
| AV-01…06 | Avulsos | 3:2 | 1200×800 | **Produzido** |

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

| ID | Descrição (placeholder) | Cor fallback |
|---|---|---|
| CF-01 | card mídia posição 1 | `#1E293B` |
| CF-02 | card mídia posição 2 | `#134E4A` |
| CF-03 | card mídia posição 3 | `#1A3A5F` |
| CF-04 | card mídia posição 4 | `#3B0764` |
| CF-05 | card mídia posição 5 | `#0F172A` |

### Layout
- Rótulo: `<h2>` “Como funciona” · `.type-label`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`
- Card: `aspect-[3/4] md:aspect-[2/3] rounded-2xl border border-gmt-border overflow-hidden`
- Cada slot: `PlaceholderMedia` com `fill`, `reveal={false}`, `sizes="(max-width: 1024px) 50vw, 20vw"`

### Copy
**Não há** texto de passos (números 01–05, títulos ou resumos). Apenas o rótulo de secção e os 5 cards visuais.

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
| Hero overlay | gradiente `from-black via-black/40 to-transparent`; h1 `#ffffff`; headline `text-white/80` | Sec. Hero |
| Botão hero | `bg-white/75`, `backdrop-blur-md`, `text-gmt-text` | Sec. Hero |
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
