"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getVideoSrc } from "@/lib/media";

const HERO_VIDEO_ID = "HER-01";

export function HeroBackgroundVideo() {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {});
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-center"
      autoPlay
      loop
      muted
      playsInline
      aria-hidden
      preload="auto"
    >
      <source src={getVideoSrc(HERO_VIDEO_ID)} type="video/mp4" />
    </video>
  );
}
