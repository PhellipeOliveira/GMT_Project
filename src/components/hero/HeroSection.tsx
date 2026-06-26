import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroTitle } from "./HeroTitle";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="not-prose relative flex h-screen w-full items-center justify-center overflow-hidden bg-black [--gmt-text:#ffffff]"
    >
      <HeroTitle />

      {/* CTA preso à Hero — desaparece quando a seção sair do viewport */}
      <Link
        href="/contacto"
        className="group absolute bottom-10 right-6 flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-medium tracking-wide text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:text-white md:bottom-[4vw] md:right-[4vw]"
      >
        Agendar reunião
        <ArrowRight
          size={14}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </Link>
    </section>
  );
}
