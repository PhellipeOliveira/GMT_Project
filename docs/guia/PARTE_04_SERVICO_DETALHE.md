# GUIA DE EDIÇÃO — PARTE 04 · SERVIÇO · DETALHE (`/servicos/[slug]`)

> Documentação completa do **template dinâmico** de página individual de serviço.
>
> **Arquivo principal:** `src/app/servicos/[slug]/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts`, `src/lib/media.ts`, `src/data/servicos.ts`, `src/data/portfolio.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/servicos/[slug]` (rota dinâmica) |
| Arquivo | `src/app/servicos/[slug]/page.tsx` |
| Componentes | `RevealOnScroll`, `PlaceholderMedia`, `PortfolioCard`, ícone `Check` (`lucide-react`) |
| Dados | `servicos`, `getServicoBySlug` (`src/data/servicos.ts`); `getCaseBySlug("nara")` (`src/data/portfolio.ts`); `getServicoHeroId`, `getFamiliaProcessBg` (`src/lib/media.ts`); array `PROCESSO` no próprio arquivo |
| Geração estática | `generateStaticParams()` → 1 página por serviço (**24 páginas**: 15 agentes + 3 pacotes + 6 avulsos); `generateMetadata()` (title = `servico.nome`, description = `headline`/`solucao`/`nome`) |
| 404 | `notFound()` quando o slug não existe |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 00 — Hero do serviço
2. Seção 01 — Proposta de valor (desafio + solução)
3. Seção 01b — Benefícios
4. Seção 02 — O que inclui (funcionalidades)
5. Seção 03 — Como funciona (process cards)
6. Seção 04 — Casos de uso (Para quem é)
7. Seção 05 — Em prática (NARA)
8. Seção 06 — CTA final

> As Seções 01–05 estão envolvidas por `<div className="section-light">` (tokens claros). A Seção 00 (hero) e a Seção 06 (CTA) ficam fora desse wrapper.

---

## Dados vs. estrutura do template

> **Distinção pedida** — o que muda por serviço (vem de `src/data/servicos.ts`) e o que é fixo no template (`page.tsx`):

| Origem | Conteúdo |
|---|---|
| **Dados — `servicos.ts` (por serviço)** | `nome` (h1), `headline` (subtítulo do hero), `problema`, `solucao`, `beneficios[]`, `funcionalidades[]`, `casosDeUso[]`, `familia`, `corPlaceholder` |
| **Dados — `lib/media.ts` (derivado da família/slug)** | ID do hero (`getServicoHeroId`), ID do fundo de processo (`getFamiliaProcessBg`) |
| **Dados — `portfolio.ts`** | Case NARA da Seção 05 (`getCaseBySlug("nara")`) |
| **Estrutural — fixo no template** | Rótulos de seção (`O desafio`, `A solução`, `Benefícios`, `O que inclui`, `Como funciona`, `Para quem é`, `Em prática`), o array `PROCESSO` (5 passos, institucional, igual para todos), copy do CTA final, link `← Serviços` |
| **Renderização condicional** | Seção 01 só aparece se `problema`/`solucao` existir; 01b só se `beneficios.length > 0`; 04 só se `casosDeUso.length > 0`; 05 só se o case NARA existir; bloco "solução" da Seção 02 só se `tipo === "pacote"` |

---

# Seção 00 — Hero do serviço

### 1. Objetivo
Abertura full-bleed (70–80vh) com nome e headline do serviço sobre imagem/vídeo da família visual.

### 2. Copy / Textos

| Campo | Link voltar | `<h1>` | `<p>` headline |
|---|---|---|---|
| Conteúdo | `← Serviços` | `servico.nome` (dados) | `servico.headline` (dados; condicional) |
| Elemento HTML | `a` (Link) | `h1` | `p` |
| Classe | `.type-label` | `.type-hero` + `.type-hero--fullscreen` | `.type-body-lg` |
| Família | DM Sans | Host Grotesk | DM Sans |
| Tamanho | 14px | `clamp(52px,9vw,108px)` | 21px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `rgba(255,255,255,0.7)` (`text-white/70`, hover `#ffffff`) | `#ffffff` (`!text-white`) | `rgba(255,255,255,0.7)` (`text-white/70`) |
| `letter-spacing` | 0.1em | — | — |
| `text-transform` | uppercase | none | none |

