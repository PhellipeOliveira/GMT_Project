# GUIA DE EDIÇÃO — PARTE 03 · SERVIÇOS · LISTAGEM (`/servicos`)

> Documentação completa da página de listagem de Serviços para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/servicos/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts`, `src/lib/media.ts`, `src/data/servicos.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/servicos` |
| Arquivo | `src/app/servicos/page.tsx` |
| Componentes | `RevealOnScroll`, `PlaceholderMedia`, `Accordion` |
| Dados | `agentes`, `pacotes`, `avulsos`, tipo `Servico` (`src/data/servicos.ts`); `SERVICOS_HERO_THUMBS` (`src/lib/media.ts`); arrays `CATEGORIAS` e helper `toItems()` no próprio arquivo |
| Metadata | `title: "Serviços"`; `description` institucional |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Cabeçalho + thumbnails
2. Seção 02 — Categoria: Automação & IA (Accordion)
3. Seção 03 — Categoria: Pacotes de Marketing (Accordion)
4. Seção 04 — Categoria: Serviços Avulsos (Accordion)
5. Seção 05 — CTA final

> As Seções 01–04 estão envolvidas por `<div className="section-light">` (tokens claros: bg `#ffffff`, texto `#0a0a0a`, muted `#575757`). As 3 categorias (02–04) são geradas em loop a partir do array `CATEGORIAS`, todas usando o componente `Accordion`.

---

# Seção 01 — Cabeçalho + thumbnails

### 1. Objetivo
Título da página + tagline institucional + 3 thumbnails de credencial (split layout).

### 2. Copy / Textos

| Campo | Label | `<h1>` | `<p>` tagline |
|---|---|---|---|
| Conteúdo | `Os nossos serviços` | `Serviços` | `Agência especialista em automações, inteligência artificial e marketing digital para pequenas empresas — tudo num só parceiro.` |
| Elemento HTML | `p` | `h1` | `p` |
| Classe | `.type-label` | `.type-h2` | `.type-h3` |
| Família | DM Sans | Host Grotesk | Host Grotesk |
| Tamanho | 14px | `clamp(42px,6vw,72px)` | 36px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `var(--gmt-text)` = `#0a0a0a` |
| `letter-spacing` | 0.1em | — | — |
| `text-transform` | uppercase | none | none |

### 3. Imagens / mídia
Thumbnails de `SERVICOS_HERO_THUMBS = ["AG-01", "MKT-02", "AV-05"]` (`src/lib/media.ts`). Render `descricao="thumbnail · 3:2"`, `rounded-lg md:rounded-[1vw]`, cor de fallback `#1E293B`, `reveal={false}`. Cruzado com PLANO Tabelas 4.2-A / 4.3 / 4.4.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| AG-01 | Thumb · Reservas via WhatsApp | 3:2 | 1200×800 | `public/images/AG-01.webp` | **Produzido** |
| MKT-02 | Thumb · Pacote Crescimento | 3:2 | 1200×800 | `public/images/MKT-02.webp` | **Produzido** |
| AV-05 | Thumb · Inteligência Artificial | 3:2 | 1200×800 | `public/images/AV-05.webp` | **Produzido** |

### 4. Botões / CTAs
Nenhum (thumbnails não-clicáveis nesta seção).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, h1, tagline | Framer Motion (`RevealOnScroll`) | on-scroll | `1.75s`, ease `[0.16,1,0.3,1]` |
| Cada thumbnail | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |
| Imagem (quando há asset) | CSS (`.media-zoom`) | on-hover | `scale(1.03)`, 400ms |

### 6. Responsividade
- **Desktop:** cabeçalho `flex-row` (rótulo/h1 `md:w-1/3`, tagline `md:w-2/3`); thumbs `sm:grid-cols-3`; `pt-[11vw]`, `px-[5vw]`, `mt-[5vw]`.
- **Tablet:** thumbs `sm:grid-cols-3`.
- **Mobile:** `flex-col`, thumbs `grid-cols-1`; `pt-28`, `px-5`, `mt-10`.

### 7. Arquivos relacionados
`src/app/servicos/page.tsx`, `src/lib/media.ts`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`.

---

# Seções 02–04 — Categorias (Accordion)

> Três seções com a mesma estrutura, geradas a partir do array `CATEGORIAS`. Componente: `src/components/ui/Accordion.tsx`. Os itens (nome, subtítulo = `headline`, lista de `funcionalidades`, link `/servicos/{slug}`, `cor` da família) vêm de `src/data/servicos.ts` via `toItems()`.

### 1. Objetivo
Organizar toda a oferta da GMT em 3 categorias expansíveis (descoberta progressiva).

### 2. Copy / Textos

**Cabeçalho de cada categoria:**

| Campo | `<h2>` categoria | `<p>` descrição |
|---|---|---|
| Elemento HTML | `h2` | `p` |
| Classe | `.type-category` | `.type-body` |
| Família | Host Grotesk | DM Sans |
| Tamanho | `clamp(36px,5vw,48px)` | 18px |
| Peso | **300** | 400 |
| Cor da fonte | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — |
| `text-transform` | uppercase | none |

Conteúdo dos 3 cabeçalhos (de `CATEGORIAS`):
- **Seção 02 — Automação & IA** — `15 agentes inteligentes que trabalham pelo seu negócio, 24h por dia.` (itens = 15 agentes)
- **Seção 03 — Pacotes de Marketing** — `3 pacotes para iniciar, crescer ou dominar a sua presença digital.` (itens = 3 pacotes)
- **Seção 04 — Serviços Avulsos** — `6 áreas de especialização para necessidades pontuais.` (itens = 6 avulsos)

**Elementos dentro de cada item do Accordion:**

| Campo | Título | Subtítulo (headline) | Item (funcionalidade) | Link |
|---|---|---|---|---|
| Elemento HTML | `span` (em `button`) | `span` | `li` | `a` (Link) |
| Classe | `.type-body-lg` | `.type-body` | `.type-body` | `.type-body` |
| Família | DM Sans | DM Sans | DM Sans | DM Sans |
| Tamanho | 21px | 18px | 18px | 18px |
| Peso | 400 | 400 | 400 | 400 |
| Cor (estado fechado) | `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) | `#575757` (`text-gmt-muted`) | `var(--gmt-accent)` = `#2563eb` |
| Cor (aberto / hover) | `#ffffff` (item fica `bg-black`) | `rgba(255,255,255,0.7)` (`text-white/70`) | — | hover `#7c3aed` (`accent-2`) |
| `text-transform` | none | none | none | none |

