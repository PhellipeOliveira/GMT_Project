"use client";

import Image from "next/image";
import { Maximize2, Minimize2, X } from "lucide-react";

type ChatHeaderProps = {
  onClose: () => void;
  onToggleExpand: () => void;
  expanded: boolean;
};

export function ChatHeader({ onClose, onToggleExpand, expanded }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-gmt-border bg-gmt-bg px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-black/10">
          <Image
            src="/images/santiago-avatar.png"
            alt="Santiago"
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gmt-text">Santiago</p>
          <p className="text-xs text-gmt-muted">Online</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleExpand}
          aria-label={expanded ? "Voltar para tamanho normal" : "Expandir chat"}
          className="hidden h-8 w-8 items-center justify-center rounded-lg text-gmt-muted transition-colors hover:bg-gmt-bg-alt hover:text-gmt-text sm:flex"
        >
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar chat"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gmt-muted transition-colors hover:bg-gmt-bg-alt hover:text-gmt-text"
        >
          <X size={18} />
        </button>
      </div>
    </header>
  );
}
