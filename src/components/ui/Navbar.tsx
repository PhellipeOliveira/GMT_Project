"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contacto", label: "Contacto" },
];

const LIGHT_NAV_PREFIXES = ["/servicos", "/sobre"];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const isLightRoute = LIGHT_NAV_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const onLightBg = isLightRoute && !scrolled;

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
        >
          <Image
            src="/images/GL-01.webp"
            alt="GMT — Growth Marketing Technology"
            width={140}
            height={40}
            className={cn(
              "h-7 w-auto transition-opacity duration-300",
              onLightBg && !scrolled ? "brightness-0" : "",
            )}
            priority
          />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "type-body transition-colors duration-[1000ms]",
                  scrolled
                    ? "text-gmt-muted hover:text-gmt-text"
                    : onLightBg
                      ? "text-[var(--gmt-muted-on-light)] hover:text-[var(--gmt-text-on-light)]"
                      : "text-gmt-text/80 hover:text-gmt-text",
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
              onLightBg && !scrolled && "btn-nav--on-light",
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
            onLightBg && !scrolled
              ? "text-[var(--gmt-text-on-light)]"
              : "text-gmt-text",
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
            scrolled
              ? "border-gmt-border bg-gmt-bg"
              : onLightBg
                ? "border-[var(--gmt-border-light)] bg-[var(--gmt-bg-light)]"
                : "border-gmt-border bg-gmt-bg",
          )}
        >
          <ul className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="type-body text-gmt-muted hover:text-gmt-text"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contacto"
                className="btn-nav"
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
