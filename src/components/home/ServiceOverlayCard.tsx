import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { Servico } from "@/data/servicos";

interface ServiceOverlayCardProps {
  servico: Servico;
  imageId: string;
}

export function ServiceOverlayCard({ servico, imageId }: ServiceOverlayCardProps) {
  const overlay = servico.homeOverlay;
  const fallbackText = servico.funcionalidades[0];

  return (
    <Link
      href={`/servicos/${servico.slug}`}
      className="group relative block aspect-[7/5] overflow-hidden rounded-2xl"
    >
      <div className="absolute inset-0 transition-[filter] duration-500 ease-out group-hover:blur-[4px] group-hover:saturate-[0.35]">
        <PlaceholderMedia
          id={imageId}
          descricao={servico.nome}
          cor={servico.corPlaceholder}
          fill
          sizes="(max-width: 640px) 100vw, 45vw"
          reveal={false}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/15 transition-opacity duration-300 group-hover:opacity-0"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="absolute inset-0 flex flex-col p-5 text-left md:p-6">
        <h3 className="shrink-0 text-[clamp(1.75rem,4.5vw,3.75rem)] font-medium leading-tight text-white">
          {servico.nome}
        </h3>

        {overlay ? (
          <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
            <p className="min-h-0 flex-1 overflow-y-auto text-[clamp(1.125rem,2.8vw,2.625rem)] leading-snug text-white/90">
              {overlay.body}
            </p>
            <p className="shrink-0 text-[clamp(1.125rem,2.8vw,2.625rem)] font-medium leading-snug text-white">
              {overlay.cta}
            </p>
          </div>
        ) : (
          fallbackText && (
            <p className="type-body mt-2 max-w-xs text-white/90 opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
              {fallbackText}
            </p>
          )
        )}
      </div>
    </Link>
  );
}
