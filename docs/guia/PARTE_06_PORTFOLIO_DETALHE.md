# GUIA DE EDIÇÃO — PARTE 06 · PORTFOLIO · DETALHE (`/portfolio/[slug]`)

> Documentação completa do **template dinâmico** de página de case.
>
> **Arquivo principal:** `src/app/portfolio/[slug]/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts`, `src/data/portfolio.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/portfolio/[slug]` (rota dinâmica) |
| Arquivo | `src/app/portfolio/[slug]/page.tsx` |
| Componentes | `RevealOnScroll`, `PlaceholderMedia` |
| Dados | `portfolio`, `getCaseBySlug` (`src/data/portfolio.ts`) |
| Geração estática | `generateStaticParams()` → 1 página por case (**atualmente 1: NARA**); `generateMetadata()` (title = `caso.nome`, description = `caso.resumo`) |
| 404 | `notFound()` quando o slug não existe |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Ficha lateral (sticky) + galeria
2. Seção 02 — Próximo projeto
3. Seção 03 — CTA final

> A página **não** usa o wrapper `.section-light`; as Seções 01 e 02 ficam sobre o fundo padrão (`--gmt-bg` = `#ffffff`).

---

## Dados vs. estrutura do template

| Origem | Conteúdo |
|---|---|
| **Dados — `portfolio.ts` (por case)** | `nome` (h1), `tags[]`, `resumo`, `local`, `industria`, `servicos`, `galeria[]` (ids + proporção + legenda), `corPlaceholder` |
| **Estrutural — fixo no template** | Link `← Portfolio`, rótulos `Localização`/`Indústria`/`Serviços`, botão `Falar sobre um projeto`, Seção 02 "Próximo projeto" (2 placeholders fixos "Em breve"), copy do CTA final |

---

# Seção 01 — Ficha lateral (sticky) + galeria

### 1. Objetivo
Layout split: ficha do case numa coluna sticky à esquerda (nome, tags, resumo, metadados, CTA) + galeria vertical de imagens à direita.

### 2. Copy / Textos

| Campo | Link voltar | `<h1>` | Tag | `<p>` resumo | `<dt>` rótulo | `<dd>` valor | Botão CTA |
|---|---|---|---|---|---|---|---|
| Conteúdo | `← Portfolio` (estrutural) | `caso.nome` (dados; ex.: `NARA`) | `caso.tags[]` (dados) | `caso.resumo` (dados) | `Localização` / `Indústria` / `Serviços` (estrutural) | `caso.local` / `caso.industria` / `caso.servicos` (dados) | `Falar sobre um projeto` (estrutural) |
| Elemento HTML | `a` (Link) | `h1` | `span` | `p` | `dt` | `dd` | `a` (Link) |
| Classe | `.type-label` | `.type-h2` | `.type-body` (em pill `bg-gmt-bg-alt`) | `.type-body-lg` | `.type-label` | `.type-body` | `.type-body` + `.type-medium` |
| Família | DM Sans | Host Grotesk | DM Sans | DM Sans | DM Sans | DM Sans | DM Sans |
| Tamanho | 14px | `clamp(42px,6vw,72px)` | 18px | 21px | 14px | 18px | 18px |
| Peso | 400 | 400 | 400 | 400 | 400 | 400 | **500** |
| Cor da fonte | `#575757` (`text-gmt-muted`, hover `#0a0a0a`) | `var(--gmt-text)` = `#0a0a0a` | `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) | `#575757` (`text-gmt-muted`) | `#0a0a0a` (`text-gmt-text`) | `#ffffff` (`text-white`) |
| `letter-spacing` | 0.1em | — | — | — | 0.1em | — | — |
| `text-transform` | uppercase | none | none | none | uppercase | none | none |

> Valores do NARA (de `portfolio.ts`): `local` = `Portugal · Internacional`; `industria` = `Tecnologia`; `servicos` = `Website + IA`; `tags` = `Branding`, `Website`, `Chatbots`, `Campanhas`. Tag pill usa `rounded-lg bg-gmt-bg-alt px-3 py-1` (não a classe `.tag-pill`).

