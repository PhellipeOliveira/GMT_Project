"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PlaceholderMedia } from "./PlaceholderMedia";
import { RevealOnScroll } from "./RevealOnScroll";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  titulo: string;
  subtitulo?: string;
  href?: string;
  itens: string[];
  cor?: string;
  /** ID de mídia 3:2 (AG/MKT/AV) — thumb na linha do accordion. */
  mediaId?: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

/** 3:2 · largura fixa + aspect-ratio garante enquadramento exacto em flex. */
const LISTING_THUMB_FRAME =
  "relative w-14 aspect-[3/2] shrink-0 flex-none self-center overflow-hidden rounded-md md:w-20";

export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="accordion-list">
      {items.map((item, i) => {
        const isOpen = openId === item.id;

        return (
          <li key={item.id} className="accordion-item">
            <RevealOnScroll variant="media" delay={i * 0.08}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className={cn(
                  "group flex w-full items-center justify-between gap-4 rounded-lg px-4 py-5 text-left transition-colors duration-300",
                  isOpen ? "bg-black" : "hover:bg-black",
                )}
                style={{ transitionTimingFunction: "var(--ease)" }}
              >
                <span className="flex min-w-0 flex-1 items-center gap-4">
                  {item.mediaId ? (
                    <div className={LISTING_THUMB_FRAME}>
                      <PlaceholderMedia
                        id={item.mediaId}
                        descricao="3:2"
                        cor={item.cor ?? "#1E293B"}
                        fill
                        sizes="80px"
                        reveal={false}
                      />
                    </div>
                  ) : (
                    item.cor && (
                      <span
                        aria-hidden
                        className={cn(
                          "size-2.5 shrink-0 rounded-full transition-opacity duration-300",
                          isOpen ? "opacity-80" : "opacity-100 group-hover:opacity-80",
                        )}
                        style={{ backgroundColor: item.cor }}
                      />
                    )
                  )}
                  <span
                    className={cn(
                      "type-body-lg transition-colors duration-300",
                      isOpen
                        ? "text-white"
                        : "text-gmt-text group-hover:text-white",
                    )}
                  >
                    {item.titulo}
                  </span>
                  {item.subtitulo && (
                    <span
                      className={cn(
                        "type-body hidden truncate transition-colors duration-300 lg:inline",
                        isOpen
                          ? "text-white/70"
                          : "text-gmt-muted group-hover:text-white/70",
                      )}
                    >
                      {item.subtitulo}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={20}
                  className={cn(
                    "shrink-0 transition-[color,transform] duration-300",
                    isOpen
                      ? "rotate-180 text-white"
                      : "text-gmt-muted group-hover:text-white",
                  )}
                />
              </button>
            </RevealOnScroll>

              <div
                className={cn(
                  "accordion-panel overflow-hidden",
                  isOpen ? "accordion-panel--open" : "accordion-panel--closed",
                )}
              >
                <div className="min-h-0 px-4">
                  <ul className="flex flex-col gap-2 border-t border-gmt-border pt-4">
                    {item.itens.map((s) => (
                      <li key={s} className="type-body text-gmt-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                  {item.href && (
                    <Link
                      href={item.href}
                      className="type-body mt-5 inline-block text-gmt-accent transition-colors hover:text-gmt-accent-2"
                    >
                      Ver serviço →
                    </Link>
                  )}
                </div>
              </div>
          </li>
        );
      })}
    </ul>
  );
}