> `line-height` do h1 = `var(--type-hero-leading)` = `clamp(1, 8vw, 1.1)` (via `.type-hero--fullscreen`).

### 3. Imagens / mídia
Hero resolvido por `getServicoHeroId(servico)` (`src/lib/media.ts`): agente → hero da família; pacote → `MKT-04`; avulso → o próprio thumb 3:2. Render `fill`, `priority`, `sizes="100vw"`, `reveal={false}`. Overlay gradiente `from-black via-black/40 to-transparent`. Cor de fallback = `servico.corPlaceholder`. Cruzado com PLANO Tabelas 4.2-B / 4.3 / 4.4.

| ID | Quando | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|---|
| AGH-F1 | Agente família F1 | Hero família Hospitalidade | 3:1 | 2560×860 | `public/videos/AGH-F1.webp` | **Produzido** |
| AGH-F2 | Agente família F2 | Hero família Operação Eficiente | 3:1 | 2560×860 | `public/videos/AGH-F2.webp` | **Produzido** |
| AGH-F3 | Agente família F3 | Hero família Growth & Dados | 3:1 | 2560×860 | `public/videos/AGH-F3.webp` | **Produzido** |
| AGH-F4 | Agente família F4 | Hero família Inovação Sob Medida | 3:1 | 2560×860 | `public/videos/AGH-F4.webp` | **Produzido** |
| MKT-04 | Pacotes (MKT) | Hero pacotes marketing | 3:1 | 2560×860 | `public/videos/MKT-04.webp` | **Produzido** |
| AV-01..06 | Avulsos | Reutiliza o thumb do avulso | 3:2 | 1200×800 | `public/images/AV-0X.webp` | **Produzido** |

> Container `h-[80vh] md:h-[70vh]`. Para agentes, `getServicoHeroId` mapeia `familia` → `AGH-F{1..4}`; para avulsos devolve o thumb (`getServicoThumbId`).

### 4. Botões / CTAs
Link "← Serviços" (texto, não botão): `.type-label`, `text-white/70`, hover `#ffffff`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Link, h1, headline | Framer Motion (`RevealOnScroll`) | on-scroll | `1.75s`, ease `[0.16,1,0.3,1]`; headline `delay 0.08` |
| Mídia de fundo | — | — | `reveal={false}` (sem reveal); zoom CSS no hover quando há asset |

### 6. Responsividade
- **Desktop:** `h-[70vh]`; conteúdo `md:w-1/2`, `px-[5vw]`, `pb-[5vw]`.
- **Tablet/Mobile:** `h-[80vh]`; conteúdo largura total, `px-5`, `pb-12`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/lib/media.ts`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`, classes `.type-hero`/`.type-hero--fullscreen` em `src/styles/globals.css`.

---

# Seção 01 — Proposta de valor (desafio + solução)

> Condicional: só renderiza se `servico.problema` ou `servico.solucao` existir.

### 1. Objetivo
Contrastar o problema do cliente (`O desafio`) com a transformação prometida (`A solução`).

### 2. Copy / Textos

| Campo | `<h2>` "O desafio" | `<p>` problema | `<h2>` "A solução" | `<p>` solução |
|---|---|---|---|---|
| Conteúdo | `O desafio` (estrutural) | `servico.problema` (dados) | `A solução` (estrutural) | `servico.solucao` (dados) |
| Elemento HTML | `h2` | `p` | `h2` | `p` |
| Classe | `.type-label` | `.type-h3` | `.type-label` | `.type-body-lg` |
| Família | DM Sans | Host Grotesk | DM Sans | DM Sans |
| Tamanho | 14px | 36px | 14px | 21px |
| Peso | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — | 0.1em | — |
| `text-transform` | uppercase | none | uppercase | none |

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Rótulos e textos | Framer Motion (`RevealOnScroll`) | on-scroll | `1.75s`; solução `delay 0.08` |

