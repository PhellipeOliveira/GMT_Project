import Link from "next/link";
import { agentes, pacotes } from "@/data/servicos";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { GmtLogo } from "@/components/ui/GmtLogo";

export function Footer() {
  return (
    <footer className="section-footer relative w-full overflow-hidden pt-[10vw]">
      <PlaceholderMedia
        id="GL-03"
        descricao="textura de secção · 16:9"
        cor="#101010"
        className="pointer-events-none absolute inset-0 opacity-15"
        sizes="100vw"
      />
      <div className="relative z-10 mx-auto px-5 py-16 md:px-[5vw]">
        <GmtLogo tone="on-dark" asLink className="mb-12" />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <h3 className="type-label mb-5 text-gmt-muted">
              Automação &amp; IA
            </h3>
            <ul className="flex flex-col gap-2">
              {agentes.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/servicos/${a.slug}`}
                    className="type-body text-gmt-muted transition-colors hover:text-gmt-text"
                  >
                    {a.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="type-label mb-5 text-gmt-muted">
              Marketing Digital
            </h3>
            <ul className="flex flex-col gap-2">
              {pacotes.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/servicos/${p.slug}`}
                    className="type-body text-gmt-muted transition-colors hover:text-gmt-text"
                  >
                    {p.nome}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/servicos"
                  className="type-body text-gmt-muted transition-colors hover:text-gmt-text"
                >
                  Todos os serviços
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="type-label mb-5 text-gmt-muted">Empresa</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/sobre"
                  className="type-body text-gmt-muted transition-colors hover:text-gmt-text"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="type-body text-gmt-muted transition-colors hover:text-gmt-text"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="type-body text-gmt-muted transition-colors hover:text-gmt-text"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gmt-border pt-8">
          <p className="type-label text-gmt-muted normal-case tracking-normal">
            © 2026 Growth Marketing Technology · Lisboa, Portugal
          </p>
        </div>
      </div>
    </footer>
  );
}
