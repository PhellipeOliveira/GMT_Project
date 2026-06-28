# Reveal global de entrada

Documentação técnica do efeito de entrada usado em textos, cards e imagens do site GMT.  
**Fonte de verdade:** código em `src/components/ui/RevealOnScroll.tsx` e ficheiros relacionados (Jun 2026).

---

## 1. Visão geral

### O que é

O **reveal global** é o padrão de animação de entrada ao scroll: o conteúdo “nasce” de baixo para cima quando entra no viewport. Não é um plugin de layout nem um efeito CSS global — é um **componente React reutilizável** (`RevealOnScroll`) aplicado bloco a bloco nas páginas.

### Objetivo

- Dar consistência visual entre páginas (textos, cards, imagens).
- Em **texto puro**, revelar **linha a linha** (cascata sequencial dentro do mesmo bloco).
- Em **mídia e JSX**, revelar o **bloco inteiro** com movimento + fade.
- Respeitar `prefers-reduced-motion` (render estático).

### Onde é usado

| Área | Como entra no sistema |
|------|------------------------|
| Páginas (`src/app/**`) | `<RevealOnScroll>` em títulos, parágrafos, CTAs, grids |
| `PlaceholderMedia` | Envolve mídia em `RevealOnScroll variant="media"` quando `reveal={true}` (default) |
| `SectionLabel` | Envolve o label em `RevealOnScroll` |
| `Accordion`, `ServiceCard`, `PortfolioCard`, `HomePortfolioRow`, `AboutCounterGrid` | Reveal em itens/cards |

**Não** está em `layout.tsx` — cada secção opta explicitamente pelo componente.

---

## 2. Stack e arquivos envolvidos

### Biblioteca principal

| Tecnologia | Papel |
|------------|--------|
| **Framer Motion** (`framer-motion`) | Anima `y`, `opacity`; gatilho `whileInView` |
| **Intersection Observer** (interno ao Framer) | Dispara a animação quando o elemento entra no viewport |

### Arquivos centrais

| Arquivo | Função |
|---------|--------|
| `src/components/ui/RevealOnScroll.tsx` | Componente principal; constantes exportadas; modos texto e mídia |
| `src/lib/split-text-lines.ts` | Mede linhas visuais após wrap CSS |
| `src/components/ui/reveal-sequence.tsx` | Contexto `RevealSequence` — encadeia blocos irmãos |
| `src/hooks/useReducedMotion.ts` | Desliga animação se `prefers-reduced-motion: reduce` |

### Dependências instaladas mas fora deste efeito

| Pacote | Estado |
|--------|--------|
| **Lenis** (`SmoothScroll.tsx`) | Scroll suave global; **não** controla timing do reveal |
| **GSAP** | Presente em `package.json`; **sem imports** em `src/` para este efeito |

### Fora do sistema global (exceções)

| Componente / contexto | Animação |
|------------------------|----------|
| `HeroTitle` + `HeroSection` (Home) | Framer Motion **letra a letra**; não usa `RevealOnScroll` |
| `ExpandingFrame` | `useScroll` + `useTransform`; mídia com `reveal={false}` |
| `PlaceholderMedia` com `reveal={false}` | Sem reveal (heroes, overlays, slideshow, cards com imagem embutida) |
| `GMTLightFooter` | `mask-image` + cursor (CSS/JS) |
| `FloatingCTA` | `motion` próprio |
| `RevealText`, `RevealItem`, `HeroSlider` | Componentes legados; **não** referenciados pelas páginas actuais |

---

## 3. Comportamento por tipo de conteúdo

### Texto puro (`children` é `string` e variante não forçada para `media`)

- Entra no modo **`RevealTextLines`**.
- Split automático em **linhas visuais** (ver secção 4).
- Animação por linha: **apenas `translateY`** (`initial.y` → `0`).
- **Sem** animação de `opacity` no texto (confirmado no código: `motion.div` das linhas não define `opacity`).

### Blocos mistos / JSX (`children` não é `string`)

Exemplos reais no projeto:

- `{servico.nome}`, `{servico.headline}` em `/servicos/[slug]`
- Ícone + texto dentro de um único `RevealOnScroll variant="media"`
- Qualquer elemento React como filho

Comportamento: modo **`RevealMask`** — **um bloco** com `translateY` **e** `opacity` (`0` → `1`).

### Cards / mídia (`variant="media"` ou filho não-string)

- Um wrapper `overflow-hidden`.
- `translateY`: `REVEAL_MEDIA_Y` (20px).
- `opacity`: `0` → `1`.
- Duração: `REVEAL_DURATION` (2.75s).

Usado em: cards de serviço, imagens via `PlaceholderMedia`, linhas de portfolio, itens de accordion, etc.

### `SectionLabel`

- Renderiza `RevealOnScroll as="p"` com `children` do label.
- Se `children` for **string** (ex.: `"O que fazemos"`), usa modo linha a linha.
- Se `children` for ReactNode complexo, cai em bloco único.

---

## 4. Como o texto quebra em linhas

### Mecanismo (estado actual)

