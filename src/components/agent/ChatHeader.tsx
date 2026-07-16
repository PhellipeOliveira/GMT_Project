"use client";

import { Bot, X } from "lucide-react";

type ChatHeaderProps = {
  onClose: () => void;
};

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-gmt-border bg-gmt-bg px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gmt-accent/10 text-gmt-accent">
          <Bot size={18} strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-sm font-medium text-gmt-text">Santiago</p>
          <p className="text-xs text-gmt-muted">Online</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar chat"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gmt-muted transition-colors hover:bg-gmt-bg-alt hover:text-gmt-text"
      >
        <X size={18} />
      </button>
    </header>
  );
}
