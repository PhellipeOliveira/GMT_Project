"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-end gap-2 border-t border-gmt-border bg-gmt-bg p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escreve a tua mensagem..."
        disabled={disabled}
        rows={1}
        className={cn(
          "input-gmt max-h-24 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-gmt-border bg-gmt-bg-alt px-3 py-2 text-sm text-gmt-text placeholder:text-gmt-muted focus:border-gmt-accent focus:outline-none",
          disabled && "cursor-not-allowed opacity-60",
        )}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Enviar mensagem"
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gmt-accent text-white transition-opacity hover:opacity-90",
          (disabled || !value.trim()) && "cursor-not-allowed opacity-50",
        )}
      >
        <Send size={16} />
      </button>
    </form>
  );
}