Texto do link dentro do painel: `Ver serviço →`.

**Itens por categoria (de `servicos.ts`):**
- **Agentes (15):** Reservas via WhatsApp · Voz para Telefone · Cardápio Inteligente (RAG) · Reputação e Reviews · Relatório Semanal para o Dono · Agendamento Universal · Follow-up de Clientes · Triagem de Documentos · Cobrança Automática · Criação de Conteúdo Autónomo · Monitor de Concorrência · Relatório de Performance de Marketing · Qualificação de Leads · Grafos Personalizados (Premium) · Onboarding de Clientes.
- **Pacotes (3):** Pacote Essencial · Pacote Crescimento · Pacote Premium.
- **Avulsos (6):** Criação de Conteúdo · Publicidade Digital · Branding & Estratégia · Websites · Inteligência Artificial · Analytics & Otimização.

### 3. Imagens / mídia
Nenhuma imagem nestas seções. Cada item exibe um **ponto colorido** (`size-2.5 rounded-full`) com a cor da família (`item.cor` = `servico.corPlaceholder`) e um ícone **`ChevronDown`** (`lucide-react`, `size 20`).

Cores de família (`CORES_FAMILIA` em `servicos.ts`): F1 `#92400E` · F2 `#1E3A5F` · F3 `#3B0764` · F4 `#0F172A` · MKT `#1A3A2A` · AV `#1A3A2A`. Ícones = `GL-05` na PARTE 4 (vetor lucide, sem produção externa) → **Produzido**.

### 4. Botões / CTAs
- **Cabeçalho de cada item** = `<button>` (toggle, `aria-expanded`). Estado aberto/hover: fundo `bg-black`, texto branco; `rounded-lg`, `px-4 py-5`. Estado fechado: fundo transparente, `hover:bg-black`.
- **Link "Ver serviço →"** (dentro do painel aberto): `.type-body`, cor `--gmt-accent` (`#2563eb`), hover `--gmt-accent-2` (`#7c3aed`). `border-radius` herdado (inline-link, sem fundo).

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Abertura/fecho do painel | CSS (`.accordion-panel`) | on-click | `grid-template-rows 0fr→1fr`, 300ms `cubic-bezier(0.4,0,0.2,1)` |
| `ChevronDown` | CSS | on-click | rotação `0→180°` + cor, 300ms |
| Ponto colorido | CSS | on-hover/aberto | opacidade, 300ms |
| Cabeçalho da categoria + cada item | Framer Motion (`RevealOnScroll`) | on-scroll | stagger `delay = i*0.08` |

Apenas um item aberto por vez (estado `openId`).

### 6. Responsividade
- **Desktop:** cabeçalho da categoria `flex-row md:items-end md:justify-between`; subtítulo do item visível (`lg:inline`); `mt-[8vw]`, `px-[5vw]`.
- **Tablet:** subtítulo do item ainda **oculto** (só aparece em `lg`).
- **Mobile:** cabeçalho `flex-col`; subtítulo oculto (`hidden`); `mt-10`, `px-5`.

### 7. Arquivos relacionados
`src/app/servicos/page.tsx`, `src/components/ui/Accordion.tsx`, `src/components/ui/RevealOnScroll.tsx`, `src/data/servicos.ts`, classes `.type-category`/`.accordion-list`/`.accordion-item`/`.accordion-panel*` em `src/styles/globals.css`.

---

# Seção 05 — CTA final

### 1. Objetivo
Conversão (faixa preta `.section-cta`, centrada).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Não sabe por onde começar?` | `Agende uma reunião gratuita e desenhamos o plano certo para si.` |
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
`src/app/servicos/page.tsx`, classes `.btn-submit` e `.section-cta` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados na Listagem de Serviços (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `.section-light` | bg `#ffffff`, text `#0a0a0a`, muted `#575757`, border `#dcdcdc` | wrapper Seções 01–04 |
| `--gmt-text` | `#0a0a0a` | h1, tagline, categorias, títulos de item |
| `--gmt-text-muted` | `#575757` | labels, descrições, funcionalidades |
| `--gmt-border` | `#dcdcdc` | linhas do accordion (`.accordion-list`/`.accordion-item`) |
| `--gmt-accent` | `#2563eb` | link "Ver serviço →" |
| `--gmt-accent-2` | `#7c3aed` | hover do link |
| `.type-category` peso | 300 (Host Grotesk) | títulos das categorias |
| Cores de família (ponto) | F1 `#92400E` · F2 `#1E3A5F` · F3 `#3B0764` · F4 `#0F172A` · MKT/AV `#1A3A2A` | ponto colorido por item |
| fallback de thumbnail | `#1E293B` | Seção 01 (AG-01, MKT-02, AV-05) |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seção 05 |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por esta página — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*
