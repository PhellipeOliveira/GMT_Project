import { HeroTitle } from "./HeroTitle";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="not-prose relative flex h-screen w-full items-center justify-center overflow-hidden bg-black [--gmt-text:#ffffff]"
    >
      <HeroTitle />
    </section>
  );
}
