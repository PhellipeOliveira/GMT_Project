"use client";

import Image from "next/image";
import { useState } from "react";
import type { CSSProperties } from "react";
import { getMediaContainerStyle, getMediaSlot } from "@/data/media-spec";
import { getMediaSrc, hasMediaAsset } from "@/lib/media";

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
    style.position = "absolute";
    style.inset = 0;
    style.width = "100%";
    style.height = "100%";
  } else if (altura) {
    style.height = altura;
  } else if (proporcao) {
    style.aspectRatio = proporcao.replace("/", " / ");
  }

  const objectFit = spec?.objectFit ?? "cover";

  if (!hasAsset) {
    return (
      <div
        role="img"
        aria-label={`Placeholder ${id}: ${descricao}`}
        className={`media-zoom relative flex w-full items-center justify-center overflow-hidden ${className}`}
        style={style}
      >
        <span className="select-none px-3 text-center font-mono text-xs text-white/40">
          {id} · {descricao}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`media-zoom relative w-full overflow-hidden ${className}`}
      style={style}
    >
      <Image
        src={getMediaSrc(id)}
        alt={`${id}: ${descricao}`}
        fill
        className={`${objectFit === "cover" ? "object-cover" : "object-contain"} transition-transform duration-[400ms]`}
        style={{ transitionTimingFunction: "var(--ease)" }}
        sizes={sizes}
        priority={priority}
        data-loaded={loaded}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