1. O texto é partido em **palavras** (`split(/\s+/)`).
2. Cada palavra é inserida num `<span>` invisível com a **largura do container** (`ResizeObserver` recalcula no resize).
3. Palavras com o mesmo `offsetTop` são agrupadas numa **linha visual**.
4. Cada linha é renderizada dentro de um `div.overflow-hidden` com o seu próprio `motion.div`.

Isto reflecte o **wrap real** do CSS (largura, `max-width`, tipografia), não quebras manuais no copy.

### É necessário `<br>`?

**Não**, para o funcionamento do split. O sistema não depende de `<br>`.

- **`<br>`** só é útil se quiseres **forçar** uma quebra num ponto específico independente da largura (o split mede o DOM resultante).
- Para **mais linhas** em desktop, ajusta a **largura do container** (`max-w-*`, colunas, etc.) — não o copy.

### Quando deixa de ser line-by-line

| Condição | Resultado |
|----------|-----------|
| `children` não é `string` | Bloco único (`RevealMask`) |
| `variant="media"` explícito | Bloco único com opacity |
| `prefers-reduced-motion` | Texto estático, sem animação |
| Uma única linha visual | Cascata existe, mas com **uma** linha só — pouco perceptível |

### Texto em JSX multilinha

```tsx
<RevealOnScroll as="h1">
  Linha um
  Linha dois
</RevealOnScroll>
```

Em React, texto contíguo entre tags costuma ser **uma string** com espaços — o split trata como **uma** sequência de palavras, não como duas linhas forçadas. Quebras visuais vêm do wrap, não das quebras no source.

---

## 5. Parâmetros actuais

Constantes exportadas de `RevealOnScroll.tsx` (valores no código hoje):

| Constante | Valor | Aplica-se a |
|-----------|-------|-------------|
| `REVEAL_DURATION` | `2.75` (segundos) | Cada linha de texto; cada bloco de mídia |
| `REVEAL_LINE_GAP` | `0.12` (s) | Pausa entre **fim** de uma linha e **início** da seguinte (mesmo bloco) |
| `REVEAL_BLOCK_GAP` | `0.18` (s) | Pausa entre blocos dentro de `RevealSequence` |
| `REVEAL_EASE_OUT` | `[0.25, 1, 0.35, 1]` | Cubic-bezier Framer Motion |
| `REVEAL_TEXT_Y` | `28` (px) | Deslocamento inicial do texto |
| `REVEAL_MEDIA_Y` | `20` (px) | Deslocamento inicial de mídia/cards |

### Viewport / gatilho

```ts
{ once: true, margin: "-4% 0px" }
```

- `once: true` — anima uma vez por elemento.
- `margin: "-4% 0px"` — o gatilho dispara quando o elemento está ~4% antes de entrar totalmente no viewport (entrada ligeiramente antecipada).

### Delay por linha (mesmo bloco, sem `RevealSequence`)

```
delay_linha(i) = delay_prop + i × (REVEAL_DURATION + REVEAL_LINE_GAP)
```

`delay_prop` é a prop `delay` de `RevealOnScroll` (default `0`).  
Exemplo com 3 linhas e `delay={0}`: linha 0 em 0s; linha 1 em 2.87s; linha 2 em 5.74s.

### Delay entre blocos (`RevealSequence`)

Quando um `RevealOnScroll` está **dentro** de `<RevealSequence>`:

1. Cada filho regista-se por ordem no DOM (`useId` + `register`).
2. Após medir linhas, reporta `lineCount` ao contexto.
3. O delay encadeado é a soma da duração dos blocos anteriores + `REVEAL_BLOCK_GAP` entre eles.

Fórmula por bloco anterior `i`:

```
blockRevealDuration(n) = n × REVEAL_DURATION + (n − 1) × REVEAL_LINE_GAP
```

Blocos de mídia reportam `lineCount = 1`.

**Nota:** até o número de linhas ser medido, blocos posteriores assumem **1 linha** nos predecessores (`lineCountsRef[i] ?? 1`). Após medição, os delays são recalculados (re-render).

### Stagger manual (fora de `RevealSequence`)

Várias páginas usam `delay={i * 0.06}` ou `delay={i * 0.08}` em **grids de cards**. Isso é independente da cascata linha a linha e **não** espera o bloco anterior terminar — apenas atrasa o início de cada item.

---

## 6. `RevealSequence` — estado actual no código

### Existe?

**Sim.** Ficheiro: `src/components/ui/reveal-sequence.tsx`.  
Integrado em `RevealOnScroll` via hook `useChainedDelay` + `useRevealSequence()`.

### Como funciona

1. `<RevealSequence>` fornece contexto React.
2. Filhos `RevealOnScroll` (na ordem do DOM) obtêm índice e delay cumulativo.
3. Texto reporta linhas reais; mídia reporta `1`.
4. O próximo bloco só recebe delay depois de contabilizar a duração total dos anteriores.

### Onde está aplicado hoje

