"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useScroll, useMotionValueEvent } from "framer-motion";
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
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 48);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,color,border-color] duration-[1000ms]",
        scrolled
          ? "border-gmt-border bg-gmt-bg/95 text-gmt-text backdrop-blur-md"
          : "border-transparent bg-transparent text-gmt-text",
      )}
      style={{ transitionTimingFunction: "var(--ease)" }}
    >
      <nav className="mx-auto flex h-16 items-center justify-between px-5 md:px-[5vw]">
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
            className="h-7 w-auto"
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
                  scrolled ? "text-gmt-muted hover:text-gmt-text" : "text-gmt-text/80 hover:text-gmt-text",
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
            className="type-body type-medium rounded-full bg-gmt-accent px-5 py-2 text-white"
          >
            Agendar reunião
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="text-gmt-text md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gmt-border bg-gmt-bg px-5 py-6 md:hidden">
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
                className="type-body type-medium inline-block rounded-full bg-gmt-accent px-5 py-2 text-white"
                onClick={() => setOpen(false)}
              >
                Agendar reunião
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
