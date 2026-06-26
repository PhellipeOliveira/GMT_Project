"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { GmtLogo } from "@/components/ui/GmtLogo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contacto", label: "Contacto" },
];

function isLightNavRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/contacto") return true;
  if (pathname === "/servicos") return true;
  if (pathname === "/sobre" || pathname.startsWith("/sobre/")) return true;
  if (pathname === "/portfolio" || pathname.startsWith("/portfolio/")) return true;
  return false;
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const onLightBg = isLightNavRoute(pathname) && !scrolled;
  const logoTone = onLightBg || scrolled ? "on-light" : "on-dark";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 48);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,color,border-color] duration-[1000ms]",
        scrolled
          ? "border-gmt-border bg-gmt-bg/95 text-gmt-text backdrop-blur-md"
          : onLightBg
            ? "border-transparent bg-transparent text-[var(--gmt-text-on-light)]"
            : "border-transparent bg-transparent text-gmt-text",
      )}
      style={{ transitionTimingFunction: "var(--ease)" }}
    >
      <nav className="mx-auto flex h-12 items-center justify-between px-5 md:h-[3.35vw] md:px-[5vw]">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
          aria-label="GMT — início"
        >
          <GmtLogo tone={logoTone} />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "type-body transition-colors duration-[1000ms]",
                  scrolled || onLightBg
                    ? "text-gmt-muted hover:text-gmt-text"
                    : "text-white/80 hover:text-white",
                )}
                style={{ transitionTimingFunction: "var(--ease)" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/contacto"
            className={cn(
              "btn-nav group",
              (onLightBg || scrolled) && "btn-nav--on-light",
            )}
          >
            Agendar reunião
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className={cn(
            "flex h-12 w-12 flex-col items-center justify-center gap-1.25 rounded-lg backdrop-blur-xl transition-colors duration-300 md:hidden",
            onLightBg || scrolled
              ? "text-gmt-text"
              : "text-white",
          )}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div
          className={cn(
            "border-t px-5 py-6 md:hidden",
            scrolled || onLightBg
              ? "border-gmt-border bg-gmt-bg"
              : "border-gmt-border bg-black/90",
          )}
        >
          <ul className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "type-body transition-colors",
                    scrolled || onLightBg
                      ? "text-gmt-muted hover:text-gmt-text"
                      : "text-white/70 hover:text-white",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contacto"
                className={cn(
                  "btn-nav",
                  (onLightBg || scrolled) && "btn-nav--on-light",
                )}
                onClick={() => setOpen(false)}
              >
                Agendar reunião
                <ArrowRight size={16} />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
