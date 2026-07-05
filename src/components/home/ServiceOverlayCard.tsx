import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { Servico } from "@/data/servicos";

interface ServiceOverlayCardProps {
  servico: Servico;
  imageId: string;
}

/** Tipografia fluida (clamp em rem) — nunca pequena nem grande demais. */
const CARD_TITLE = "text-[clamp(1.25rem,2.4vw,1.9rem)] leading-[1.15]";
const CARD_TEXT = "text-[clamp(0.95rem,1.35vw,1.2rem)] leading-relaxed";
const CARD_PADDING = "p-[clamp(1.25rem,2.6vw,2rem)]";

export function ServiceOverlayCard({ servico, imageId }: ServiceOverlayCardProps) {
  const overlay = servico.homeOverlay;
  const fallbackText = servico.funcionalidades[0];

  return (
    <Link
      href={`/servicos/${servico.slug}`}
      className="group relative block aspect-[7/5] overflow-hidden rounded-2xl ring-1 ring-white/5 transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/30"
    >
      {/* Imagem — leve zoom no hover, sem desfoque/dessaturação agressivos */}
      <div className="absolute inset-0 transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]">
        <PlaceholderMedia
          id={imageId}
          descricao={servico.nome}
          cor={servico.corPlaceholder}
          fill
          sizes="(max-width: 640px) 100vw, 45vw"
          reveal={false}
        />
      </div>

      {/* Gradiente base — legibilidade do título em repouso */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-0"
      />

      {/* Overlay de hover — escurece mas mantém a imagem visível */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/55"
      />

      <div className={`absolute inset-0 flex flex-col text-left ${CARD_PADDING}`}>
        <h3 className={`shrink-0 font-bold tracking-tight text-white ${CARD_TITLE}`}>
          {servico.nome}
        </h3>

        {overlay ? (
          <div className="mt-[5%] flex min-h-0 flex-1 flex-col gap-[5%] opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
            <p className={`min-h-0 flex-1 overflow-y-auto text-white/85 ${CARD_TEXT}`}>
              {overlay.body}
            </p>
            <p className={`inline-flex shrink-0 items-center gap-2 font-semibold text-white ${CARD_TEXT}`}>
              {overlay.cta}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </p>
          </div>
        ) : (
          fallbackText && (
            <p
              className={`mt-[5%] max-w-xs text-white/85 opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0 ${CARD_TEXT}`}
            >
              {fallbackText}
            </p>
          )
        )}
      </div>
    </Link>
  );
}
