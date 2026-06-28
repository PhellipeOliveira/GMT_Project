import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { Servico } from "@/data/servicos";

interface ServiceOverlayCardProps {
  servico: Servico;
  imageId: string;
}

export function ServiceOverlayCard({ servico, imageId }: ServiceOverlayCardProps) {
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
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/15"
      />

      <div className="absolute top-0 left-0 p-5 text-left md:p-6">
        <h3 className="type-body font-medium text-white">{servico.nome}</h3>
        <p className="type-body mt-2 max-w-xs text-white/90 opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          {servico.funcionalidades[0]}
        </p>
      </div>
    </Link>
  );
}
