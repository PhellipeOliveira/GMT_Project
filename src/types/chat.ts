export type ChatRole = "user" | "agent";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

export type ChatStatus = "idle" | "loading" | "error";

export type AgentConfig = {
  widgetEnabled: boolean;
};

/** Contrato de resposta do POST /chat (format_agent_response no backend). */
export type ChatApiResponse = {
  reply_text: string;
  intent: string;
  lead_id: string | null;
  structured?: {
    message?: string;
    intent?: string;
    lead_id?: string | null;
    data?: Record<string, unknown>;
  };
  trace_id?: string;
};
