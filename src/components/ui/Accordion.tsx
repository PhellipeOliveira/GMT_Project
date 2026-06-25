"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { RevealItem } from "./RevealItem";

export interface AccordionItem {
  id: string;
  titulo: string;
  subtitulo?: string;
  href?: string;
  itens: string[];
  cor?: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="border-t border-gmt-border">
      {items.map((item, i) => {
        const isOpen = openId === item.id;
        return (
          <li key={item.id}>
            <RevealItem easing="services" delay={i * 0.05}>
              <div className="border-b border-gmt-border">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="flex items-center gap-4">
                {item.cor && (
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.cor }}
                  />
                )}
                <span className="type-body-lg text-gmt-text transition-colors group-hover:text-gmt-accent">
                  {item.titulo}
                </span>
                {item.subtitulo && (
                  <span className="type-body hidden text-gmt-muted lg:inline">
                    {item.subtitulo}
                  </span>
                )}
              </span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-gmt-muted transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="flex flex-col gap-2 pl-6">
                  {item.itens.map((s) => (
                    <li key={s} className="type-body text-gmt-muted">
                      {s}
                    </li>
                  ))}
                </ul>
                {item.href && (
                  <Link
                    href={item.href}
                    className="type-body mt-5 ml-6 inline-block text-gmt-accent transition-colors hover:text-gmt-accent-2"
                  >
                    Ver serviço →
                  </Link>
                )}
              </div>
            </div>
            </div>
            </RevealItem>
          </li>
        );
      })}
    </ul>
  );
}
