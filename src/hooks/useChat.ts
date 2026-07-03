"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChatMessage, ChatStatus } from "@/types/chat";
import {
  getOrCreateSessionId,
  sendChatMessage,
} from "@/services/chatApi";

const MESSAGES_KEY = "gmt:agent:messages";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "agent",
  content:
    "Olá! Sou o agente da GMT. Posso ajudar com dúvidas sobre serviços, orçamentos e agendamentos. Como posso ajudar?",
  createdAt: Date.now(),
};

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];

  try {
    const raw = sessionStorage.getItem(MESSAGES_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return parsed.length > 0 ? parsed : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

function saveMessages(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: Date.now(),
  };
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages());
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => getOrCreateSessionId());

  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status === "loading") return;

      const userMessage = createMessage("user", trimmed);
      setMessages((prev) => [...prev, userMessage]);
      setStatus("loading");
      setError(null);

      try {
        const { reply } = await sendChatMessage(trimmed, sessionId);
        const agentMessage = createMessage("agent", reply);
        setMessages((prev) => [...prev, agentMessage]);
        setStatus("idle");
      } catch {
        setStatus("error");
        setError("Não foi possível obter resposta.");
        const fallback = createMessage(
          "agent",
          "Tive um problema a responder. Tenta novamente.",
        );
        setMessages((prev) => [...prev, fallback]);
      }
    },
    [sessionId, status],
  );

  return {
    messages,
    status,
    error,
    sendMessage,
    isLoading: status === "loading",
  };
}
