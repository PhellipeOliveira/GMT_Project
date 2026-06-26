"use client";

import { HeroTitle } from "./HeroTitle";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gmt-bg"
    >
      <HeroTitle />
    </section>
  );
}
