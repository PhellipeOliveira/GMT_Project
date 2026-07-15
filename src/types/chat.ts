export type ChatRole = "user" | "agent";

export type SlotPickerOption = {
  value: string;
  label: string;
};

export type SlotPickerUiHints = {
  type: "slot_picker";
  options: SlotPickerOption[];
  fallback_url: string;
};

export type ChatUiHints = SlotPickerUiHints;

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  ui_hints?: ChatUiHints | null;
  slotPickerHandled?: boolean;
};

export type ChatStatus = "idle" | "loading" | "error";

export type AgentConfig = {
  widgetEnabled: boolean;
};

/** Contrato de resposta do POST /chat (format_agent_response no backend). */
export type ChatApiResponse = {
  reply_text: string;
  intent: string;
  ui_hints?: ChatUiHints | null;
  trace_id?: string;
};
