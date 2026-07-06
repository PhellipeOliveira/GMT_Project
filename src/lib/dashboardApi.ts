/**
 * Camada de acesso do dashboard interno. Deve rodar SOMENTE no servidor
 * (importada apenas por Server Components / Route Handlers): consome os endpoints
 * /admin/* do backend FastAPI com o token administrativo, nunca exposto ao cliente.
 */

const API_URL =
  process.env.AGENT_API_URL ??
  process.env.NEXT_PUBLIC_AGENT_API_URL ??
  "http://localhost:8000";

export type LeadRow = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresa: string | null;
  origem?: string | null;
  status_codigo: string;
  qualificado: boolean;
  score: number | null;
  criado_em: string;
  atualizado_em?: string;
};

export type ReuniaoRow = {
  id: string;
  lead_id: string | null;
  lead_nome: string | null;
  lead_email: string | null;
  data_hora: string;
  tipo: string;
  local?: string | null;
  status_codigo: string;
  gcal_event_id?: string | null;
  criado_em: string;
};

export type NotificacaoRow = {
  id: string;
  lead_id: string | null;
  tipo: string;
  destinatario: string;
  assunto: string;
  referencia_id?: string | null;
  status_envio: string;
  erro_mensagem?: string | null;
  criado_em: string;
  enviado_em?: string | null;
};

export type RelatorioRow = {
  id: string;
  periodo_inicio: string;
  periodo_fim: string;
  leads_novos: number;
  leads_qualificados: number;
  reunioes_agendadas: number;
  reunioes_concluidas: number;
  orcamentos_criados: number;
  orcamentos_aprovados: number;
  duvidas_total: number;
  duvidas_escaladas: number;
  taxa_resolucao: number | null;
  enviado: boolean;
  criado_em: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type Summary = {
  totais: {
    leads: number;
    leads_qualificados: number;
    reunioes_proximas: number;
    notificacoes: number;
    notificacoes_erro: number;
    relatorios: number;
  };
  leads_recentes: LeadRow[];
  reunioes_proximas: ReuniaoRow[];
  notificacoes_recentes: NotificacaoRow[];
};

class DashboardApiError extends Error {}

async function adminFetch<T>(path: string): Promise<T> {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) {
    throw new DashboardApiError(
      "ADMIN_API_TOKEN não configurado no ambiente do frontend.",
    );
  }
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "X-Admin-Token": token, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new DashboardApiError(
      body?.detail ?? `Falha ao consultar ${path} (HTTP ${res.status}).`,
    );
  }
  return (await res.json()) as T;
}

function qs(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function getSummary(): Promise<Summary> {
  return adminFetch<Summary>("/admin/summary");
}

export function getLeads(
  opts: { limit?: number; offset?: number; q?: string } = {},
): Promise<Paginated<LeadRow>> {
  return adminFetch<Paginated<LeadRow>>(`/admin/leads${qs(opts)}`);
}

export function getReunioes(
  opts: { limit?: number; offset?: number } = {},
): Promise<Paginated<ReuniaoRow>> {
  return adminFetch<Paginated<ReuniaoRow>>(`/admin/reunioes${qs(opts)}`);
}

export function getNotificacoes(
  opts: { limit?: number; offset?: number; status_envio?: string } = {},
): Promise<Paginated<NotificacaoRow>> {
  return adminFetch<Paginated<NotificacaoRow>>(`/admin/notificacoes${qs(opts)}`);
}

export function getRelatorios(
  opts: { limit?: number; offset?: number } = {},
): Promise<Paginated<RelatorioRow>> {
  return adminFetch<Paginated<RelatorioRow>>(`/admin/relatorios${qs(opts)}`);
}
