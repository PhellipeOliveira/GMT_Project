"use client";

import Image from "next/image";
import { useState } from "react";
import type { CSSProperties } from "react";
import { getMediaContainerStyle, getMediaSlot } from "@/data/media-spec";
import { getMediaSrc, hasMediaAsset } from "@/lib/media";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

interface PlaceholderMediaProps {
  /** Proporção e container vêm de `src/data/media-spec.ts` quando o ID existe. */
  id: string;
  descricao: string;
  proporcao?: string;
  cor: string;
  altura?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Preenche o pai (`absolute inset-0` / `h-full`) sem aplicar ratio da spec. */
  fill?: boolean;
  /** Line-mask reveal on scroll (desactivar no Hero da Home). */
  reveal?: boolean;
}

export function PlaceholderMedia({
  id,
  descricao,
  proporcao: proporcaoOverride,
  cor,
  altura: alturaOverride,
  className = "",
  priority = false,
  sizes = "100vw",
  fill = false,
  reveal = true,
}: PlaceholderMediaProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const hasAsset = hasMediaAsset(id) && !failed;
  const spec = getMediaSlot(id);
  const fromSpec = getMediaContainerStyle(id);
  const proporcao = proporcaoOverride ?? fromSpec.proporcao;
  const altura = alturaOverride ?? fromSpec.altura;

  const style: CSSProperties = { backgroundColor: cor };
  if (fill) {
    style.width = "100%";
    style.height = "100%";
  } else if (altura) {
    style.height = altura;
  } else if (proporcao) {
    style.aspectRatio = proporcao.replace("/", " / ");
  }

  const objectFit = spec?.objectFit ?? "cover";
  const hasExplicitWidth = /\bw-/.test(className);

  const media = !hasAsset ? (
    <div
      role="img"
      aria-label={`Placeholder ${id}: ${descricao}`}
      className={cn(
        "media-zoom overflow-hidden",
        fill ? "relative size-full min-h-0" : "relative flex items-center justify-center",
        !fill && !hasExplicitWidth && "w-full",
        className,
      )}
      style={style}
    >
      <span className="type-label select-none px-3 text-center font-mono normal-case tracking-normal text-gmt-muted/60">
        {id} · {descricao}
      </span>
    </div>
  ) : (
    <div
      className={cn(
        "media-zoom overflow-hidden",
        fill ? "relative size-full min-h-0" : "relative",
        !fill && !hasExplicitWidth && "w-full",
        className,
      )}
      style={style}
    >
      <Image
        src={getMediaSrc(id)}
        alt={`${id}: ${descricao}`}
        fill
        className={`${objectFit === "cover" ? "object-cover object-center" : "object-contain"} transition-transform duration-[400ms]${fill ? " min-h-full min-w-full" : ""}`}
        style={{ transitionTimingFunction: "var(--ease)" }}
        sizes={sizes}
        priority={priority}
        data-loaded={loaded}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );

  if (!reveal) return media;

  return <RevealOnScroll variant="media">{media}</RevealOnScroll>;
}
