# Reveal global — resto do site (não inclui Hero da Home)

Documentação do efeito de entrada ao scroll usado **a partir da secção 2 da Home** e em **todas as outras páginas**.

> **Separado da Hero:** a animação letra-a-letra da secção 1 da Home está em `docs/HERO_HOME_ANIMACAO.md`.  
> Esse efeito está **aprovado e estável** — não faz parte deste sistema.

**Fonte de verdade:** `src/components/ui/RevealOnScroll.tsx` (Jul 2026).

---

## Estado actual

O reveal global está **funcional** mas percebido como **lento demais** — títulos principais demoram a aparecer. Este documento existe para **calibrar manualmente** os parâmetros até ao ponto óptimo.

---

## O que é

Padrão de animação ao scroll: conteúdo «nasce» de baixo para cima quando entra no viewport.

| Modo | Quando | Comportamento |
|------|--------|---------------|
| **Texto** (`children` string) | Títulos, parágrafos, labels | Linha a linha — só `translateY`, sem fade |
| **Mídia** (`variant="media"` ou JSX) | Cards, imagens, blocos | Bloco único — `translateY` + `opacity 0→1` |

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
| `src/lib/split-text-lines.ts` | Mede linhas visuais após wrap CSS |
| `src/components/ui/reveal-sequence.tsx` | Encadeia blocos irmãos (label → título → parágrafo) |
| `src/hooks/useReducedMotion.ts` | Desliga animação |

---

## Parâmetros que podes editar manualmente

**Ficheiro único para timing:** `src/components/ui/RevealOnScroll.tsx` (topo do ficheiro).

| Constante | Valor actual | O que faz | Afeta |
|-----------|--------------|-----------|--------|
| `REVEAL_DURATION` | `2.0` s | Duração de cada linha ou bloco | Texto, títulos, cards, imagens |
| `REVEAL_LINE_GAP` | `0` s | Pausa entre linhas **do mesmo** bloco | Texto multi-linha |
| `REVEAL_BLOCK_GAP` | `0` s | Pausa entre blocos em `RevealSequence` | Label → título → parágrafo |
| `REVEAL_TEXT_Y` | `28` px | Deslocamento inicial do texto | Títulos, parágrafos |
| `REVEAL_MEDIA_Y` | `20` px | Deslocamento inicial de mídia | Cards, thumbs, imagens |
| `REVEAL_EASE_OUT` | `[0.25, 1, 0.35, 1]` | Curva de desaceleração | Tudo |

### Viewport (gatilho)

```ts
{ once: true, margin: "-4% 0px" }
```

- `once: true` — anima uma vez
- `margin: "-4% 0px"` — dispara ligeiramente antes de entrar no ecrã

### Delay por linha (sem sequence)

```
delay_linha(i) = delay_prop + i × (REVEAL_DURATION + REVEAL_LINE_GAP)
```

Com 3 linhas: 0 s → 2.0 s → 4.0 s (explica títulos «demorados»).

### Stagger manual em grids

Fora de `RevealSequence`, muitas páginas usam `delay={i * 0.08}` ou `0.06` — atrasa o **início** de cada item, não espera o anterior terminar.

---

## Guia rápido de calibração

Para **acelerar** o site sem mexer na Hero:

1. **Baixar `REVEAL_DURATION`** — ex.: `2.0` → `1.4` ou `1.8` (impacto imediato em tudo)
2. **Baixar `REVEAL_LINE_GAP`** — ex.: `0.12` → `0.06` (cascata de linhas mais rápida)
3. **Baixar `REVEAL_BLOCK_GAP`** — ex.: `0.18` → `0.08` (cabecalhos com sequence)
4. **Reduzir `REVEAL_TEXT_Y` / `REVEAL_MEDIA_Y`** — menos deslocamento = sensação mais ágil
5. **Expandir `RevealSequence`** — menos blocos a entrar em paralelo

**Não editar** `src/components/hero/HeroTitle.tsx` ao calibrar o reveal global.

---

## Comportamento por tipo

### Texto puro (`children` string)

- Split em linhas visuais via `split-text-lines.ts`
- Cada linha: `y: REVEAL_TEXT_Y → 0` (sem opacity)
- Títulos largos em desktop = poucas linhas = cascata quase invisível

### Blocos JSX / mídia (`variant="media"`)

- Um bloco com `y` + `opacity`
- Usado em: cards, accordion rows, thumbs, `PlaceholderMedia` default

### `RevealSequence`

Encadeia filhos na ordem DOM. Usado em: `/sobre` intro, `/contacto`, `/portfolio` intro, `/servicos` cabeçalho.

A Home **não** usa sequence na secção 2 — cards entram com stagger paralelo.

---

## Diferenças Hero vs Reveal global

| | Hero Home | Reveal global |
|---|-----------|---------------|
| Doc | `HERO_HOME_ANIMACAO.md` | Este ficheiro |
| Componente | `HeroTitle` | `RevealOnScroll` |
| Granularidade | Letra a letra | Linha a linha / bloco |
| Gatilho | Load + re-view | Scroll into view |
| Estado | Estável | A calibrar |

---

## Conclusão

O reveal global **já funciona** — o problema actual é **timing**, não arquitectura. Ajusta as constantes no topo de `RevealOnScroll.tsx` e testa nas páginas com títulos longos (`/sobre`, `/servicos`, cards da Home).

A Hero da Home permanece **intocada** neste processo.
