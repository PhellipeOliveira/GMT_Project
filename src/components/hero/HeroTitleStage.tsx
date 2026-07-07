import type { CSSProperties, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

/**
 * Bloco visual partilhado entre HeroTitle (estado final) e Preloader (cópia
 * animada). Uma única geometria: flex-col + gap-6, GMT com slot de layout +
 * wrapper interno para scale, subtítulo com as mesmas classes tipográficas.
 */
export function HeroTitleStage({
  ariaLabel = "GMT – Growth Marketing Technology",
  gmtAnimClassName,
  gmtAnimStyle,
  subtitleClassName,
  subtitleContent,
  brandRef,
  subtitleRef,
}: {
  ariaLabel?: string;
  /** Classe do wrapper interno animado pelo GSAP (ex.: pl-gmt-wrap). */
  gmtAnimClassName?: string;
  gmtAnimStyle?: CSSProperties;
  subtitleClassName?: string;
  subtitleContent: ReactNode;
  brandRef?: Ref<HTMLHeadingElement>;
  subtitleRef?: Ref<HTMLParagraphElement>;
}) {
  return (
    <div
      className="hero-title-stage flex flex-col items-center gap-6"
      aria-label={ariaLabel}
    >
      {/* Slot de layout: participa do flex; o GSAP anima só o filho interno. */}
      <div className="hero-gmt-slot">
        <div
          className={cn("hero-gmt-anim inline-block", gmtAnimClassName)}
          style={{ transformOrigin: "center center", ...gmtAnimStyle }}
        >
          <h1
            ref={brandRef}
            className="hero-line gmt-brand gmt-brand--hero text-center text-white"
          >
            GMT
          </h1>
        </div>
      </div>

      <p
        ref={subtitleRef}
        className={cn(
          "hero-line type-hero-subtitle select-none text-center text-white",
          subtitleClassName,
        )}
      >
        {subtitleContent}
      </p>
    </div>
  );
}

/**
 * Subtítulo letra-a-letra com ghost text em grid: o texto invisível reserva
 * exactamente a mesma caixa que o <p> com texto contínuo da Hero real
 * (letter-spacing, line-height, nowrap). As letras animadas sobrepõem-se na
 * mesma célula — sem mudar a geometria do bloco.
 */
export function HeroSubtitleChars({
  text,
  chars,
  charClassName,
  charStyle,
}: {
  text: string;
  chars: Array<{ ch: string; key: string }>;
  charClassName?: string;
  charStyle?: CSSProperties;
}) {
  return (
    <span className="grid justify-items-center">
      <span className="invisible col-start-1 row-start-1" aria-hidden>
        {text}
      </span>
      <span className="col-start-1 row-start-1 pl-sub-chars">
        {chars.map(({ ch, key }) => (
          <span
            key={key}
            className={cn("inline-block text-white", charClassName)}
            style={charStyle}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}
