# GUIA DE EDIÇÃO — PARTE 04 · SERVIÇO · DETALHE (`/servicos/[slug]`)

> Documentação do **template único** de página individual de serviço.
>
> **Arquivo principal:** `src/app/(site)/servicos/[slug]/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `src/styles/globals.css`, `src/data/servicos.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`.
>
> **Actualização:** Jul 2026 — hero Sec0: thumb AG/MKT/AV por slug; Sec4 «Como funciona»: timeline `ComoFuncionaTimeline` (sem mídia CF/AGP-F).

---

## A. Visão geral

As rotas `/servicos/[slug]` são páginas de detalhe de cada serviço da GMT (agentes, pacotes de marketing e avulsos). Existe **um único template** em `src/app/(site)/servicos/[slug]/page.tsx` partilhado por **todos** os slugs.

| Campo | Detalhe |
|---|---|
| Rota | `/servicos/[slug]` (dinâmica) |
| Arquivo | `src/app/(site)/servicos/[slug]/page.tsx` |
| Componentes | `RevealOnScroll`, `ComoFuncionaTimeline`, `PlaceholderMedia`, ícone `Check` (`lucide-react`), `Link` (`next/link`) |
| Dados | `servicos`, `getServicoBySlug` (`src/data/servicos.ts`); `getServicoHeroId` (`src/lib/media.ts`) |
| Geração estática | `generateStaticParams()` → **18 páginas** (9 agentes + 3 pacotes + 6 avulsos); `generateMetadata()` (title = `servico.nome`, description = `headline` / `solucao` / `nome`) |
| 404 | `notFound()` quando o slug não existe |
| Globais (via `(site)/layout.tsx`) | `Navbar`, `Footer`, `ChatWidgetLoader`, `SmoothScroll` (Lenis) |

**Ordem actual das secções:**

1. Hero
2. O desafio *(condicional — `problema`)*
3. A solução + benefícios *(condicional)*
4. O que inclui *(sempre)*
5. Como funciona — timeline animada *(sempre; `ComoFuncionaTimeline`)*
6. Para quem é *(sempre — tags ou fallback + CTA contacto)*
7. Footer global *(via `(site)/layout.tsx`)*

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
- Container: `not-prose`, `h-[80vh] md:h-[70vh]`, `overflow-hidden`, fundo inline `backgroundColor: servico.corPlaceholder`
- Overlay: `bg-gradient-to-t from-black via-black/40 to-black/10` (topo com leve escurecimento — evita faixa branca do `main` a transparecer)
- Conteúdo textual: `flex h-full flex-col items-center justify-center text-center`
- Bloco título + subtítulo: `flex flex-col items-center gap-3` (12px entre headline e subtítulo)
- Botão voltar: `absolute bottom-0 left-0` com `px-5 pb-12 md:px-[5vw] md:pb-[5vw]`

### Espaçamento headline ↔ subtítulo

| Elemento | Regra no código | Valor efectivo |
|---|---|---|
| Entre linhas do `<h1>` | `!leading-[1.05]` + `[&>div]:!leading-[1.05]` (override de `.type-hero--fullscreen`) | line-height **1.05** — mais compacto que o default `clamp(1, 8vw, 1.1)` |
| Entre `<h1>` e `<p>` headline | wrapper `gap-3` | **12px** (`0.75rem`) |
| Subtítulo anterior | `mt-4` (16px) | **removido** — substituído pelo `gap-2` do wrapper |

> Referência Home: marca GMT usa `line-height: 1`; aqui usa-se **1.05** para legibilidade em nomes longos de serviço, mantendo bloco visual compacto.

### Copy / tipografia

| Campo | Botão anterior | Botão próximo | `<h1>` | `<p>` headline |
|---|---|---|---|---|
| Conteúdo | `← Serviço anterior` | `Próximo serviço →` | `servico.nome` (dados) | `servico.headline` (dados; condicional) |
| Elemento HTML | `a` (`Link`) | `a` (`Link`) | `h1` | `p` |
| Classe | `.type-label` + utilitários inline (`HERO_NAV_LINK`) | idem | `.type-hero` + `.type-hero--fullscreen` + `!leading-[1.05]` | `text-[clamp(1.125rem,2.5vw,1.75rem)]` |
| Família | DM Sans | DM Sans | Host Grotesk | DM Sans (tamanho fluido via `clamp`) |
| Tamanho | 14px (label) | 14px (label) | `clamp(52px,9vw,108px)` via `--type-hero` | `clamp(1.125rem, 2.5vw, 1.75rem)` — **menor que o h1** |
| Peso | 500 (`font-medium`) | 500 (`font-medium`) | 400 | 400 |
| Cor | `#ffffff` sobre `bg-white/20` translúcido | idem | `#ffffff` (`!text-white`) | `#ffffff` (`text-white`) |

