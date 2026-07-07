# Animação da Hero da Home — GMT

Documentação **separada** do reveal global. Este efeito pertence **exclusivamente** à primeira secção da Home (`/`).

**Estado:** Jul 2026 — Preloader (GSAP intro) + scroll (GSAP ScrollTrigger). Sem imagem de fundo.

---

## O que é

1. **Preloader** — overlay de introdução (1× por sessão): letras «GMT» + subtítulo com animação geométrica GSAP.
2. **HeroTitle** — estado de repouso visível após o preloader; animação de **scroll** (deslize horizontal + barra «Apresentamos»).

Não usa `RevealOnScroll`. Não usa `HER-01` nem `PlaceholderMedia` na hero activa.

---

## Onde está implementado

| Ficheiro | Papel |
|----------|--------|
| `src/components/hero/Preloader.tsx` | Intro GSAP (overlay, 1× sessão, `sessionStorage`) |
| `src/components/hero/HeroTitle.tsx` | Título em repouso + animação de scroll (GSAP ScrollTrigger) |
| `src/components/hero/HeroSection.tsx` | Wrapper fullscreen preto (`hero-fullscreen` = `100dvh`) + barra `#hero-bar` |
| `src/app/(site)/page.tsx` | Monta `<Preloader />` + `<HeroSection />` |
| `src/hooks/useReducedMotion.ts` | Preloader/HeroTitle respeitam `prefers-reduced-motion` |
| `src/styles/globals.css` | `.gmt-brand--hero`, `.type-hero-subtitle`, `.hero-bar` |

> `src/components/ui/HeroSlider.tsx` (HER-01) existe mas está **órfão** — não é usado na Home activa.

---

## Lógica visual

### Preloader (on-load, 1× sessão)

- Overlay cobre a hero na mesma posição do título final.
- Animação GSAP: letras voam para posição + impacto «GMT».
- `sessionStorage` key `gmt:preloaded` — não repete na mesma sessão.
- Em `prefers-reduced-motion`: salta directamente para estado final.

### Scroll (HeroTitle)

- `ScrollTrigger` na `#hero`: `scrub: true`, `start: "top top"`, `end: "bottom top"`.
- «GMT» desliza `xPercent: 38`; subtítulo `xPercent: -38`.
- Barra `#hero-bar`: opacity `0→1` no início do scroll; fundo branco; texto preto.
- Barra oculta por defeito em reduced-motion.

### Reduced motion

Render estático: `<h1>` + `<p>` sem animação de scroll; preloader ignorado se já visto ou reduced-motion.

---

## Parâmetros principais

| Parâmetro | Ficheiro | Valor / nota |
|-----------|----------|--------------|
| Deslize scroll `xPercent` | `HeroTitle.tsx` | `±38` |
| Session key | `Preloader.tsx` | `gmt:preloaded` |
| Altura hero | `HeroSection.tsx` | `100dvh` (`.hero-fullscreen`) |

---

## Diferença face ao reveal global

| | Hero Home | Reveal global |
|---|-----------|---------------|
| Componentes | `Preloader` + `HeroTitle` (GSAP) | `RevealOnScroll` (Framer Motion) |
| Gatilho | on-load (intro) + scroll (scrub) | on-scroll (`whileInView`) |
| Texto | Intro letra-a-letra (preloader); scroll = bloco | Bloco único `y` + `opacity` |
| Onde | Só secção 1 da Home | Secção 2+ da Home + restantes páginas |

Ver `docs/reveal-global.md` para o sistema do resto do site.

---

## Checklist de manutenção

- [ ] Alterações na hero **não** devem tocar em `RevealOnScroll.tsx`
- [ ] Hero **sem** `PlaceholderMedia` / HER-01 no caminho activo
- [ ] Testar preloader na 1ª visita e skip na 2ª (mesma sessão)
- [ ] Testar scroll: deslize + barra «Apresentamos»
- [ ] Testar com `prefers-reduced-motion: reduce`
