"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { REVEAL_BLOCK_GAP } from "@/components/ui/RevealOnScroll";

interface RevealSequenceContextValue {
  register: (id: string) => number;
  getDelay: (index: number) => number;
}

const RevealSequenceContext = createContext<RevealSequenceContextValue | null>(
  null,
);

export function useRevealSequence() {
  return useContext(RevealSequenceContext);
}

/**
 * Encadeia reveals de texto/mídia na ordem do DOM com um stagger uniforme.
 * Cada bloco sobe como uma peça única (igual às imagens); o único atraso entre
 * irmãos é `REVEAL_BLOCK_GAP × índice` (0 = todos sobem em simultâneo).
 */
export function RevealSequence({ children }: { children: ReactNode }) {
  const indexByIdRef = useRef(new Map<string, number>());
  const nextIndexRef = useRef(0);

  const register = useCallback((id: string) => {
    const existing = indexByIdRef.current.get(id);
    if (existing !== undefined) return existing;

    const index = nextIndexRef.current;
    nextIndexRef.current += 1;
    indexByIdRef.current.set(id, index);
    return index;
  }, []);

  const getDelay = useCallback((index: number) => index * REVEAL_BLOCK_GAP, []);

  const value = useMemo(
    () => ({ register, getDelay }),
    [register, getDelay],
  );

  return (
    <RevealSequenceContext.Provider value={value}>
      {children}
    </RevealSequenceContext.Provider>
  );
}
