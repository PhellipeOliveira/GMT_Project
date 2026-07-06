import {
  Badge,
  EmptyRow,
  Panel,
  PageError,
  StatCard,
  envioTone,
  formatDateTime,
  statusTone,
} from "@/components/dashboard/ui";
import { getSummary } from "@/lib/dashboardApi";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  let data;
  try {
    data = await getSummary();
  } catch (e) {
    return <PageError message={e instanceof Error ? e.message : "Erro desconhecido."} />;
  }

  const { totais, leads_recentes, reunioes_proximas, notificacoes_recentes } = data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Visão geral</h1>
        <p className="text-sm text-zinc-500">Resumo dos dados captados pelo agente.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Leads" value={totais.leads} hint={`${totais.leads_qualificados} qualificados`} />
        <StatCard label="Reuniões próximas" value={totais.reunioes_proximas} />
        <StatCard
          label="Notificações"
          value={totais.notificacoes}
          hint={totais.notificacoes_erro > 0 ? `${totais.notificacoes_erro} com erro` : "sem erros"}
        />
        <StatCard label="Relatórios" value={totais.relatorios} />
      </div>

      <Panel title="Leads recentes">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-2 font-medium">Nome</th>
              <th className="px-4 py-2 font-medium">E-mail</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Criado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {leads_recentes.length === 0 ? (
              <EmptyRow colSpan={4} label="Nenhum lead ainda." />
            ) : (
              leads_recentes.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-2 font-medium text-zinc-900">{l.nome}</td>
                  <td className="px-4 py-2 text-zinc-600">{l.email ?? "—"}</td>
                  <td className="px-4 py-2">
                    <Badge tone={statusTone(l.status_codigo)}>{l.status_codigo}</Badge>
                  </td>
                  <td className="px-4 py-2 text-zinc-500">{formatDateTime(l.criado_em)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Próximas reuniões">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th className="px-4 py-2 font-medium">Lead</th>
                <th className="px-4 py-2 font-medium">Quando</th>
                <th className="px-4 py-2 font-medium">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {reunioes_proximas.length === 0 ? (
                <EmptyRow colSpan={3} label="Nenhuma reunião agendada." />
              ) : (
                reunioes_proximas.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2 font-medium text-zinc-900">{r.lead_nome ?? "—"}</td>
                    <td className="px-4 py-2 text-zinc-600">{formatDateTime(r.data_hora)}</td>
                    <td className="px-4 py-2 text-zinc-600">{r.tipo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Panel>

        <Panel title="Notificações recentes">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th className="px-4 py-2 font-medium">Tipo</th>
                <th className="px-4 py-2 font-medium">Destinatário</th>
                <th className="px-4 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {notificacoes_recentes.length === 0 ? (
                <EmptyRow colSpan={3} label="Nenhuma notificação ainda." />
              ) : (
                notificacoes_recentes.map((n) => (
                  <tr key={n.id}>
                    <td className="px-4 py-2 text-zinc-700">{n.tipo}</td>
                    <td className="px-4 py-2 text-zinc-600">{n.destinatario}</td>
                    <td className="px-4 py-2">
                      <Badge tone={envioTone(n.status_envio)}>{n.status_envio}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
