"use client";

import Image from "next/image";
import { useState } from "react";
import type { CSSProperties } from "react";
import { getMediaSrc, hasMediaAsset } from "@/lib/media";

interface PlaceholderMediaProps {
  /** ex: "HER-01" */
  id: string;
  /** ex: "hero slider · 16:9" */
  descricao: string;
  /** ex: "16/9" → CSS aspect-ratio */
  proporcao?: string;
  /** hex da família visual — fallback quando o asset não existe */
  cor: string;
  /** opcional — ex: "80vh" quando não é aspect-ratio */
  altura?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function PlaceholderMedia({
  id,
  descricao,
  proporcao,
  cor,
  altura,
  className = "",
  priority = false,
  sizes = "100vw",
}: PlaceholderMediaProps) {
  const [failed, setFailed] = useState(false);
  const hasAsset = hasMediaAsset(id) && !failed;

  const style: CSSProperties = { backgroundColor: cor };
  if (altura) {
    style.height = altura;
  } else if (proporcao) {
    style.aspectRatio = proporcao.replace("/", " / ");
  }

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
        className="object-cover transition-transform duration-[400ms]"
        style={{ transitionTimingFunction: "var(--ease)" }}
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
