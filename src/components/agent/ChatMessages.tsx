"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageBubble } from "@/components/agent/MessageBubble";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ChatMessage } from "@/types/chat";

type ChatMessagesProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  handleSlotSelect: (opt: { value: string; label: string }, messageId?: string) => void;
  openCalPopup: (url?: string) => void;
};

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-gmt-border bg-gmt-bg-alt px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-gmt-muted"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatMessages({
  messages,
  isLoading,
  handleSlotSelect,
  openCalPopup,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [messages, isLoading, reducedMotion]);

  return (
    <div
      ref={scrollRef}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto overscroll-y-auto px-3 py-4"
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onSlotSelect={handleSlotSelect}
          openCalPopup={openCalPopup}
        />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
}
