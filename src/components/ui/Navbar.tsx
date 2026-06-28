"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { GmtLogo } from "@/components/ui/GmtLogo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contacto", label: "Contacto" },
];

/** Rotas cujo hero inicial tem fundo escuro — navbar começa no modo dark. */
function isHeroPageDark(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/servicos/") && pathname !== "/servicos") return true;
  return false;
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  /**
   * pillDark: true  → hero escuro em ecrã → pill dark-glass, texto branco
   * pillDark: false → secção clara ou após scroll → pill light-glass, texto escuro
   */
  const pillDark = isHeroPageDark(pathname) && !scrolled;

  /**
   * Logo glass: visível sempre em páginas de fundo claro.
   * Na Home (hero escuro), só aparece após scroll (comportamento original).
   */
  const logoGlassVisible = scrolled || !isHeroPageDark(pathname);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="relative flex h-16 items-center px-5 md:h-20 md:px-[3vw]">

        {/* ── Logo GMT — esquerda, sempre branca ────────────────────── */}
        <div className="pointer-events-auto z-10">
          <Link href="/" onClick={() => setOpen(false)} aria-label="GMT — início">
            <div className="relative">
              {/* Container glass — sempre visível em páginas claras; aparece no scroll na Home */}
              <div
                className={cn(
                  "absolute inset-0 rounded-lg bg-black/55 backdrop-blur-md transition-opacity duration-500",
                  logoGlassVisible ? "opacity-100" : "opacity-0",
                )}
              />
              <div className="relative px-3 py-2">
                <GmtLogo tone="on-dark" variant="brand" />
              </div>
            </div>
          </Link>
        </div>

        {/* ── Pill de navegação — centrado, só desktop ───────────────── */}
        <div className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex">
          <nav
            className={cn(
              "pointer-events-auto flex items-center gap-7 rounded-full border px-7 py-2.5 backdrop-blur-md transition-all duration-500",
              pillDark
                ? "border-white/20 bg-black/30"
                : "border-black/8 bg-white/88 shadow-sm",
            )}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "type-label transition-colors duration-300",
                  pillDark
                    ? "text-white/70 hover:text-white"
                    : "text-gmt-muted hover:text-gmt-text",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Hamburger mobile — direita ─────────────────────────────── */}
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "pointer-events-auto ml-auto flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur-md transition-all duration-300 md:hidden",
            pillDark
              ? "bg-white/10 text-white"
              : "bg-black/8 text-gmt-text",
          )}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Menu mobile ────────────────────────────────────────────── */}
      {open && (
        <div className="pointer-events-auto border-t border-white/10 bg-black/90 px-5 py-6 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="type-body text-white/70 transition-colors hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contacto"
                className="type-label inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-white/80 transition-all hover:border-white/60 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Agendar reunião →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