| Página / zona | Conteúdo encadeado |
|---------------|-------------------|
| `/sobre` | Intro: label + h1 + parágrafo |
| `/contacto` | Cabeçalho (label + h1 + p); CTA final (h2 + p + botão) |
| `/servicos` | Cabeçalho (label + h1 + p) via `RevealSequence` — **sem CTA final** |
| `/portfolio` | Intro (label + h1 + p) |
| `/servicos/[slug]` | *(não usa `RevealSequence`)* — hero: link + h1 + headline em blocos independentes |

### Onde **não** está aplicado (relevante)

| Página / zona | Comportamento |
|---------------|---------------|
| **Home** (`page.tsx`) | `SectionLabel` + cards com stagger manual; **sem** `RevealSequence` |
| `/sobre` sec. valores | Lista com `variant="media"` e `delay={i * 0.06}` — paralelo por item |
| Secções com label + corpo em colunas separadas sem wrapper | Blocos podem entrar em **paralelo** |
| Grids (serviços, portfolio, accordion, etc.) | Stagger `i * 0.08` — paralelo entre itens |

Ou seja: `RevealSequence` **não é global** — só actua onde o JSX envolve explicitamente os blocos.

---

## 7. O que afecta a percepção visual

### Por que pode parecer rápido

| Factor | Explicação |
|--------|------------|
| **Blocos em paralelo** | Vários `RevealOnScroll` irmãos **sem** `RevealSequence` disparam quase ao mesmo tempo |
| **Poucas linhas visuais** | Títulos largos em desktop = 1–2 linhas → cascata quase invisível |
| **Conteúdo dinâmico** | `{variavel}` não é string → bloco único com fade de opacity (parece “mais rápido” que cascata) |
| **Gatilho antecipado** | `margin: "-4% 0px"` inicia antes do elemento estar bem visível |
| **Lenis** | Scroll suave altera a **sensação** de velocidade do scroll, não a duração da animação |
| **Duração absoluta** | 2.75s por linha é lenta no papel, mas o movimento de 28px com easing forte no fim pode parecer “resolvido” antes do tempo total |

### Cascata pouco perceptível

- Uma linha = sem efeito de sequência dentro do bloco.
- `REVEAL_LINE_GAP` de 0.12s é curto **relativamente** à pausa entre linhas completas (cada linha demora 2.75s) — a separação **entre** linhas é clara; o que falta é **ter** várias linhas.
- Secções sem `RevealSequence`: label, título e parágrafo competem visualmente.

### Papel da opacidade

| Modo | Opacidade |
|------|-----------|
| Texto line-by-line | **Não animada** — só `translateY` dentro da máscara |
| Mídia / JSX / bloco | **Sim** — `opacity: 0 → 1` junto com `y` |

### Papel da largura do container

Largura maior → menos quebras → menos linhas → menos cascata.  
É o principal lever **de design** (não de código) para tornar o efeito mais evidente.

---

## 8. Pontos de calibração futura

Ajustes que **fazem sentido** sem trocar de biblioteca (não são o estado actual — são alavancas):

| Alavanca | Ficheiro / local | Efeito esperado |
|----------|------------------|-----------------|
| `REVEAL_DURATION` | `RevealOnScroll.tsx` | Mais lento/rápido por linha ou bloco |
| `REVEAL_LINE_GAP` | idem | Mais espaço entre linhas do **mesmo** bloco |
| `REVEAL_BLOCK_GAP` | idem | Mais espaço entre label / título / parágrafo em `RevealSequence` |
| `REVEAL_TEXT_Y` / `REVEAL_MEDIA_Y` | idem | Mais ou menos “deslocamento” na máscara |
| `REVEAL_EASE_OUT` | idem | Sensação de arranque vs. desaceleração |
| `viewport.margin` | idem | Quão cedo o reveal dispara |
| Expandir `RevealSequence` | páginas ainda sem wrapper | Menos entradas paralelas em cabeçalhos |
| Opacidade lenta no texto | `RevealTextLines` | Hoje **não existe**; seria mudança de código deliberada |
| Passar copy dinâmico como `string` | páginas com `{variavel}` | Só relevante se o conteúdo puder ser string no momento do render |

**Hipótese não implementada:** trocar GSAP / SplitText — não necessário para line-by-line com o sistema actual.

---

## 9. Conclusão

O site **já suporta** entrada linha a linha para `children` string via `RevealOnScroll` + `split-text-lines.ts`. O texto **não** usa fade de opacidade nesse modo; mídia e blocos JSX **usam**.

`RevealSequence` **existe e está em uso** em cabeçalhos e CTAs de várias páginas, mas **não** cobre todo o site (ex.: Home e muitas secções internas continuam com reveals paralelos ou stagger manual).

Para o efeito parecer **mais lento e narrativo** na prática, calibrar:

1. Constantes de timing (`duration`, `line gap`, `block gap`).
2. Onde envolver blocos de texto em `RevealSequence`.
3. Largura dos containers (mais linhas visuais).
4. Evitar `variant="media"` em blocos que deviam ser texto puro em cascata.

Não é obrigatório trocar de biblioteca para atingir esse comportamento — é sobretudo **calibração** e **orquestração** consistente.