### 3. Imagens / mídia
Galeria de `caso.galeria` (NARA = 10 imagens). Render `rounded-lg md:rounded-[1vw]`, `sizes="(max-width: 768px) 100vw, 60vw"`, `reveal={false}`. A proporção de cada item vem de `media-spec.ts` (a `proporcao` no dado é usada só na legenda). Cor de fallback `caso.corPlaceholder` = `#134E4A`. Cruzado com PLANO Tabela 4.5.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| PF-03 | Galeria — capa (1ª) | 16:9 | 2560×1440 | `public/images/PF-03.webp` | **Produzido** |
| PF-04 | Galeria — tela 1 | 4:3 | 1600×1200 | `public/images/PF-04.webp` | **Produzido** |
| PF-05 | Galeria — tela 2 | 4:3 | 1600×1200 | `public/images/PF-05.webp` | **Produzido** |
| PF-06 | Galeria — tela 3 | 4:3 | 1600×1200 | `public/images/PF-06.webp` | **Produzido** |
| PF-07 | Galeria — tela 4 | 4:3 | 1600×1200 | `public/images/PF-07.webp` | **Produzido** |
| PF-08 | Galeria — tela 5 | 4:3 | 1600×1200 | `public/images/PF-08.webp` | **Produzido** |
| PF-09 | Galeria — tela 6 | 4:3 | 1600×1200 | `public/images/PF-09.webp` | **Produzido** |
| PF-10 | Galeria — tela 7 | 4:3 | 1600×1200 | `public/images/PF-10.webp` | **Produzido** |
| PF-11 | Galeria — tela 8 | 4:3 | 1600×1200 | `public/images/PF-11.webp` | **Produzido** |
| PF-12 | Galeria — tela 9 | 4:3 | 1600×1200 | `public/images/PF-12.webp` | **Produzido** |

### 4. Botões / CTAs
"Falar sobre um projeto" — classes inline `.type-body` + `.type-medium` + `mt-8 inline-flex w-full justify-center rounded-lg bg-gmt-accent px-6 py-3 text-white`.
- Fundo `--gmt-accent` = `#2563eb` · Texto `#ffffff` · `border-radius 0.5rem` (`rounded-lg`) · full-width (`w-full`).
- Hover: `bg-gmt-accent-2` = `#7c3aed`.
- Link para `/contacto`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Link, h1, tags, resumo, metadados, CTA | Framer Motion (`RevealOnScroll`) | on-scroll | `2.1s`, ease `[0.22,1,0.36,1]`; delays escalonados `0.08`/`0.16`/`0.24` |
| Cada imagem da galeria | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** `flex-row`; ficha `md:sticky md:top-24 md:w-2/5`; galeria `md:w-3/5` com `gap-[1.5vw]`; `pt-[11vw]`, `px-[5vw]`.
- **Tablet/Mobile:** `flex-col` (ficha não-sticky, acima da galeria); `gap-[3vw]`/`gap-4`; `pt-28`, `px-5`.

### 7. Arquivos relacionados
`src/app/portfolio/[slug]/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/portfolio.ts`, `src/data/media-spec.ts`, classe `.type-medium` em `src/styles/globals.css`.

---

# Seção 02 — Próximo projeto

### 1. Objetivo
Navegação para próximos cases — atualmente 2 placeholders fixos "Em breve" (não dependem dos dados).

### 2. Copy / Textos

| Campo | `<h2>` | `<h3>` | `<p>` |
|---|---|---|---|
| Conteúdo | `Próximo projeto` (estrutural) | `Em breve` (estrutural) | `Novo case em produção` (estrutural) |
| Elemento HTML | `h2` | `h3` | `p` |
| Classe | `.type-label` | `.type-h3` | `.type-body` |
| Família | DM Sans | Host Grotesk | DM Sans |
| Tamanho | 14px | 36px | 18px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — | — |
| `text-transform` | uppercase | none | none |

