"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const STEPS = [
  "Reunião inicial",
  "Proposta personalizada",
  "Planeamento estratégico",
  "Execução & implementação",
  "Acompanhamento & otimização",
] as const;

const SESSION_KEY = "gmt-como-funciona-timeline";
const LINE_MS = 520;
const TEXT_MS = 280;
const STEP_PAUSE_MS = 120;

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      window.clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort);
  });
}

async function runTimeline(
  signal: AbortSignal,
  onProgress: (value: number) => void,
  onStep: (index: number) => void,
) {
  for (let i = 0; i < STEPS.length; i++) {
    onProgress((i + 1) / STEPS.length);
    await wait(LINE_MS, signal);
    onStep(i);
    await wait(STEP_PAUSE_MS, signal);
  }
  sessionStorage.setItem(SESSION_KEY, "1");
}

function TimelineStep({
  label,
  filled,
  visible,
  layout,
}: {
  label: string;
  filled: boolean;
  visible: boolean;
  layout: "horizontal" | "vertical";
}) {
  const circle = (
    <span
      className={cn(
        "relative z-10 block shrink-0 rounded-full border transition-colors duration-200",
        "size-2.5 md:size-3",
        filled ? "border-black bg-black" : "border-neutral-300 bg-white",
      )}
      aria-hidden
    />
  );

  const text = (
    <span
      className={cn(
        "type-body text-balance text-gmt-text transition-all ease-out",
        layout === "horizontal" ? "mt-5 text-center" : "pt-0.5",
        visible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
      )}
      style={{ transitionDuration: `${TEXT_MS}ms` }}
    >
      {label}
    </span>
  );

  if (layout === "vertical") {
    return (
      <li className="grid grid-cols-[1.25rem_1fr] items-start gap-x-5 pb-14 last:pb-0">
        <div className="flex justify-center pt-1">{circle}</div>
        {text}
      </li>
    );
  }

  return (
    <li className="flex flex-col items-center px-1">
      {circle}
      {text}
    </li>
  );
}

export function ComoFuncionaTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const hasStarted = useRef(false);

  const [progress, setProgress] = useState(0);
  const [filled, setFilled] = useState(STEPS.map(() => false));
  const [visible, setVisible] = useState(STEPS.map(() => false));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let controller: AbortController | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted.current) return;
        hasStarted.current = true;
        observer.disconnect();

        const skipMotion =
          reducedMotion || sessionStorage.getItem(SESSION_KEY) === "1";

        if (skipMotion) {
          setProgress(1);
          setFilled(STEPS.map(() => true));
          setVisible(STEPS.map(() => true));
          return;
        }

        controller = new AbortController();

        runTimeline(
          controller.signal,
          setProgress,
          (index) => {
            setFilled((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
            setVisible((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
          },
        ).catch(() => {
          /* abort on unmount */
        });
      },
      { threshold: 0.2, rootMargin: "-8% 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      controller?.abort();
    };
  }, [reducedMotion]);

  const lineStyle = {
    transition: reducedMotion ? "none" : `transform ${LINE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  };

  return (
    <section
      ref={sectionRef}
      className="mt-14 md:mt-20"
      aria-label="Etapas do processo"
    >
      {/* Desktop — timeline horizontal */}
      <div className="relative hidden md:block">
        <div
          className="pointer-events-none absolute inset-x-0 top-1.5 h-px bg-neutral-200"
          aria-hidden
        >
          <div
            className="h-full origin-left bg-black"
            style={{ ...lineStyle, transform: `scaleX(${progress})` }}
          />
        </div>

        <ol className="relative grid grid-cols-5 gap-2 lg:gap-4">
          {STEPS.map((label, i) => (
            <TimelineStep
              key={label}
              label={label}
              filled={filled[i]}
              visible={visible[i]}
              layout="horizontal"
            />
          ))}
        </ol>
      </div>

      {/* Mobile — timeline vertical */}
      <div className="relative md:hidden">
        <div
          className="pointer-events-none absolute bottom-3 left-[0.3125rem] top-1 w-px bg-neutral-200"
          aria-hidden
        >
          <div
            className="h-full w-full origin-top bg-black"
            style={{ ...lineStyle, transform: `scaleY(${progress})` }}
          />
        </div>

        <ol className="relative">
          {STEPS.map((label, i) => (
            <TimelineStep
              key={label}
              label={label}
              filled={filled[i]}
              visible={visible[i]}
              layout="vertical"
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