> O subtítulo **não** usa `.type-body-lg` nem tamanho fixo em px.  
> O h1 usa override local `!leading-[1.05]` — não altera tokens globais.

### Navegação anterior / próximo (hero)

- **Removido:** botão `← Ver todos os serviços` → `/servicos`
- **Adicionado:** dois botões no rodapé da hero — `← Serviço anterior` (esquerda) e `Próximo serviço →` (direita)
- **Layout:** `absolute inset-x-0 bottom-0 flex justify-between` — cantos inferiores da secção
- **Destino:** sempre `/servicos/{slug}` — nunca sai da rota de detalhe
- **Ordem:** array `servicos` em `src/data/servicos.ts` (agentes → pacotes → avulsos, mesma ordem da listagem `/servicos`)
- **Loop:** circular via `getAdjacentServicos(slug)` — o último serviço aponta para o primeiro e vice-versa
- **Estilo:** constante `HERO_NAV_LINK` — vidro branco translúcido: `rounded-lg border border-white/25 bg-white/20 px-5 py-3 font-medium text-white backdrop-blur-md`; hover `hover:bg-white/30`
- **Não existe** link para `/servicos` na hero

### Mídia de fundo

Hero resolvido por `getServicoHeroId(servico)` → **`getServicoThumbId()`** (thumb 3:2 AG/MKT/AV do slug). Render `fill`, `priority`, `sizes="100vw"`, `reveal={false}`. Classes extra: `[&_img]:object-cover [&_img]:object-center [&_img]:scale-[1.02]`.

**Padrão visual (todas as rotas `/servicos/[slug]`):**

| Camada | Detalhe |
|---|---|
| Container | `h-[80vh] md:h-[70vh]`, `corPlaceholder` como fallback |
| Mídia | Thumb 3:2 com `object-cover` — adapta-se ao banner (~3:1 efectivo) |
| Overlay | `bg-gradient-to-t from-black via-black/40 to-black/10` |
| Título | `h1` branco centrado · `type-hero--fullscreen` · headline opcional abaixo |
| Navegação | Botões anterior/próximo no rodapé da hero |

**Mapeamento ID → serviço (hero = thumb da listagem):**

| Tipo | Condição | ID hero | Proporção asset | Export (px) | Ficheiro |
|---|---|---|---|---|---|
| Agente | por slug | AG-01…15 | 3:2 | 1200×800 | `public/images/AG-0X.webp` |
| Pacote | por slug | MKT-01…03 | 3:2 | 1200×800 | `public/images/MKT-0X.webp` |
| Avulso | por slug | AV-01…06 | 3:2 | 1200×800 | `public/images/AV-0X.webp` |

> **Retirados (Jul 2026):** ~~AGH-F1…4~~, ~~MKT-04~~ — substituídos pelos thumbs do slug; ver `docs/MAPA_APLICACAO_MIDIA.md` § IDs retirados. Compor assunto no **centro 55%** dos thumbs.

### Comportamento da mídia (anti-barra no topo)

| Camada | Função |
|---|---|
| `<section>` | `backgroundColor: servico.corPlaceholder` — fallback se a imagem demorar ou houver fresta |
| `PlaceholderMedia` | `absolute inset-0`, `object-cover object-center`, `scale-[1.02]` na imagem |
| Overlay gradiente | `to-black/10` no topo (em vez de `to-transparent`) — não expõe o branco do `main` |