### 6. Responsividade
- **Desktop:** `flex-row` (cada coluna `md:w-1/2`), `gap-[5vw]`, `px-[5vw]`, `pt-[5vw]`.
- **Mobile:** `flex-col`, `gap-10`, `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/data/servicos.ts`, `src/components/ui/RevealOnScroll.tsx`.

---

# Seção 01b — Benefícios

> Condicional: só renderiza se `servico.beneficios.length > 0`.

### 1. Objetivo
Listar os benefícios concretos do serviço em cartões.

### 2. Copy / Textos

| Campo | `<h2>` | Item de benefício |
|---|---|---|
| Conteúdo | `Benefícios` (estrutural) | `servico.beneficios[]` (dados) |
| Elemento HTML | `h2` | `span` (dentro de `li`) |
| Classe | `.type-label` | `.type-body` |
| Família | DM Sans | DM Sans |
| Tamanho | 14px | 18px |
| Peso | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` (`text-gmt-text`) |
| `letter-spacing` | 0.1em | — |
| `text-transform` | uppercase | none |

### 3. Imagens / mídia
Nenhuma imagem. Cada benefício exibe o ícone **`Check`** (`lucide-react`, `size 18`, cor `text-gmt-accent` = `#2563eb`). Vetor (= `GL-05` na PARTE 4) → **Produzido**.

### 4. Botões / CTAs
Nenhum. Cada benefício é um cartão `border-gmt-border bg-gmt-bg-alt rounded-lg p-5`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cada cartão de benefício | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** grid `md:grid-cols-3`, `px-[5vw]`, `pt-[5vw]`.
- **Mobile:** `grid-cols-1`, `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/data/servicos.ts`.

---

# Seção 02 — O que inclui (funcionalidades)

### 1. Objetivo
Listar as funcionalidades concretas do serviço (e, para pacotes, repetir a solução como introdução).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` intro (só pacotes) | Funcionalidade |
|---|---|---|---|
| Conteúdo | `O que inclui` (estrutural) | `servico.solucao` (dados; só `tipo === "pacote"`) | `servico.funcionalidades[]` (dados) |
| Elemento HTML | `h2` | `p` | `span` (dentro de `li`) |
| Classe | `.type-label` | `.type-body` | `.type-body-lg` |
| Família | DM Sans | DM Sans | DM Sans |
| Tamanho | 14px | 18px | 21px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` (`text-gmt-text`) |
| `letter-spacing` | 0.1em | — | — |
| `text-transform` | uppercase | none | none |

> Lista com separadores `divide-y divide-gmt-border` + borda superior `border-t border-gmt-border`.

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cada funcionalidade | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** `flex-row` (rótulo `md:w-1/3`, lista `md:w-2/3`), `gap-[5vw]`, `px-[5vw]`, `pt-[8vw]`.
- **Mobile:** `flex-col`, `gap-8`, `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/data/servicos.ts`.

---

# Seção 03 — Como funciona (process cards)

### 1. Objetivo
Mostrar o processo GMT em 5 cards (01–05). O array `PROCESSO` é **estrutural/fixo** (institucional, igual para todos os serviços).

### 2. Copy / Textos

| Campo | `<h2>` | Número | Título do passo | Resumo |
|---|---|---|---|---|
| Conteúdo | `Como funciona` (estrutural) | `01`–`05` (estrutural) | Reunião inicial · Proposta personalizada · Planeamento estratégico · Execução & implementação · Acompanhamento & otimização | Texto descritivo de cada passo (estrutural) |
| Elemento HTML | `h2` | `span` | `h3` | `p` |
| Classe | `.type-label` | `font-mono` + `.type-body` | `.type-body-lg` | `.type-body` |
| Família | DM Sans | Mono sistema (`--font-mono`) | DM Sans | DM Sans |
| Tamanho | 14px | 18px | 21px | 18px |
| Peso | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-accent)` = `#2563eb` (`text-gmt-accent`) | `var(--gmt-text)` = `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — | — | — |
| `text-transform` | uppercase | none | none | none |

