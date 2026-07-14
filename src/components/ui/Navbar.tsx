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

  /** Vidro escuro quando há scroll ou o fundo por baixo é claro (igual ao logo). */
  const showGlass = scrolled || !overDark;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="relative flex h-16 items-center px-5 md:h-20 md:px-[3vw]">

        {/* ── Logo GMT — esquerda ───────────────────────────────────── */}
        <div className="pointer-events-auto z-10">
          <Link href="/" onClick={() => setOpen(false)} aria-label="GMT — início">
            <div className="relative rounded-full">
              <div
                className={cn(
                  "absolute inset-0 rounded-full bg-black/55 backdrop-blur-md transition-opacity duration-500",
                  showGlass ? "opacity-100" : "opacity-0",
                )}
                aria-hidden
              />
              <div className="relative px-4 py-2 sm:px-5 sm:py-2.5">
                <GmtLogo tone="on-dark" />
              </div>
            </div>
          </Link>
        </div>

        {/* ── Pill de navegação — centrado, tablet/desktop ─────────── */}
        <div className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex">
          <nav className="pointer-events-auto relative rounded-full">
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-black/55 backdrop-blur-md transition-opacity duration-500",
                showGlass ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            />
            <div className="relative flex items-center gap-5 px-4 py-2 sm:gap-6 sm:px-5 sm:py-2.5 lg:gap-7 lg:px-7">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="type-label text-white/70 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* ── Hamburger mobile ──────────────────────────────────────── */}
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto relative ml-auto rounded-full md:hidden"
        >
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-black/55 backdrop-blur-md transition-opacity duration-500",
              showGlass ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          />
          <span className="relative flex h-10 w-10 items-center justify-center text-white transition-colors duration-300">
            {open ? <X size={20} /> : <Menu size={20} />}
          </span>
        </button>
      </div>

      {/* ── Menu mobile ────────────────────────────────────────────── */}
      {open && (
        <div
          className={cn(
            "pointer-events-auto border-t px-5 py-6 backdrop-blur-xl md:hidden",
            overDark
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
                    overDark
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
