"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { GmtLogo } from "@/components/ui/GmtLogo";
import { useNavTone } from "@/hooks/useNavTone";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overDark = useNavTone();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  /** Fundo escuro por baixo da navbar → pill/hamburger claros; caso contrário, escuros. */
  const pillDark = overDark;

  /** Logo glass: no topo do hero escuro fica só o texto branco; ao rolar ou em fundo claro, glass. */
  const logoGlassVisible = scrolled || !overDark;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="relative flex h-16 items-center px-5 md:h-20 md:px-[3vw]">

        {/* ── Logo GMT — esquerda ───────────────────────────────────── */}
        <div className="pointer-events-auto z-10">
          <Link href="/" onClick={() => setOpen(false)} aria-label="GMT — início">
            <div className="relative">
              <div
                className={cn(
                  "absolute inset-0 rounded-full bg-black/55 backdrop-blur-md transition-opacity duration-500",
                  logoGlassVisible ? "opacity-100" : "opacity-0",
                )}
              />
              <div className="relative px-5 py-2.5">
                <GmtLogo tone={overDark ? "on-dark" : "on-light"} />
              </div>
            </div>
          </Link>
        </div>

        {/* ── Pill de navegação — centrado, tablet/desktop ──────────── */}
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

        {/* ── Hamburger mobile ──────────────────────────────────────── */}
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "pointer-events-auto ml-auto flex h-10 w-10 items-center justify-center rounded-lg border backdrop-blur-md transition-all duration-300 md:hidden",
            pillDark
              ? "border-white/20 bg-white/10 text-white"
              : "border-black/8 bg-white/88 text-gmt-text shadow-sm",
          )}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Menu mobile ────────────────────────────────────────────── */}
      {open && (
        <div
          className={cn(
            "pointer-events-auto border-t px-5 py-6 backdrop-blur-xl md:hidden",
            pillDark
              ? "border-white/10 bg-black/90"
              : "border-black/10 bg-white/95",
          )}
        >
          <ul className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "type-body transition-colors",
                    pillDark
                      ? "text-white/70 hover:text-white"
                      : "text-gmt-muted hover:text-gmt-text",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
