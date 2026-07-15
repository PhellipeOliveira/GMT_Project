import type { AgentConfig, ChatApiResponse } from "@/types/chat";

const API_URL =
  process.env.NEXT_PUBLIC_AGENT_API_URL ?? "http://localhost:8000";

const SESSION_KEY = "gmt:agent:session";

function formatApiErrorDetail(detail: unknown): string | null {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) =>
        typeof item === "object" && item !== null && "msg" in item
          ? String((item as { msg: unknown }).msg)
          : null,
      )
      .filter(Boolean);
    return messages.length > 0 ? messages.join("; ") : null;
  }
  return null;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "web:anon";

  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const id = `web:${crypto.randomUUID()}`;
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

export async function getAgentConfig(): Promise<AgentConfig> {
  try {
    const res = await fetch(`${API_URL}/config`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { widgetEnabled: false };
    }

    const data = (await res.json()) as { widget_enabled?: boolean };
    return { widgetEnabled: data.widget_enabled === true };
  } catch {
    return { widgetEnabled: false };
  }
}

export async function sendChatMessage(
  input: string,
  sessionId: string,
): Promise<{ reply: string; uiHints: ChatApiResponse["ui_hints"] }> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, input }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      formatApiErrorDetail(body?.detail) ??
        `Chat request failed: ${res.status}`,
    );
  }

  const data = (await res.json()) as ChatApiResponse;
  const reply = data.reply_text?.trim() || "";

  if (!reply) {
    throw new Error("Resposta vazia do agente");
  }

  return { reply, uiHints: data.ui_hints ?? null };
}
