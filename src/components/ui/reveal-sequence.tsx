"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  REVEAL_BLOCK_GAP,
  REVEAL_DURATION,
  REVEAL_LINE_GAP,
} from "@/components/ui/RevealOnScroll";

export function blockRevealDuration(lineCount: number): number {
  if (lineCount <= 0) return 0;
  return (
    lineCount * REVEAL_DURATION + Math.max(0, lineCount - 1) * REVEAL_LINE_GAP
  );
}

interface RevealSequenceContextValue {
  register: (id: string) => number;
  reportLines: (index: number, lineCount: number) => void;
  getDelay: (index: number) => number;
}

const RevealSequenceContext = createContext<RevealSequenceContextValue | null>(
  null,
);

export function useRevealSequence() {
  return useContext(RevealSequenceContext);
}

/**
 * Encadeia reveals de texto/mídia na ordem do DOM.
 * Cada filho só começa depois do bloco anterior terminar (com base nas linhas medidas).
 */
export function RevealSequence({ children }: { children: ReactNode }) {
  const indexByIdRef = useRef(new Map<string, number>());
  const lineCountsRef = useRef<number[]>([]);
  const nextIndexRef = useRef(0);
  const [version, setVersion] = useState(0);

  const register = useCallback((id: string) => {
    const existing = indexByIdRef.current.get(id);
    if (existing !== undefined) return existing;

    const index = nextIndexRef.current;
    nextIndexRef.current += 1;
    indexByIdRef.current.set(id, index);
    return index;
  }, []);

  const reportLines = useCallback((index: number, lineCount: number) => {
    if (lineCountsRef.current[index] === lineCount) return;
    lineCountsRef.current[index] = lineCount;
    setVersion((v) => v + 1);
  }, []);

  const getDelay = useCallback(
    (index: number) => {
      let delay = 0;
      for (let i = 0; i < index; i++) {
        const lines = lineCountsRef.current[i] ?? 1;
        delay += blockRevealDuration(lines) + REVEAL_BLOCK_GAP;
      }
      return delay;
    },
    [version],
  );

  const value = useMemo(
    () => ({ register, reportLines, getDelay }),
    [register, reportLines, getDelay],
  );

  return (
    <RevealSequenceContext.Provider value={value}>
      {children}
    </RevealSequenceContext.Provider>
  );
}
