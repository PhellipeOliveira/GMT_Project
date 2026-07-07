import { HeroTitle } from "./HeroTitle";

/**
 * Hero da Home — fullscreen preto liso.
 *
 * Sem imagem nem overlay de sombra: o único "visual" vem da geometria/animações
 * (preloader) e do deslize no scroll. Ocupa o ecrã inteiro (100dvh × 100vw)
 * em full-bleed (`.hero-fullscreen`), escapando ao padding do <main class="prose">.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      data-nav-tone="dark"
      className="hero-fullscreen not-prose relative flex items-center justify-center overflow-hidden bg-black [--gmt-text:#ffffff]"
    >
      <div className="relative z-10">
        <HeroTitle />
      </div>

      {/* Barra de scroll — animada por HeroTitle (fica branca logo no arranque do
          scroll; texto sempre oposto). Escondida por defeito (.hero-bar
          { opacity: 0 }) → permanece oculta em prefers-reduced-motion.
          Absolute bottom-0 → não empurra o layout. */}
      <div id="hero-bar" className="hero-bar z-20" aria-hidden>
        <span id="hero-bar-text" className="hero-bar__text type-label">
          Apresentamos
        </span>
      </div>
    </section>
  );
}
