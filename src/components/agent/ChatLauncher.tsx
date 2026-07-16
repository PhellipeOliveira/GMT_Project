"use client";

import { Bot } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DEFAULT_AGENT_LABEL } from "@/services/agentMessages";

type ChatLauncherProps = {
  onClick: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  hovered?: boolean;
  label?: string;
};

export function ChatLauncher({
  onClick,
  onHoverStart,
  onHoverEnd,
  hovered = false,
  label = DEFAULT_AGENT_LABEL,
}: ChatLauncherProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      aria-label="Abrir chat com o Santiago"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "pointer-events-auto flex items-center gap-2.5 rounded-full border border-gmt-border bg-gmt-bg/95 px-4 py-3 shadow-lg backdrop-blur-md transition-shadow",
        hovered && "shadow-xl",
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gmt-accent text-white">
        <Bot size={18} strokeWidth={1.75} />
      </span>
      <span className="hidden overflow-hidden text-sm font-medium text-gmt-text sm:inline">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={label}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block whitespace-nowrap"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
