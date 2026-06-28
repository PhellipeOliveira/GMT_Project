import { HeroTitle } from "./HeroTitle";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="not-prose relative flex h-[60vh] min-h-[22rem] w-full items-center justify-center overflow-hidden bg-black [--gmt-text:#ffffff] md:min-h-[28rem]"
    >
      <HeroTitle />
    </section>
  );
}
