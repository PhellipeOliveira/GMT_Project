# GUIA DE EDIÇÃO — PARTE 02 · SOBRE (`/sobre`)

> Documentação completa da página Sobre para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/sobre/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/sobre` |
| Arquivo | `src/app/sobre/page.tsx` |
| Componentes | `RevealOnScroll`, `PlaceholderMedia` |
| Dados | arrays `COUNTERS` e `VALORES` no próprio arquivo |
| Metadata | `title: "Sobre"`; `description` institucional |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Introdução + Contadores
2. Seção 02 — Mídia institucional
3. Seção 03 — Manifesto fullscreen
4. Seção 04 — Valores (Porquê escolher-nos)
5. Seção 05 — CTA final

> As Seções 01 e 02 estão envolvidas por `<div className="section-light">` (tokens claros: bg `#ffffff`, texto `#0a0a0a`, muted `#575757`). A Seção 03 é fullscreen. As Seções 04 (`bg-gmt-bg`) e 05 (`.section-cta`) ficam fora desse wrapper.

---

# Seção 01 — Introdução + Contadores

### 1. Objetivo
Manifesto institucional (coluna esquerda) + grid 2×2 de contadores (coluna direita).

### 2. Copy / Textos

| Campo | Label | `<h1>` | `<p>` | Contador valor | Contador legenda |
|---|---|---|---|---|---|
| Conteúdo | `Sobre a GMT` | `Agência especialista em automações, inteligência artificial e marketing digital, dedicada a ajudar pequenas empresas a crescer e a destacar-se no mundo digital.` | `Objetivo claro: gerar resultados reais. Cada negócio, por mais pequeno que seja, merece uma presença digital profissional e eficaz.` | `15` · `24` · `70/30` | `agentes de IA prontos a trabalhar` · `serviços disponíveis` · `automação · marketing` |
| Elemento HTML | `p` | `h1` | `p` | `span` | `span` |
| Classe | `.type-label` | `.type-h2` | `.type-body-lg` | `font-mono text-5xl md:text-[10vw]` | `.type-label` |
| Família | DM Sans | Host Grotesk | DM Sans | Mono sistema (`--font-mono`) | DM Sans |
| Tamanho | 14px | `clamp(42px,6vw,72px)` | 21px | 48px (`text-5xl`) → ~144px (`md:text-[10vw]`) | 14px |
| Peso | 400 | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — | — | — | 0.1em |
| `text-transform` | uppercase | none | none | none | uppercase |

> Outros: `line-height` — label 1.25, h1 1.1, p 1.55, contador `leading-none`. **Métricas dos contadores = lacuna de conteúdo** (PLANO Parte 6): os números `15`/`24`/`70/30` derivam da estrutura de serviços, não de prova social externa.

### 3. Imagens / mídia
Nenhuma. Os contadores são tipografia/`font-mono` — sem criativo (PLANO Tabela 4.1: "Counters do Sobre = tipografia/animação"). **Não identificado no projeto** (sem asset de imagem para esta seção).

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Label, h1, p | Framer Motion (`RevealOnScroll`) | on-scroll | `1.75s`, ease `[0.16,1,0.3,1]`; p com `delay 0.08` |
| Cada contador | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

Respeita `prefers-reduced-motion` (render estático).

### 6. Responsividade
- **Desktop:** `flex-row`, coluna de texto `md:w-1/2`, grid contadores `md:w-2/5`; valor `text-[10vw]`; `pt-[11vw]`, `px-[5vw]`, `gap-[5vw]`.
- **Tablet:** grid de contadores mantém `grid-cols-2 grid-rows-2 aspect-square`.
- **Mobile:** `flex-col`, `pt-28`, `px-5`, `gap-12`; valor `text-5xl` (48px). Primeiro card `col-span-2` (`largo: true`).

### 7. Arquivos relacionados
`src/app/sobre/page.tsx`, `src/components/ui/RevealOnScroll.tsx`, classes `.type-label`/`.type-h2`/`.type-body-lg` em `src/styles/globals.css`.

---

# Seção 02 — Mídia institucional

### 1. Objetivo
Apoio visual institucional (proporção 2:1), ainda dentro do bloco claro.

### 2. Copy / Textos
Nenhum texto. **Não identificado no projeto**.

### 3. Imagens / mídia
Cruzado com PLANO Tabela 4.1.

| ID | Slot | Tipo | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|---|
| ABT-01 | Sec1 — slot de mídia | vídeo→imagem (OPCIONAL) | 2:1 | 1920×960 | `public/videos/ABT-01.webp` | **Produzido** |

> Render via `PlaceholderMedia` com `aspect-ratio 2/1` (de `media-spec.ts`), `rounded-lg md:rounded-[1vw]`, `sizes="(max-width: 768px) 100vw, 90vw"`. Cor de fallback `#1E293B`.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Bloco de mídia | Framer Motion (`RevealOnScroll`, embutido no `PlaceholderMedia` com `reveal` ativo) | on-scroll | `y 36→0` + `opacity 0→1`, `1.75s` |
| Imagem (quando existe asset) | CSS (`.media-zoom`) | on-hover | `scale(1.03)`, 400ms |

