"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { RevealText } from "@/components/ui/RevealText";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SLIDE_INTERVAL = 7000;
const TRANSITION_MS = 1500;

/** Fundo visual único (HER-01) até existirem slides HER-SLD-02..05 em 16:9. */
const HERO_MEDIA_ID = "HER-01";

const SLIDES = [
  {
    label: "Automações · IA · Marketing Digital",
    title: "O seu negócio a trabalhar mesmo quando você não está.",
    description:
      "Agência especialista em automações, inteligência artificial e marketing digital para pequenas empresas.",
    cta: { href: "/servicos", label: "Conhecer os agentes" },
  },
  {
    label: "Ecossistema NARA",
    title: "Tecnologia que escala com o seu negócio.",
    description:
      "Do branding ao chatbot inteligente — criámos o ecossistema digital completo do NARA.",
    cta: { href: "/portfolio/nara", label: "Ver o case NARA" },
  },
  {
    label: "15 Agentes de IA",
    title: "Agentes inteligentes que trabalham 24h por dia.",
    description:
      "Reservas, follow-up, qualificação de leads e muito mais — automatizado e personalizado.",
    cta: { href: "/servicos", label: "Explorar agentes" },
  },
  {
    label: "Marketing Digital",
    title: "Presença digital profissional e eficaz.",
    description:
      "Conteúdo, publicidade e analytics num só parceiro — focado em resultados mensuráveis.",
    cta: { href: "/servicos", label: "Ver serviços" },
  },
  {
    label: "Lisboa, Portugal",
    title: "Parceria próxima para pequenas empresas.",
    description:
      "Soluções acessíveis e adaptadas à realidade local — com acompanhamento contínuo.",
    cta: { href: "/contacto", label: "Agendar reunião" },
  },
] as const;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [barKey, setBarKey] = useState(0);
  const [barFading, setBarFading] = useState(false);
  const transitioning = useRef(false);
  const reducedMotion = useReducedMotion();

  const slide = SLIDES[index];
  const prevSlide = prevIndex !== null ? SLIDES[prevIndex] : null;

  const goTo = useCallback(
    (next: number, direction: number) => {
      if (transitioning.current) return;
      transitioning.current = true;
      setDir(direction);
      setPrevIndex(index);
      setBarFading(true);

      setTimeout(() => {
        setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
        setBarKey((k) => k + 1);
        setBarFading(false);
      }, 200);

      setTimeout(() => {
        setPrevIndex(null);
        transitioning.current = false;
      }, TRANSITION_MS);
    },
    [index],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => goTo(index + 1, 1), SLIDE_INTERVAL);
    return () => clearTimeout(timer);
  }, [index, barKey, reducedMotion, goTo]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) goTo(index + 1, 1);
    else if (info.offset.x > 60) goTo(index - 1, -1);
  }

  const cssVars = { "--dir": dir } as CSSProperties;

  if (reducedMotion) {
    return (
      <section className="relative h-[80vh] w-full overflow-hidden">
        <PlaceholderMedia
          id={HERO_MEDIA_ID}
          descricao="hero slide · 16:9"
          cor="#1E293B"
          fill
          priority
          sizes="100vw"
        />
        <HeroContent slide={slide} />
      </section>
    );
  }

  return (
    <section
      className="relative h-[80vh] w-full overflow-hidden"
      style={cssVars}
    >
      <div className="absolute inset-0">
        {prevSlide && (
          <>
            <div className="hero-slide-out absolute inset-0 z-10 will-change-transform">
              <PlaceholderMedia
                id={HERO_MEDIA_ID}
                descricao="hero slide · 16:9"
                cor="#1E293B"
                fill
                sizes="100vw"
              />
            </div>
            <div className="hero-darken pointer-events-none absolute inset-0 z-20 bg-black" />
          </>
        )}

        <motion.div
          className="absolute inset-0 z-[5]"
          drag="x"
          dragElastic={0.15}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          <div
            className={`h-full ${prevSlide ? "hero-slide-in will-change-transform" : ""}`}
          >
            <PlaceholderMedia
              id={HERO_MEDIA_ID}
              descricao="hero slide · 16:9"
              cor="#1E293B"
              fill
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        </motion.div>
      </div>

      <HeroContent slide={slide} />

      <div className="absolute bottom-0 left-0 z-30 h-[2px] w-full bg-gmt-border">
        <div
          key={barKey}
          className={`h-full bg-gmt-accent ${barFading ? "hero-bar-fade-out" : "hero-fill"}`}
          style={{ "--bar-width": "100%" } as CSSProperties}
        />
      </div>
    </section>
  );
}

function HeroContent({ slide }: { slide: (typeof SLIDES)[number] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center bg-gradient-to-r from-gmt-bg/80 to-transparent">
      <div className="pointer-events-auto px-5 md:px-[5vw]">
        <p className="type-label text-gmt-muted">{slide.label}</p>
        <RevealText as="h1" className="type-hero type-hero--fullscreen mt-5 max-w-3xl">
          {slide.title}
        </RevealText>
        <RevealText as="p" className="type-body-lg mt-6 max-w-xl text-gmt-muted">
          {slide.description}
        </RevealText>
        <Link
          href={slide.cta.href}
          className="btn-nav mt-8"
        >
          {slide.cta.label}
        </Link>
      </div>
    </div>
  );
}
