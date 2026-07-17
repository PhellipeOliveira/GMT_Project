"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAgentConfig } from "@/hooks/useAgentConfig";
import { useChat } from "@/hooks/useChat";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSectionAgentHint } from "@/hooks/useSectionAgentHint";
import { cn } from "@/lib/utils";
import { getAgentLabelForPath } from "@/services/agentMessages";
import { ChatLauncher } from "@/components/agent/ChatLauncher";
import { ChatHeader } from "@/components/agent/ChatHeader";
import { ChatMessages } from "@/components/agent/ChatMessages";
import { ChatInput } from "@/components/agent/ChatInput";

export function ChatWidget() {
  const { enabled, loaded } = useAgentConfig();
  const { messages, sendMessage, markSlotPickerHandled, isLoading } = useChat();
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const sectionHint = useSectionAgentHint();
  // A seção visível (scroll) tem prioridade; a rota é o fallback.
  const contextualLabel = sectionHint ?? getAgentLabelForPath(pathname);

  if (!loaded || !enabled) {
    return null;
  }

  const panelTransition = reduced
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

  const handleSlotSelect = (opt: { label: string }, messageId?: string) => {
    if (messageId) {
      markSlotPickerHandled(messageId);
    }
    void sendMessage(opt.label);
  };

  const openCalPopup = (url?: string) => {
    const calUrl = url || "https://cal.com/phellipe-oliveira-ncbgsl/30min";
    window.open(calUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="chat-widget-shell pointer-events-none fixed bottom-5 right-5 z-[70]">
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
              label={contextualLabel}
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
            className={cn(
              "chat-widget-panel pointer-events-auto box-border flex min-w-0 flex-col border border-gmt-border bg-gmt-bg shadow-2xl",
              // Mobile: fullscreen amigável para teclado e iOS Safari.
              "fixed inset-0 h-[100dvh] w-screen max-w-[100vw] rounded-none",
              // Desktop: painel no canto inferior direito.
              "sm:relative sm:inset-auto sm:h-[480px] sm:w-[360px] sm:max-h-[70vh] sm:rounded-2xl",
              expanded &&
                "chat-widget-panel--expanded sm:h-[min(86vh,760px)] sm:w-[min(92vw,960px)] sm:max-h-[86vh] sm:max-w-[92vw]",
            )}
          >
            <ChatHeader
              onClose={() => {
                setOpen(false);
                setExpanded(false);
              }}
              onToggleExpand={() => setExpanded((prev) => !prev)}
              expanded={expanded}
            />
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              handleSlotSelect={handleSlotSelect}
              openCalPopup={openCalPopup}
            />
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
