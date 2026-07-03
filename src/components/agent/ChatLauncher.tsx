"use client";

import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ChatLauncherProps = {
  onClick: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  hovered?: boolean;
};

export function ChatLauncher({
  onClick,
  onHoverStart,
  onHoverEnd,
  hovered = false,
}: ChatLauncherProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      aria-label="Abrir chat com o agente GMT"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "pointer-events-auto flex items-center gap-2.5 rounded-full border border-gmt-border bg-gmt-bg/95 px-4 py-3 shadow-lg backdrop-blur-md transition-shadow",
        hovered && "shadow-xl",
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gmt-accent text-white">
        <Bot size={18} strokeWidth={1.75} />
      </span>
      <span className="hidden text-sm font-medium text-gmt-text sm:inline">
        Olá, posso ajudar?
      </span>
    </motion.button>
  );
}
