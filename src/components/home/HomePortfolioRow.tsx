import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface HomePortfolioRowProps {
  placeholderId: string;
  nome: string;
  cor: string;
  resumo?: string;
  slug?: string;
  emBreve?: boolean;
  delay?: number;
}

export function HomePortfolioRow({
  placeholderId,
  nome,
  cor,
  resumo,
  slug,
  emBreve = false,
  delay = 0,
}: HomePortfolioRowProps) {
  return (
    <RevealOnScroll variant="media" delay={delay}>
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="overflow-hidden rounded-lg">
          <PlaceholderMedia
            id={placeholderId}
            descricao={`projeto ${nome}`}
            cor={cor}
            reveal={false}
          />
        </div>

        <div className="flex flex-col items-start gap-5">
          <h3 className="type-h3">{nome}</h3>

          {emBreve ? (
            <p className="type-body text-gmt-muted">Em breve</p>
          ) : (
            <>
              {resumo && (
                <p className="type-body max-w-prose text-white">{resumo}</p>
              )}
              {slug && (
                <Link
                  href={`/portfolio/${slug}`}
                  className="type-label inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
                >
                  Ver Produto →
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </RevealOnScroll>
  );
}
