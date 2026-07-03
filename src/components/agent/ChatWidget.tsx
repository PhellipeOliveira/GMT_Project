"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAgentConfig } from "@/hooks/useAgentConfig";
import { useChat } from "@/hooks/useChat";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ChatLauncher } from "@/components/agent/ChatLauncher";
import { ChatHeader } from "@/components/agent/ChatHeader";
import { ChatMessages } from "@/components/agent/ChatMessages";
import { ChatInput } from "@/components/agent/ChatInput";

export function ChatWidget() {
  const { enabled, loaded } = useAgentConfig();
  const { messages, sendMessage, isLoading } = useChat();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (!loaded || !enabled) {
    return null;
  }

  const panelTransition = reduced
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70]">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="launcher"
            initial={reduced ? false : { opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.9, y: 12 }}
            transition={panelTransition}
          >
            <ChatLauncher
              onClick={() => setOpen(true)}
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              hovered={hovered}
            />
          </motion.div>
        ) : (
          <motion.div
            key="panel"
            initial={
              reduced
                ? false
                : { opacity: 0, scale: 0.92, y: 16, originX: 1, originY: 1 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduced
                ? undefined
                : { opacity: 0, scale: 0.92, y: 16, originX: 1, originY: 1 }
            }
            transition={panelTransition}
            style={{ transformOrigin: "bottom right" }}
            className="pointer-events-auto flex w-[calc(100vw-2rem)] max-w-[min(360px,25vw)] flex-col overflow-hidden rounded-2xl border border-gmt-border bg-gmt-bg shadow-2xl sm:h-[min(480px,60vh)] sm:w-[360px] sm:max-w-[min(360px,25vw)] h-[min(70vh,480px)] max-h-[480px]"
          >
            <ChatHeader onClose={() => setOpen(false)} />
            <ChatMessages messages={messages} isLoading={isLoading} />
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