**Diagnóstico:** a faixa sólida no topo era causada principalmente pelo **código** (gradiente transparente no topo + fundo branco do `main` visível em frestas de subpixel), não por dimensão incorrecta dos assets AGH (2560×860 confirmado). Avulsos em 3:2 exigem crop via `cover`; composição centralizada no asset evita barras baked-in.

Cruzado com PLANO § 4.2-A (thumbs AG/MKT/AV), § 4.2-B (AGP-F* Sec3).

### Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| h1, headline | `RevealOnScroll` | on-scroll | `REVEAL_DURATION` 2.0s; headline `delay={0.08}` |
| Botões anterior/próximo | `RevealOnScroll variant="media"` | on-scroll | translateY + opacity, 2.0s; próximo `delay={0.08}` |
| Mídia de fundo | — | — | `reveal={false}` |

> A hero **não** usa `RevealSequence`. Cada bloco anima de forma independente ao entrar no viewport.

### Responsividade
- **Desktop:** `h-[70vh]`; conteúdo centrado, `px-[5vw]`; botões `md:pb-[5vw]`, `justify-between`
- **Mobile:** `h-[80vh]`; conteúdo centrado, `px-5`; botões `pb-12`

### Arquivos relacionados
`src/app/(site)/servicos/[slug]/page.tsx`, `src/lib/media.ts`, `src/components/ui/PlaceholderMedia.tsx`, `src/data/media-spec.ts`, classes `.type-hero`/`.type-hero--fullscreen` em `src/styles/globals.css`.

---

## C. Secções da página

### Dados vs. estrutura do template

| Origem | Conteúdo |
|---|---|
| **Dados — `servicos.ts` (por serviço)** | `nome`, `headline`, `problema`, `solucao`, `beneficios[]`, `funcionalidades[]`, `casosDeUso[]`, `familia`, `corPlaceholder`, `tipo` |
| **Dados — `lib/media.ts`** | ID do hero (`getServicoHeroId`) |
| **Dados — `servicos.ts`** | `getAdjacentServicos(slug)` — anterior/próximo na ordem global |
| **Estrutural — fixo no template** | Componente `Kicker`; rótulos de secção; `ComoFuncionaTimeline` (5 etapas); copy dos botões hero |
| **Condicional** | Sec. O desafio se `problema`; Sec. Solução+benefícios se `mostrarSolucao \|\| beneficios.length`; intro “O que inclui” (solução repetida) só se `tipo === "pacote"`; **Para quem é sempre renderizada** — tags se `casosDeUso.length > 0`, senão parágrafo fallback + CTA |

### Secção — O desafio

> Condicional: só renderiza se `servico.problema` existir.

| Campo | Kicker | `<p>` |
|---|---|---|
| Conteúdo | `O desafio` | `servico.problema` |
| Classe | `Kicker` → `.type-label` | `.type-section-title` |

### Secção — A solução + benefícios

> Condicional: `mostrarSolucao` (solução existe e `tipo !== "pacote"`) ou `beneficios.length > 0`.

Layout 2 colunas (`md:w-1/3` / `md:w-2/3`), `border-t border-gmt-border`:
- Esquerda: `Kicker` "A solução" + `<h2 class="type-section-title">Como resolvemos</h2>`
- Direita: parágrafo `.type-body-lg` (solução) + grelha 2 colunas de benefícios com ícone `Check` em cards `rounded-xl border bg-gmt-bg-alt`

### Secção — O que inclui

> **Sempre** renderizada.

Layout 2 colunas. Lista numerada `01…` com `font-mono` + `.type-body-lg`. Para pacotes, repete `servico.solucao` como prefácio.

### Secção — Para quem é

> **Sempre** renderizada.

Tags `.tag-pill` se `casosDeUso.length > 0`; senão parágrafo fallback institucional. CTA: `Falar sobre este serviço →` — `rounded-full bg-black px-8 py-3.5 text-white hover:bg-black/80`.

---

## D. Como funciona (Sec. 4)

### Objetivo
Comunicar **um processo contínuo** em cinco etapas — timeline minimalista (linha + círculos + texto), sem cards nem mídia.