> As 2 linhas são geradas por `[0, 1].map(...)` (fixas no template), com `opacity-50`.

### 3. Imagens / mídia
Thumb `PF-02` (id fixo no código) por linha placeholder. Render `w-20 md:w-28`, `rounded-md`, `sizes="112px"`, `reveal={false}`, cor de fallback `#1E293B`. Corresponde a `PF-SLOT-N` na PARTE 4.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| PF-02 (reutilizado) | Próximo projeto — placeholder | 9:16 | 1080×1920 | `public/images/PF-02.webp` (existe, mas renderizado em cinza com cor `#1E293B`) | **Lacuna** (slot de navegação `PF-SLOT-N` — depende de novos cases) |

> Nota: embora `PF-02.webp` exista, estas linhas são placeholders de **lacuna** ("Em breve") — não representam um case real navegável.

### 4. Botões / CTAs
Nenhum. As linhas são `<div>` não-clicáveis (`opacity-50`).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cada linha placeholder | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** linhas `py-8`, `gap-[2vw]`; thumb `md:w-28`; `mt-[8vw]`, `px-[5vw]`.
- **Mobile:** thumb `w-20`, `gap-5`; `mt-20`, `px-5`.

### 7. Arquivos relacionados
`src/app/portfolio/[slug]/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`.

---

# Seção 03 — CTA final

### 1. Objetivo
Conversão (faixa preta `.section-cta`, centrada).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Pronto para automatizar o seu negócio?` (estrutural) | `Reunião gratuita e sem compromisso.` (estrutural) |
| Elemento HTML | `h2` | `p` |
| Classe | `.type-h3` | `.type-body` |
| Família | Host Grotesk | DM Sans |
| Tamanho | 36px | 18px |
| Peso | 400 | 400 |
| Cor da fonte | `#ffffff` (em `.section-cta`, regra `:where(.type-h3) → var(--gmt-text)` = `#ffffff`) | `#94a3b8` (`text-gmt-muted` redefinido na `.section-cta`) |
| `letter-spacing` | — | — |
| `text-transform` | none | none |

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
"Agendar agora" — classe `.btn-submit` (link para `/contacto`).
- Fundo `rgb(255 255 255 / 0.7)` · Texto `#000` · `border-radius 9999px` · `padding 0.75rem 2rem` · DM Sans 18px peso 500.
- Hover: `bg rgb(255 255 255 / 0.85)` + `scale(1.02)`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| h2, p e botão | Framer Motion (`RevealOnScroll`) | on-scroll | stagger (`delay 0.08`/`0.16`) |

### 6. Responsividade
- **Todos:** centrado, h2 `max-w-2xl`.
- **Desktop:** `px-[5vw] py-[8vw]`. **Mobile:** `px-5 py-20`.

### 7. Arquivos relacionados
`src/app/portfolio/[slug]/page.tsx`, classes `.btn-submit` e `.section-cta` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados no Detalhe de Case (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `--gmt-bg` | `#ffffff` | fundo das Seções 01–02 |
| `--gmt-bg-alt` | `#f5f5f5` | pills de tag da ficha (`bg-gmt-bg-alt`) |
| `--gmt-text` | `#0a0a0a` | h1, h3, tags, valores `<dd>` |
| `--gmt-text-muted` | `#575757` | link voltar, resumo, rótulos `<dt>`, "Próximo projeto" |
| `--gmt-accent` | `#2563eb` | fundo do botão "Falar sobre um projeto" |
| `--gmt-accent-2` | `#7c3aed` | hover do botão da ficha |
| `--gmt-border` | `#dcdcdc` | divisórias (`border-t`/`border-b border-gmt-border`) |
| `COR_PORTFOLIO` | `#134E4A` | fallback da galeria (PF-03..12) |
| fallback "em breve" | `#1E293B` | thumbs da Seção 02 |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seção 03 |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por esta página — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*
