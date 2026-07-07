import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { HeroTitle } from "./HeroTitle";

/** 80% da altura de um 16:9 full-bleed (56.25vw × 0.8 = 45vw). */
const HERO_HEIGHT = "45vw";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="not-prose relative flex w-full items-center justify-center overflow-hidden bg-black [--gmt-text:#ffffff]"
      style={{ height: HERO_HEIGHT }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-full aspect-video overflow-hidden">
          <PlaceholderMedia
            id="HER-01"
            descricao="hero home · 16:9"
            cor="#000000"
            fill
            priority
            sizes="80vw"
            reveal={false}
          />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/40"
        aria-hidden
      />
      <div className="relative z-10">
        <HeroTitle />
      </div>

      {/* Barra de scroll — animada por HeroTitle (surge + alterna cor no scroll).
          Escondida por defeito (.hero-bar { opacity: 0 }); permanece oculta em
          prefers-reduced-motion. Absolute bottom-0 → não empurra o layout. */}
      <div id="hero-bar" className="hero-bar z-20" aria-hidden>
        <span id="hero-bar-text" className="hero-bar__text type-label">
          Apresentamos
        </span>
      </div>
    </section>
  );
}
