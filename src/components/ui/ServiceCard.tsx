import Link from "next/link";
import { PlaceholderMedia } from "./PlaceholderMedia";
import { RevealItem } from "./RevealItem";
import type { Servico } from "@/data/servicos";

interface ServiceCardProps {
  servico: Servico;
  placeholderId: string;
  delay?: number;
}

export function ServiceCard({ servico, placeholderId, delay = 0 }: ServiceCardProps) {
  return (
    <RevealItem easing="services" delay={delay} className="overflow-visible">
      <Link
        href={`/servicos/${servico.slug}`}
        className="group block overflow-hidden rounded-lg border border-gmt-border bg-gmt-bg hover:border-gmt-accent"
      >
      <PlaceholderMedia
        id={placeholderId}
        descricao={servico.nome}
        cor={servico.corPlaceholder}
      />
        <div className="p-5">
          <h3 className="type-body text-gmt-text">{servico.nome}</h3>
          {servico.headline && (
            <p className="type-body mt-2 text-gmt-muted">{servico.headline}</p>
          )}
        </div>
      </Link>
    </RevealItem>
  );
}
