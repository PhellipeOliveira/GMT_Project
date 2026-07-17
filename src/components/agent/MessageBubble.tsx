"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ChatMessage, SlotPickerOption } from "@/types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
  onSlotSelect: (opt: SlotPickerOption, messageId?: string) => void;
  openCalPopup: (url?: string) => void;
};

export function MessageBubble({
  message,
  onSlotSelect,
  openCalPopup,
}: MessageBubbleProps) {
  const reduced = useReducedMotion();
  const isUser = message.role === "user";
  const showSlotPicker =
    message.ui_hints?.type === "slot_picker" &&
    !message.slotPickerHandled &&
    message.ui_hints.options.length > 0;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] min-w-0 break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-gmt-accent text-white"
            : "rounded-bl-md border border-gmt-border bg-gmt-bg-alt text-gmt-text",
        )}
      >
        {isUser ? (
          message.content
        ) : (
          <>
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline font-medium"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.reply_text ?? message.content}
            </ReactMarkdown>

            {showSlotPicker && (
              <div className="mt-2 flex flex-col gap-2">
                {message.ui_hints?.options?.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onSlotSelect(opt, message.id)}
                    className="text-left px-4 py-2 rounded-lg border border-blue-500 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  onClick={() => openCalPopup(message.ui_hints?.fallback_url)}
                  className="mt-1 text-left text-xs text-gray-400 underline"
                >
                  Ver mais horários →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
