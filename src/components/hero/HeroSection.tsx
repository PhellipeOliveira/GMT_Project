import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { HeroTitle } from "./HeroTitle";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="not-prose relative flex w-full aspect-video items-center justify-center overflow-hidden bg-black [--gmt-text:#ffffff]"
    >
      <PlaceholderMedia
        id="HER-01"
        descricao="hero home · 16:9"
        cor="#000000"
        fill
        priority
        sizes="100vw"
        reveal={false}
      />
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