> Conteúdo dos 5 passos (array `PROCESSO`):
> 01 Reunião inicial · 02 Proposta personalizada · 03 Planeamento estratégico · 04 Execução & implementação · 05 Acompanhamento & otimização.

### 3. Imagens / mídia
Fundo do card resolvido por `getFamiliaProcessBg(servico.familia)` (`src/lib/media.ts`). Render `fill`, `opacity-20`, atrás do texto (`z-10`), `reveal={false}`. Cruzado com PLANO Tabela 4.2-B.

| ID | Quando (família) | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|---|
| AGP-F1 | F1 | Fundo card processo | 2:3 | 1200×1800 | `public/images/AGP-F1.webp` | **Produzido** |
| AGP-F2 | F2 | Fundo card processo | 2:3 | 1200×1800 | `public/images/AGP-F2.webp` | **Produzido** |
| AGP-F3 | F3 / MKT / AV | Fundo card processo | 2:3 | 1200×1800 | `public/images/AGP-F3.webp` | **Produzido** |
| AGP-F4 | F4 | Fundo card processo | 2:3 | 1200×1800 | `public/images/AGP-F4.webp` | **Produzido** |

> Card: `aspect-[3/4] md:aspect-[2/3]`, `rounded-2xl border border-gmt-border bg-white/50`.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Rótulo + cada card | Framer Motion (`RevealOnScroll`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** grid `lg:grid-cols-5`; card `md:aspect-[2/3]`; `px-[5vw]`, `pt-[8vw]`.
- **Tablet:** grid `sm:grid-cols-2`.
- **Mobile:** `grid-cols-1`; card `aspect-[3/4]`; `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/lib/media.ts`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`.

---

# Seção 04 — Casos de uso (Para quem é)

> Condicional: só renderiza se `servico.casosDeUso.length > 0`.

### 1. Objetivo
Indicar os perfis/segmentos para quem o serviço é indicado (tags).

### 2. Copy / Textos

| Campo | `<h2>` | Tag (caso de uso) |
|---|---|---|
| Conteúdo | `Para quem é` (estrutural) | `servico.casosDeUso[]` (dados) |
| Elemento HTML | `h2` | `span` |
| Classe | `.type-label` | `.tag-pill` |
| Família | DM Sans | DM Sans |
| Tamanho | 14px | `clamp(13px,0.9vw,15px)` |
| Peso | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `#000` (definido em `.tag-pill`) |
| `letter-spacing` | 0.1em | normal (`.tag-pill` reseta) |
| `text-transform` | uppercase | none (`.tag-pill` reseta) |

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
Tags pill (não-clicáveis): `.tag-pill` → fundo `rgb(255 255 255 / 0.8)`, texto `#000`, `border-radius 0.5vw`, `padding 0.4vw 1vw`, `backdrop-filter blur(8px)`. Sem hover definido.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cada tag | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** `flex-wrap gap-3`, `px-[5vw]`, `pt-[8vw]`.
- **Mobile:** `flex-wrap`, `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/data/servicos.ts`, classe `.tag-pill` em `src/styles/globals.css`.

---

# Seção 05 — Em prática (NARA)

> Condicional: só renderiza se o case NARA existir (`getCaseBySlug("nara")`).

### 1. Objetivo
Mostrar prova real de entrega (case NARA) ligada ao serviço.

### 2. Copy / Textos

| Campo | `<h2>` | Card NARA |
|---|---|---|
| Conteúdo | `Em prática` (estrutural) | nome/local/indústria/serviços/tags do NARA (via `PortfolioCard`) |
| Elemento HTML | `h2` | (ver PARTE 05/Home — `PortfolioCard`) |
| Classe | `.type-label` | — |
| Família | DM Sans | — |
| Tamanho | 14px | — |
| Peso | 400 | — |
| Cor da fonte | `#575757` (`text-gmt-muted`) | conforme `PortfolioCard` |
| `text-transform` | uppercase | — |

> O conteúdo do card (h3 `.type-h3`, metadados `.type-body`, tags `.tag-pill`) é renderizado por `PortfolioCard` — documentado em detalhe na PARTE da Home / Portfolio.

### 3. Imagens / mídia
`PF-01` (card NARA 3:4). Cruzado com PLANO Tabela 4.5.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| PF-01 | Card showcase NARA | 3:4 | 1200×1600 | `public/images/PF-01.webp` | **Produzido** |

> Cor de fallback = `nara.corPlaceholder` = `#134E4A` (`COR_PORTFOLIO`).

### 4. Botões / CTAs
Card NARA é um `Link` para `/portfolio/nara` (hover `opacity-90` + zoom da mídia).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Rótulo + card | Framer Motion (`RevealOnScroll`, embutido no `PortfolioCard`) | on-scroll | `1.75s` |

### 6. Responsividade
- **Desktop:** grid `md:grid-cols-2`, `px-[5vw]`, `pt-[8vw]`.
- **Mobile:** `grid-cols-1`, `px-5`, `pt-16`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, `src/components/ui/PortfolioCard.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`.

---

# Seção 06 — CTA final

### 1. Objetivo
Conversão (faixa preta `.section-cta`, centrada).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Quer este serviço no seu negócio?` (estrutural) | `Agende uma reunião gratuita e sem compromisso.` (estrutural) |
| Elemento HTML | `h2` | `p` |
| Classe | `.type-h3` | `.type-body` |
| Família | Host Grotesk | DM Sans |
| Tamanho | 36px | 18px |
| Peso | 400 | 400 |
| Cor da fonte | `#ffffff` (em `.section-cta`, regra `:where(.type-h3) → var(--gmt-text)` = `#ffffff`) | `#94a3b8` (`text-gmt-muted` redefinido na `.section-cta`) |
| `text-transform` | none | none |

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
"Agendar reunião" — classe `.btn-submit` (link para `/contacto`).
- Fundo `rgb(255 255 255 / 0.7)` · Texto `#000` · `border-radius 9999px` · `padding 0.75rem 2rem` · DM Sans 18px peso 500.
- Hover: `bg rgb(255 255 255 / 0.85)` + `scale(1.02)`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| h2, p e botão | Framer Motion (`RevealOnScroll`) | on-scroll | stagger (`delay 0.08`/`0.16`) |

### 6. Responsividade
- **Todos:** centrado, h2 `max-w-2xl`.
- **Desktop:** `mt-[8vw] px-[5vw] py-[8vw]`. **Mobile:** `mt-20 px-5 py-20`.

### 7. Arquivos relacionados
`src/app/servicos/[slug]/page.tsx`, classes `.btn-submit` e `.section-cta` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados no Detalhe de Serviço (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| Hero (overlay) | gradiente `from-black via-black/40 to-transparent`; textos `#ffffff` / `text-white/70` | Seção 00 |
| `.section-light` | bg `#ffffff`, text `#0a0a0a`, muted `#575757`, border `#dcdcdc` | wrapper Seções 01–05 |
| `--gmt-text` | `#0a0a0a` | problema (h3), funcionalidades, títulos de passo, benefícios |
| `--gmt-text-muted` | `#575757` | rótulos de seção, solução, resumos |
| `--gmt-accent` | `#2563eb` | ícone `Check` (benefícios), número do passo |
| `--gmt-bg-alt` | `#f5f5f5` | cartões de benefício (`bg-gmt-bg-alt`) |
| `--gmt-border` | `#dcdcdc` | bordas de cartões/listas |
| `.tag-pill` | fundo `rgb(255 255 255 / 0.8)`, texto `#000` | Seção 04 (casos de uso) |
| Cores de família (fallback hero/processo) | F1 `#92400E` · F2 `#1E3A5F` · F3 `#3B0764` · F4 `#0F172A` · MKT/AV `#1A3A2A` | Seções 00 e 03 |
| `COR_PORTFOLIO` | `#134E4A` | card NARA (Seção 05) |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seção 06 |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por esta página — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*
