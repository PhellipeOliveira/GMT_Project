import Link from "next/link";
import { PlaceholderMedia } from "./PlaceholderMedia";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

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
        descricao={`card ${nome}`}
        cor={cor}
        className="rounded-lg"
        reveal={false}
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
              <span key={tag} className="tag-pill">
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
      <RevealOnScroll variant="media" delay={delay}>
        <div className="block opacity-60">
          {content}
          <p className="type-label mt-2 text-gmt-muted">Em breve</p>
        </div>
      </RevealOnScroll>
    );
  }

  return (
    <RevealOnScroll variant="media" delay={delay}>
      <Link href={`/portfolio/${slug}`} className="group block hover:opacity-90">
        {content}
      </Link>
    </RevealOnScroll>
  );
}
