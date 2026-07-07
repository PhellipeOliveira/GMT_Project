"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface CounterItem {
  valor: number;
  label: string;
  wide?: boolean;
}

const COUNTERS: CounterItem[] = [
  { valor: 24, label: "serviços disponíveis", wide: true },
  { valor: 15, label: "agentes de IA prontos para trabalhar" },
  { valor: 3, label: "pacotes de marketing" },
];

function useCountUp(
  target: number,
  active: boolean,
  durationMs = 1800,
  startDelayMs = 0,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      // Reset intencional do contador quando sai de vista (comportamento mantido).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(0);
      return;
    }

    let raf = 0;
    const timeout = window.setTimeout(() => {
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        const eased = 1 - (1 - progress) ** 3;
        setValue(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    }, startDelayMs);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [active, target, durationMs, startDelayMs]);

  return value;
}

function CounterCard({ item, index }: { item: CounterItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const revealDelay = index * 0.1;
  const count = useCountUp(item.valor, inView, 1800, revealDelay * 1000);

  return (
    <div
      ref={ref}
      className={item.wide ? "col-span-2" : undefined}
    >
      <RevealOnScroll variant="media" delay={revealDelay}>
        <div
          className="flex min-h-[7.5rem] flex-col justify-end rounded-[1vw] border border-gmt-border bg-gmt-bg-alt p-5 md:min-h-[9rem] md:p-6"
        >
          <span className="font-mono text-5xl leading-none text-gmt-text md:text-[8vw] lg:text-6xl">
            {count}+
          </span>
          <span className="type-label mt-3 text-gmt-muted">{item.label}</span>
        </div>
      </RevealOnScroll>
    </div>
  );
}

export function AboutCounterGrid() {
  return (
    <div className="grid w-full grid-cols-2 gap-2 md:max-w-md">
      {COUNTERS.map((item, i) => (
        <CounterCard key={item.label} item={item} index={i} />
      ))}
    </div>
  );
}
