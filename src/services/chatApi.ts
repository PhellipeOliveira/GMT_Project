import type { AgentConfig } from "@/types/chat";

const API_URL =
  process.env.NEXT_PUBLIC_AGENT_API_URL ?? "http://localhost:8000";

const SESSION_KEY = "gmt:agent:session";

const MOCK_REPLIES = [
  "Obrigado pela mensagem! Sou o agente da GMT — em breve vou poder ajudar-te com serviços, orçamentos e agendamentos.",
  "Recebi a tua mensagem. A equipa GMT trabalha com automações, IA e marketing digital para pequenas empresas.",
  "Boa pergunta! Posso ajudar com informações sobre os nossos serviços, portfolio e como agendar uma reunião.",
  "Estou aqui para ajudar. Queres saber mais sobre algum serviço em particular?",
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(): number {
  return 700 + Math.floor(Math.random() * 700);
}

function pickMockReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("servi") || lower.includes("service")) {
    return "Oferecemos automações, inteligência artificial e marketing digital. Queres que te explique algum serviço em detalhe?";
  }
  if (lower.includes("reuni") || lower.includes("agendar")) {
    return "Posso ajudar-te a agendar uma reunião com a equipa GMT. Indica-me o teu e-mail e preferência de horário.";
  }
  if (lower.includes("orçamento") || lower.includes("preco") || lower.includes("preço")) {
    return "Para um orçamento personalizado, preciso de saber um pouco mais sobre o teu projeto. Podes descrever o que precisas?";
  }
  return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
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
): Promise<{ reply: string }> {
  // TODO(backend): replace mock with real API call:
  // const res = await fetch(`${API_URL}/chat`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ session_id: sessionId, input }),
  // });
  // if (!res.ok) throw new Error("Chat request failed");
  // const data = await res.json();
  // return { reply: data.reply ?? data.output ?? data.message };

  void sessionId;

  await delay(randomDelay());

  if (Math.random() < 0.05) {
    throw new Error("Mock network error");
  }

  return { reply: pickMockReply(input) };
}
