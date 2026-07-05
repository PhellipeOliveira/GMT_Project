# Reveal global — resto do site (não inclui Hero da Home)

Documentação do efeito de entrada ao scroll usado **a partir da secção 2 da Home** e em **todas as outras páginas**.

> **Separado da Hero:** a animação letra-a-letra da secção 1 da Home está em `docs/HERO_HOME_ANIMACAO.md`.
> Esse efeito está **aprovado e estável** — não faz parte deste sistema.

**Fonte de verdade:** `src/components/ui/RevealOnScroll.tsx` (Jul 2026).

---

## Estado actual

**Refatorado (Jul 2026):** o reveal é agora **uniforme**. Texto e mídia sobem como **um único bloco** (`translateY + opacity`), exactamente da mesma forma. Foi **removido** o antigo modo linha-a-linha (cada linha esperava a anterior terminar), que causava o efeito «travado / quebrado».

---

## O que é

Padrão de animação ao scroll: o conteúdo «nasce» de baixo para cima quando entra no viewport, com fade simultâneo.

| Tipo | Comportamento |
|------|---------------|
| **Texto** (títulos, parágrafos, labels) | Bloco único — `translateY` + `opacity 0→1` |
| **Mídia** (cards, imagens, JSX) | Bloco único — `translateY` + `opacity 0→1` |

Ambos partilham a **mesma máscara** (`overflow-hidden` + `motion.div`). A única diferença é o deslocamento inicial (`REVEAL_TEXT_Y` vs `REVEAL_MEDIA_Y`).

---

## Onde é usado

| Área | Exemplos |
|------|----------|
| Home sec. 2+ | Cards «O que fazemos», diferenciais, portfolio row, CTAs |
| `/sobre` | Intro, manifesto, valores, contadores |
| `/servicos` | Cabeçalho, thumbs, accordion |
| `/servicos/[slug]` | Secções de conteúdo, cards «Como funciona» |
| `/portfolio`, `/portfolio/[slug]` | Listagens, ficha |
| `/contacto` | Intro, formulário, CTA |
| Componentes | `SectionLabel`, `PlaceholderMedia` (default `reveal={true}`), `Accordion`, cards |

**Não usa reveal global:**

- Hero Home (`HeroTitle`) — ver doc separada
- `ExpandingFrame`, heroes fullscreen (`reveal={false}`)
- `GMTLightFooter` (efeito lanterna próprio)

---

## Ficheiros envolvidos

| Ficheiro | Função |
|----------|--------|
| `src/components/ui/RevealOnScroll.tsx` | **Componente principal** + constantes exportadas |
| `src/components/ui/reveal-sequence.tsx` | Stagger opcional entre blocos irmãos (label → título → parágrafo) |
| `src/hooks/useReducedMotion.ts` | Desliga animação |

---

## Parâmetros que podes editar manualmente

**Ficheiro único para timing:** `src/components/ui/RevealOnScroll.tsx` (topo do ficheiro).

| Constante | Valor actual | O que faz | Afeta |
|-----------|--------------|-----------|--------|
| `REVEAL_DURATION` | `2.0` s | Duração do reveal de cada bloco | Texto, títulos, cards, imagens |
| `REVEAL_BLOCK_GAP` | `0` s | Stagger entre blocos irmãos em `RevealSequence` (`0` = simultâneo) | Label → título → parágrafo |
| `REVEAL_TEXT_Y` | `28` px | Deslocamento inicial do texto | Títulos, parágrafos |
| `REVEAL_MEDIA_Y` | `20` px | Deslocamento inicial de mídia | Cards, thumbs, imagens |
| `REVEAL_EASE_OUT` | `[0.25, 1, 0.35, 1]` | Curva de desaceleração | Tudo |

> **Nota:** `REVEAL_LINE_GAP` e o split por linhas (`split-text-lines.ts`) foram **removidos** — já não existe cascata linha-a-linha.

### Viewport (gatilho)

```ts
{ once: true, margin: "-4% 0px" }
```

- `once: true` — anima uma vez
- `margin: "-4% 0px"` — dispara ligeiramente antes de entrar no ecrã

### Stagger manual em grids

Fora de `RevealSequence`, muitas páginas usam `delay={i * 0.08}` ou `0.06` — atrasa o **início** de cada item. Continua a funcionar (soma-se ao delay encadeado).

---

## Guia rápido de calibração

Para ajustar o ritmo sem mexer na Hero:

1. **`REVEAL_DURATION`** — principal alavanca. Ex.: `2.0` → `1.2`–`1.6` deixa tudo mais ágil.
2. **`REVEAL_TEXT_Y` / `REVEAL_MEDIA_Y`** — menos deslocamento = sensação mais subtil.
3. **`REVEAL_BLOCK_GAP`** — sobe para `0.08`–`0.12` se quiseres uma cascata leve entre label/título/parágrafo; deixa `0` para subirem juntos.
4. **`REVEAL_EASE_OUT`** — curva de arranque vs. desaceleração.

**Não editar** `src/components/hero/HeroTitle.tsx` ao calibrar o reveal global.

---

## Como funciona (resumo técnico)

- `RevealOnScroll` envolve o conteúdo num `Wrapper` (a tag semântica via `as`, ou `div`) com `overflow-hidden`, e dentro um `motion.div` que anima `y → 0` e `opacity → 1`.
- Texto (`children` string) e mídia (JSX) seguem o **mesmo** caminho — só muda o `y` inicial.
- `RevealSequence` (opcional) só adiciona `índice × REVEAL_BLOCK_GAP` ao delay de cada filho. Não espera o bloco anterior terminar.
- `prefers-reduced-motion`: render estático, sem animação.

### `RevealSequence` — onde está aplicado

`/sobre` intro · `/contacto` (cabeçalho + CTA) · `/portfolio` intro · `/servicos` cabeçalho. A Home (sec. 2+) usa stagger manual nos grids.

---

## Diferenças Hero vs Reveal global

| | Hero Home | Reveal global |
|---|-----------|---------------|
| Doc | `HERO_HOME_ANIMACAO.md` | Este ficheiro |
| Componente | `HeroTitle` | `RevealOnScroll` |
| Granularidade | Letra a letra | Bloco uniforme (texto = mídia) |
| Gatilho | Load + re-view | Scroll into view |
| Estado | Estável — não mexer | Uniforme; calibrável por constantes |

---

## Conclusão

O reveal global é agora **uniforme e previsível**: cada bloco (texto ou imagem) sobe como uma peça só, sem linhas a «travar». Para afinar o ritmo, ajusta sobretudo `REVEAL_DURATION` no topo de `RevealOnScroll.tsx`.

A Hero da Home permanece **intocada** neste processo.
