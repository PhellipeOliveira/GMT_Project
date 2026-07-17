"use client";

import Image from "next/image";
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
        "pointer-events-auto flex items-center gap-2.5 rounded-full border border-gmt-border bg-gmt-bg/95 px-2.5 py-2 shadow-lg backdrop-blur-md transition-shadow sm:px-4 sm:py-3",
        hovered && "shadow-xl",
      )}
    >
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 sm:h-11 sm:w-11">
        <Image
          src="/images/santiago-avatar.png"
          alt="Santiago"
          fill
          sizes="44px"
          className="object-cover"
          priority
        />
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
