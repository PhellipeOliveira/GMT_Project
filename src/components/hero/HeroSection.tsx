import { HeroBackgroundVideo } from "./HeroBackgroundVideo";
import { HeroTitle } from "./HeroTitle";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="not-prose relative flex h-[60vh] min-h-[22rem] w-full items-center justify-center overflow-hidden bg-black [--gmt-text:#ffffff] md:min-h-[28rem]"
    >
      <HeroBackgroundVideo />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/40"
        aria-hidden
      />
      <div className="relative z-10">
        <HeroTitle />
      </div>
    </section>
  );
}
