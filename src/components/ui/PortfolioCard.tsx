import Link from "next/link";
import { PlaceholderMedia } from "./PlaceholderMedia";
import { RevealItem } from "./RevealItem";

interface PortfolioCardProps {
  placeholderId: string;
  nome: string;
  cor: string;
  slug?: string;
  local?: string;
  industria?: string;
  servicos?: string;
  tags?: string[];
  emBreve?: boolean;
  delay?: number;
}

export function PortfolioCard({
  placeholderId,
  nome,
  cor,
  slug,
  local,
  industria,
  servicos,
  tags,
  emBreve = false,
  delay = 0,
}: PortfolioCardProps) {
  const content = (
    <>
      <PlaceholderMedia
        id={placeholderId}
        descricao={`card ${nome} · 3:4`}
        proporcao="3/4"
        cor={cor}
        className="rounded-lg"
      />
      <div className="mt-5">
        <h3 className="type-h3">{nome}</h3>

        {(local || industria || servicos) && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {local && <h4 className="type-body text-gmt-muted">{local}</h4>}
            {industria && (
              <h4 className="type-body text-gmt-muted">{industria}</h4>
            )}
            {servicos && (
              <h4 className="type-body text-gmt-muted">{servicos}</h4>
            )}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="type-label rounded-full border border-gmt-border px-3 py-1 text-gmt-muted normal-case tracking-normal"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (emBreve || !slug) {
    return (
      <RevealItem easing="portfolio" delay={delay} className="overflow-visible">
        <div className="block opacity-60">
          {content}
          <p className="type-label mt-2 text-gmt-muted">Em breve</p>
        </div>
      </RevealItem>
    );
  }

  return (
    <RevealItem easing="portfolio" delay={delay} className="overflow-visible">
      <Link href={`/portfolio/${slug}`} className="group block hover:opacity-90">
        {content}
      </Link>
    </RevealItem>
  );
}
