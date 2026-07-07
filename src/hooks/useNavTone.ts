"use client";

import { useSyncExternalStore } from "react";

function getNavHeight(): number {
  if (typeof window === "undefined") return 64;
  return window.matchMedia("(min-width: 768px)").matches ? 80 : 64;
}

/** True quando alguma secção escura (`data-nav-tone="dark"`) está por baixo da navbar. */
function isOverDarkSection(): boolean {
  const navH = getNavHeight();
  const sections = document.querySelectorAll<HTMLElement>('[data-nav-tone="dark"]');

  for (const el of sections) {
    const rect = el.getBoundingClientRect();
    if (rect.top < navH && rect.bottom > 0) return true;
  }
  return false;
}

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();

  window.addEventListener("scroll", handler, { passive: true });
  window.addEventListener("resize", handler, { passive: true });
  window.visualViewport?.addEventListener("resize", handler);
  window.visualViewport?.addEventListener("scroll", handler);

  return () => {
    window.removeEventListener("scroll", handler);
    window.removeEventListener("resize", handler);
    window.visualViewport?.removeEventListener("resize", handler);
    window.visualViewport?.removeEventListener("scroll", handler);
  };
}

/**
 * Tom da navbar conforme o fundo real por baixo (não só scrollY > 60).
 * Funciona em mobile, tablet e desktop — inclui visualViewport (barra de URL).
 */
export function useNavTone(): boolean {
  return useSyncExternalStore(
    subscribe,
    isOverDarkSection,
    () => false,
  );
}
