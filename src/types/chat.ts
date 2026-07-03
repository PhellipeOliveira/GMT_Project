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