### 6. Responsividade
- **Desktop:** `mt-[8vw] px-[5vw]`, largura ~90vw.
- **Mobile:** `mt-20 px-5`, largura 100vw.

### 7. Arquivos relacionados
`src/app/sobre/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`.

---

# Seção 03 — Manifesto fullscreen

### 1. Objetivo
Momento contemplativo da marca: imagem fullscreen com citação institucional sobreposta.

### 2. Copy / Textos

| Campo | `<p>` citação |
|---|---|
| Conteúdo | `"O nosso compromisso é simples: ajudar o seu negócio a crescer online com soluções profissionais, eficazes e acessíveis."` |
| Elemento HTML | `p` |
| Classe | `.type-h3` + `italic` |
| Família | Host Grotesk |
| Tamanho | 36px |
| Peso | 400 |
| Cor da fonte | `#ffffff` (`text-white`) |
| `letter-spacing` | — |
| `text-transform` | none (itálico) |

### 3. Imagens / mídia
Cruzado com PLANO Tabela 4.1.

| ID | Slot | Tipo | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|---|
| ABT-02 | Sec2 — fullscreen manifesto | vídeo→imagem (OPCIONAL) | 16:9 | 2560×1440 | `public/videos/ABT-02.webp` | **Produzido** |

> Container `full-bleed`, altura `60vh` (de `media-spec.ts`), `sizes="100vw"`, `reveal={false}`. Overlay `bg-black/25` sobre a mídia. Cor de fallback `#1E293B`. Safe zone: centro 60%.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Citação | Framer Motion (`RevealOnScroll`) | on-scroll | reveal de texto linha-a-linha, `1.75s` |
| Mídia de fundo | — | — | `reveal={false}` (sem reveal); só zoom CSS no hover quando há asset |

### 6. Responsividade
- **Todos:** imagem fullscreen `60vh`; citação centrada `max-w-3xl`.
- **Desktop:** `px-[5vw]`, `mt-[8vw]`. **Mobile:** `px-5`, `mt-20`.

### 7. Arquivos relacionados
`src/app/sobre/page.tsx`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`.

---

# Seção 04 — Valores (Porquê escolher-nos)

### 1. Objetivo
Listar os 6 valores/diferenciais da agência em layout de duas colunas (rótulo à esquerda, lista à direita).

### 2. Copy / Textos

| Campo | `<h2>` label | Valor `<h3>` | Valor `<p>` |
|---|---|---|---|
| Conteúdo | `Porquê escolher-nos` | Título do valor | Texto do valor |
| Elemento HTML | `h2` | `h3` | `p` |
| Classe | `.type-label` | `.type-h3` | `.type-body` |
| Família | DM Sans | Host Grotesk | DM Sans |
| Tamanho | 14px | 36px | 18px |
| Peso | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | 0.1em | — | — |
| `text-transform` | uppercase | none | none |

Os 6 valores (array `VALORES`): Experiência comprovada · Técnica + criatividade · Tecnologia de ponta · Acompanhamento próximo · Foco em pequenas empresas · Resultados mensuráveis.

> PLANO (Sec 3 Sobre) prevê layout de 4 slots de valores; a copy tem 6 — aqui os 6 são exibidos em lista vertical.

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
Nenhum.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cada valor (h3 + p) | Framer Motion (`RevealOnScroll` `variant="media"`) | on-scroll | stagger `delay = i*0.08` |

### 6. Responsividade
- **Desktop:** `flex-row` — rótulo `md:w-1/2`, lista `md:w-1/2`; `gap-[3vw]`, `px-[5vw]`, `py-[8vw]`.
- **Mobile:** `flex-col`, `gap-8`, `px-5`, `py-20`.

### 7. Arquivos relacionados
`src/app/sobre/page.tsx`, `src/components/ui/RevealOnScroll.tsx`.

---

# Seção 05 — CTA final

### 1. Objetivo
Conversão institucional (faixa preta `.section-cta`, centrada).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Pronto para começar?` | `Agende uma reunião gratuita e sem compromisso.` |
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
- **Desktop:** `px-[5vw] py-[8vw]`. **Mobile:** `px-5 py-20`.

### 7. Arquivos relacionados
`src/app/sobre/page.tsx`, classe `.btn-submit` e `.section-cta` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados na Sobre (de `globals.css`)

| Token / Contexto | Valor | Onde aparece na Sobre |
|---|---|---|
| `.section-light` | bg `#ffffff`, text `#0a0a0a`, muted `#575757`, border `#dcdcdc` | wrapper das Seções 01–02 |
| `--gmt-bg` | `#ffffff` | fundo geral / Seção 04 (`bg-gmt-bg`) |
| `--gmt-bg-alt` | `#f5f5f5` | cartões dos contadores (`bg-gmt-bg-alt`) |
| `--gmt-border` | `#dcdcdc` | bordas (contadores) |
| `--gmt-text` | `#0a0a0a` | títulos/valores em fundo claro |
| `--gmt-text-muted` | `#575757` | labels e textos secundários (claro) |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seção 05 |
| fallback de mídia | `#1E293B` | Seções 02 e 03 (ABT-01, ABT-02) |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** pela página Sobre — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*
