"use client";

import { usePathname } from "next/navigation";
import { GMTLightFooter } from "@/components/ui/GMTLightFooter";

/** Lanterna GMT — renderizada apenas na Home, após o Footer global. */
export function HomeLanternSection() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <GMTLightFooter />;
}
