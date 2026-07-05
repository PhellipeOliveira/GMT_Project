import Link from "next/link";
import { agentes, pacotes } from "@/data/servicos";

const linkClass =
  "type-body text-white transition-colors hover:text-white/75";

export function Footer() {
  return (
    <footer className="section-footer relative w-full overflow-hidden bg-black">
      <div className="relative z-10 mx-auto px-5 py-[3.2rem] md:px-[5vw]">
        <p className="type-label mb-10 text-center text-white md:mb-12">
          Growth Marketing Technology
        </p>

        <div className="grid grid-cols-1 gap-[2.4rem] md:grid-cols-3">
          <div>
            <h3 className="type-label mb-4 text-white">Automação &amp; IA</h3>
            <ul className="flex flex-col gap-2">
              {agentes.map((a) => (
                <li key={a.slug}>
                  <Link href={`/servicos/${a.slug}`} className={linkClass}>
                    {a.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="type-label mb-4 text-white">Marketing Digital</h3>
            <ul className="flex flex-col gap-2">
              {pacotes.map((p) => (
                <li key={p.slug}>
                  <Link href={`/servicos/${p.slug}`} className={linkClass}>
                    {p.nome}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/servicos" className={linkClass}>
                  Todos os serviços
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="type-label mb-4 text-white">Empresa</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/sobre" className={linkClass}>
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className={linkClass}>
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contacto" className={linkClass}>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-[2.4rem] border-t border-white/15 pt-[1.6rem]">
          <p className="type-label text-center text-white normal-case tracking-normal md:text-left">
            © 2026 Growth Marketing Technology · Lisboa, Portugal
          </p>
        </div>
      </div>
    </footer>
  );
}
