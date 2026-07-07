# GUIA DE EDIÇÃO — PARTE 06 · PORTFOLIO · DETALHE (`/portfolio/[slug]`)

> Documentação completa do **template dinâmico** de página de case.
>
> **Arquivo principal:** `src/app/(site)/portfolio/[slug]/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts`, `src/data/portfolio.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026 · **Actualização:** Jun 2026 — lista só cases reais; placeholders "Em breve" e CTA final removidos.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/portfolio/[slug]` (rota dinâmica) |
| Arquivo | `src/app/(site)/portfolio/[slug]/page.tsx` |
| Componentes | `RevealOnScroll`, `PlaceholderMedia` |
| Dados | `portfolio`, `getCaseBySlug` (`src/data/portfolio.ts`) — **1 case (NARA)** |
| Geração estática | `generateStaticParams()` → 1 página por case; `generateMetadata()` (title = `caso.nome`, description = `caso.resumo`) |
| 404 | `notFound()` quando o slug não existe |
| Globais (via `(site)/layout.tsx`) | `Navbar`, `GMTLightFooter`, `Footer`, `ChatWidgetLoader`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Ficha lateral (sticky) + galeria
2. Seção 02 — Lista de projetos (cases em `portfolio`)

> A página **não** usa o wrapper `.section-light`. **Sem CTA final** — conversão global via `ChatWidgetLoader`. A página termina na lista de projetos.

**Removido do template (não documentar como activo):**

- Secção 02 antiga — `"Próximo projeto"` com 2 placeholders fixos `"Em breve"` (`[0, 1].map(...)`)
- Secção 03 — CTA `"Pronto para automatizar o seu negócio?"` + `"Agendar agora"`

---

## Dados vs. estrutura do template

| Origem | Conteúdo |
|---|---|
| **Dados — `portfolio.ts` (por case)** | `nome` (h1), `tags[]`, `resumo`, `local`, `industria`, `servicos`, `galeria[]` (ids + proporção + legenda), `corPlaceholder` |
| **Estrutural — fixo no template** | Link `← Portfolio`, rótulos `Localização`/`Indústria`/`Serviços`, botão `Falar sobre um projeto` |
| **Dados — Sec. 02** | Lista `portfolio.map(...)` — mesma linha por case real publicado |

---

# Seção 01 — Ficha lateral (sticky) + galeria

### 1. Objetivo
Layout split: ficha do case numa coluna sticky à esquerda (nome, tags, resumo, metadados, CTA) + galeria vertical de imagens à direita.

### 2. Copy / Textos

| Campo | Link voltar | `<h1>` | Tag | `<p>` resumo | `<dt>` rótulo | `<dd>` valor | Botão CTA |
|---|---|---|---|---|---|---|---|
| Conteúdo | `← Portfolio` | `caso.nome` (`NARA`) | `caso.tags[]` | `caso.resumo` | `Localização` / `Indústria` / `Serviços` | `caso.local` / `caso.industria` / `caso.servicos` | `Falar sobre um projeto` |
| Elemento HTML | `a` (Link) | `h1` | `span` | `p` | `dt` | `dd` | `a` (Link) |
| Classe | `.type-label` | `.type-h2` | `.type-body` (pill `bg-gmt-bg-alt`) | `.type-body-lg` | `.type-label` | `.type-body` | `.type-body` + `.type-medium` |
| Família | DM Sans | Host Grotesk | DM Sans | DM Sans | DM Sans | DM Sans | DM Sans |
| Tamanho | 14px | `clamp(42px,6vw,72px)` | 18px | 21px | 14px | 18px | 18px |
| Peso | 400 | 400 | 400 | 400 | 400 | 400 | **500** |
| Cor da fonte | `#575757` (hover `#0a0a0a`) | `#0a0a0a` | `#0a0a0a` | `#575757` | `#575757` | `#0a0a0a` | `#ffffff` |

Tags NARA: `Branding`, `Website`, `Chatbots`, `Campanhas`. Pill: `rounded-lg bg-gmt-bg-alt px-3 py-1` (não `.tag-pill`).

### 3. Imagens / mídia
Galeria de `caso.galeria` (NARA = 10 imagens). Cruzado com PLANO Tabela 4.5 — PF-03…PF-12.

### 4. Botões / CTAs
"Falar sobre um projeto" → `/contacto` — `rounded-full bg-black px-8 py-3.5 text-white hover:bg-black/80` (`.type-label`).

### 5. Animações
`RevealOnScroll` com delays `0.08` / `0.16` / `0.24`; galeria com stagger `i * 0.08`.

### 6. Responsividade
Desktop: `flex-row`, ficha `md:sticky md:top-24 md:w-2/5`, galeria `md:w-3/5`. Mobile: `flex-col`, `pt-28`, `px-5`.

### 7. Arquivos relacionados
`src/app/(site)/portfolio/[slug]/page.tsx`, `PlaceholderMedia`, `portfolio.ts`, `media-spec.ts`.

---

# Seção 02 — Lista de projetos

### 1. Objetivo
Lista vertical numerada dos cases publicados em `portfolio.ts` — actualmente **apenas NARA**. Mesmo padrão visual da listagem `/portfolio`.

### 2. Copy / Textos

| Campo | Índice | `<h3>` | `<p>` local | Tags | Seta |
|---|---|---|---|---|---|
| Conteúdo | `01` | `NARA` | `Portugal · Internacional` | `c.tags[]` | `→` |
| Classe | `font-mono` + `.type-body` | `.type-h3` | `.type-body` | `.tag-pill` | inline |

### 3. Imagens / mídia
Thumb `PF-02` por linha; `w-20 md:w-28`, fallback `#134E4A`.

### 4. Botões / CTAs
Cada linha = `Link` para `/portfolio/{slug}`. Hover: título → `--gmt-accent`; seta `translate-x-1`.

### 5. Animações
`RevealOnScroll variant="media"`, stagger `delay = i * 0.08`.

### 6. Responsividade
Desktop: `py-[8vw]`, `mt-[8vw]`, `px-[5vw]`. Mobile: `py-16`, `mt-20`, `px-5`.

### 7. Arquivos relacionados
`src/app/(site)/portfolio/[slug]/page.tsx`, `portfolio.ts`.

---

## Apêndice — tokens e cores

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `--gmt-bg` | `#ffffff` | Secções 01–02 |
| `--gmt-bg-alt` | `#f5f5f5` | pills de tag da ficha |
| `--gmt-text` | `#0a0a0a` | h1, h3, tags, `<dd>` |
| `--gmt-text-muted` | `#575757` | link voltar, resumo, rótulos, local |
| `--gmt-accent` | `#2563eb` | hover título lista |
| `--gmt-border` | `#dcdcdc` | divisórias da lista |
| `COR_PORTFOLIO` | `#134E4A` | fallback galeria e thumb NARA |

*Documento gerado a partir do código do repositório. Nenhuma informação foi inventada.*