### Componente
`src/components/servicos/ComoFuncionaTimeline.tsx` — client component com animação própria (não usa `RevealOnScroll`).

### Layout

| Viewport | Comportamento |
|---|---|
| **Desktop (md+)** | Linha horizontal (`neutral-200` → preto), 5 círculos em `grid-cols-5`, texto centrado abaixo de cada círculo |
| **Mobile** | Linha vertical à esquerda (centrada na coluna dos círculos), texto à direita de cada círculo |

### Etapas (fixas em todas as páginas)
1. Reunião inicial
2. Proposta personalizada
3. Planeamento estratégico
4. Execução & implementação
5. Acompanhamento & otimização

### Estilo
- Apenas preto, branco e cinza suave (`neutral-200`, `neutral-300`)
- Tipografia `.type-body` · sem cards, bordas de bloco, sombras, ícones ou gradientes
- Círculos: vazados (`border-neutral-300`) → preenchidos (`bg-black`) na animação

### Animação
- **Gatilho:** `IntersectionObserver` (`threshold: 0.2`) na primeira entrada no viewport
- **Sequência:** linha avança até cada centro de círculo (10%, 30%, 50%, 70%, 90%) → círculo preenche → texto (`opacity` + `translateY(6px→0)`, 280ms) → segmento final até 100%
- **Uma vez por visita:** `sessionStorage` key `gmt-como-funciona-timeline`
- **`prefers-reduced-motion`:** estado final imediato

### Integração no template
```tsx
<Kicker>O processo</Kicker>
<RevealOnScroll as="h2" className="type-section-title">Como funciona</RevealOnScroll>
<ComoFuncionaTimeline />
```

### Mídia
**Não aplicável** — slots **CF-01…05** e **AGP-F1…4** foram **removidos** do código (Jul 2026). Ficheiros órfãos em `public/images/AGP-F*.webp` podem ser apagados.

---

## F. Observações finais

- **Página enxuta:** sem CTA final de conversão; sem showcase de portfolio (NARA); conversão global via `ChatWidgetLoader` do layout.
- **Template único:** qualquer alteração em `page.tsx` afecta os 18 slugs.
- **Hero actualizada:** headline centrada, subtítulo fluido; navegação anterior/próximo em loop na base da hero.
- **Sec. Como funciona:** timeline animada (`ComoFuncionaTimeline`); sem slots de mídia.
- **Footer global:** renderizado em `src/app/layout.tsx`, fora do `page.tsx` do serviço.
- **Documentação alinhada** com `src/app/(site)/servicos/[slug]/page.tsx` e `src/components/servicos/ComoFuncionaTimeline.tsx`.

---

## Apêndice — tokens e cores (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| Hero overlay | gradiente `from-black via-black/40 to-black/10`; h1 `#ffffff`; headline `text-white` | Sec. Hero |
| Hero fallback | `servico.corPlaceholder` inline no `<section>` | Sec. Hero |
| `.section-light` | bg `#ffffff`, text `#0a0a0a`, muted `#575757`, border `#dcdcdc` | wrapper Sec. 01–05 |
| `--gmt-text` | `#0a0a0a` | problema (h3), funcionalidades, benefícios |
| `--gmt-text-muted` | `#575757` | rótulos de secção, solução |
| `--gmt-accent` | `#2563eb` | ícone `Check` (benefícios) |
| `--gmt-bg-alt` | `#f5f5f5` | cartões de benefício |
| `--gmt-border` | `#dcdcdc` | bordas de cartões/listas |
| `.tag-pill` | fundo `rgb(255 255 255 / 0.8)`, texto `#000` | Sec. Para quem é |
| Botões hero (anterior/próximo) | `bg-white/20 border-white/25`, `backdrop-blur-md`, `font-medium text-white` | Sec. Hero |
| Timeline Como funciona | linha `neutral-200`/`black`, círculos vazados/preenchidos, `.type-body` | Sec. Como funciona |
| Cores fallback hero | `servico.corPlaceholder` por serviço | Sec. Hero |

*Documento gerado a partir do código do repositório. Nenhuma informação foi inventada.*
