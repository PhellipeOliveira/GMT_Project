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
  const [hoverId, setHoverId] = useState<string | null>(null);
  const focusId = hoverId ?? openId;

  return (
    <ul
      className="accordion-list"
      onMouseLeave={() => setHoverId(null)}
    >
      {items.map((item, i) => {
        const isOpen = openId === item.id;
        const isDimmed = Boolean(focusId && focusId !== item.id);

        return (
          <li
            key={item.id}
            className={`accordion-item ${isOpen ? "accordion-item--active" : ""} ${isDimmed ? "accordion-item--dimmed" : ""}`}
            onMouseEnter={() => setHoverId(item.id)}
          >
            <RevealItem easing="services" delay={i * 0.05}>
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
                  <span className="type-body-lg text-gmt-text transition-colors duration-300 group-hover:text-gmt-accent">
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
                className={`accordion-panel overflow-hidden ${
                  isOpen ? "accordion-panel--open" : "accordion-panel--closed"
                }`}
              >
                <div className="min-h-0">
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
            </RevealItem>
          </li>
        );
      })}
    </ul>
  );
}
