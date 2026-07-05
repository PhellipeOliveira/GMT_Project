# Animação da Hero da Home — GMT

Documentação **separada** do reveal global. Este efeito pertence **exclusivamente** à primeira secção da Home (`/`).  
**Estado:** aprovado / estável — **não alterar** sem pedido explícito.

---

## O que é

Animação **letra a letra** do título «GMT» e do subtítulo «Growth Marketing Technology», com efeito de **blink** quando o utilizador regressa ao topo da página após scroll.

Não usa `RevealOnScroll`. É um sistema Framer Motion próprio.

---

## Onde está implementado

| Ficheiro | Papel |
|----------|--------|
| `src/components/hero/HeroTitle.tsx` | Lógica de animação (variantes, stagger, blink) |
| `src/components/hero/HeroSection.tsx` | Wrapper da secção hero (altura, fundo, mídia) |
| `src/app/page.tsx` | Monta `<HeroSection />` como secção 1 |
| `src/hooks/useReducedMotion.ts` | Desliga animação se `prefers-reduced-motion` |
| `src/styles/globals.css` | Classes `.gmt-brand--hero`, `.type-hero-subtitle` |

---

## Lógica visual

### Revelação inicial (on-load)

1. Montagem do componente → delay **80 ms** → `revealControls.start("visible")`.
2. **Linha 1 — «GMT»**
   - Container: `delayChildren: 0.1`, `staggerChildren: 0.1`
   - Cada letra: `opacity 0→1`, `y 10→0`, `blur(4px)→0`, duração **0.28 s**
3. **Linha 2 — «Growth Marketing Technology»**
   - Container: `delayChildren: 0.55`, `staggerChildren: 0.055`
   - Mesma animação por letra

### Blink ao regressar (on-view)

- `useInView` com `once: false`, `amount: 0.1`
- Na **primeira** entrada no viewport: regista, **não** pisca
- Nas entradas seguintes (utilizador voltou ao topo): sequência de opacidade `[1, 0.06, 1, 0.06, 1, 0.06, 1]` em **0.8 s**

### Reduced motion

Render estático: `<h1>` + `<p>` sem `motion.*`.

---

## Parâmetros (só desta hero)

Editar em `src/components/hero/HeroTitle.tsx`:

| Parâmetro | Valor actual | Efeito |
|-----------|--------------|--------|
| `charVariants.transition.duration` | `0.28` | Velocidade de cada letra |
| `line1Container.delayChildren` | `0.1` | Atraso antes da linha GMT |
| `line1Container.staggerChildren` | `0.1` | Intervalo entre letras GMT |
| `line2Container.delayChildren` | `0.55` | Atraso antes do subtítulo |
| `line2Container.staggerChildren` | `0.055` | Intervalo entre letras do subtítulo |
| `blink.transition.duration` | `0.8` | Duração do blink |
| Mount delay (`setTimeout`) | `80` ms | Espera pós-hidratação |

---

## Diferença face ao reveal global

| | Hero Home | Reveal global |
|---|-----------|---------------|
| Componente | `HeroTitle` | `RevealOnScroll` |
| Gatilho | on-load + re-entrada viewport | on-scroll (`whileInView`) |
| Texto | Letra a letra | Linha a linha (ou bloco) |
| Onde | Só secção 1 da Home | Secção 2+ da Home + restantes páginas |
| Estado | Estável — não mexer | A calibrar (lento hoje) |

Ver `docs/reveal-global.md` para o sistema do resto do site.

---

## Checklist de manutenção

- [ ] Alterações na hero **não** devem tocar em `RevealOnScroll.tsx`
- [ ] `PlaceholderMedia` na hero usa `reveal={false}` (sem reveal global)
- [ ] Testar blink ao scroll down → up na Home
- [ ] Testar com `prefers-reduced-motion: reduce`
