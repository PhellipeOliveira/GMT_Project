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
    <div className="pointer-events-auto relative flex items-end justify-end">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          initial={reduced ? false : { opacity: 0, x: 8, y: 4 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: 8, y: 4 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-[calc(100%+0.65rem)] bottom-2 hidden rounded-xl border border-gmt-border bg-gmt-bg/95 px-3 py-1.5 text-xs font-medium text-gmt-text shadow-lg backdrop-blur-md sm:inline-block"
        >
          {label}
        </motion.span>
      </AnimatePresence>

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
          "relative h-14 w-14 overflow-hidden rounded-full border-2 border-white bg-gmt-bg shadow-lg ring-1 ring-black/10 transition-shadow",
          hovered && "shadow-xl",
        )}
      >
        <Image
          src="/images/santiago-avatar.png"
          alt="Santiago"
          fill
          sizes="56px"
          className="object-cover"
          priority
        />
      </motion.button>
    </div>
  );
}
