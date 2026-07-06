import type { Metadata } from "next";

import {
  Badge,
  EmptyRow,
  Panel,
  PageError,
  envioTone,
  formatDateTime,
} from "@/components/dashboard/ui";
import { getNotificacoes } from "@/lib/dashboardApi";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Notificações" };

export default async function NotificacoesPage() {
  let data;
  try {
    data = await getNotificacoes({ limit: 100 });
  } catch (e) {
    return <PageError message={e instanceof Error ? e.message : "Erro desconhecido."} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Notificações</h1>
        <p className="text-sm text-zinc-500">Log de e-mails disparados pelo agente ({data.total}).</p>
      </div>

      <Panel title="Todas as notificações">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-2 font-medium">Tipo</th>
              <th className="px-4 py-2 font-medium">Destinatário</th>
              <th className="px-4 py-2 font-medium">Assunto</th>
              <th className="px-4 py-2 font-medium">Estado</th>
              <th className="px-4 py-2 font-medium">Criado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.items.length === 0 ? (
              <EmptyRow colSpan={5} label="Nenhuma notificação ainda." />
            ) : (
              data.items.map((n) => (
                <tr key={n.id}>
                  <td className="px-4 py-2 text-zinc-700">{n.tipo}</td>
                  <td className="px-4 py-2 text-zinc-600">{n.destinatario}</td>
                  <td className="px-4 py-2 text-zinc-600">
                    {n.assunto}
                    {n.erro_mensagem ? (
                      <span className="block text-xs text-red-500">{n.erro_mensagem}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2">
                    <Badge tone={envioTone(n.status_envio)}>{n.status_envio}</Badge>
                  </td>
                  <td className="px-4 py-2 text-zinc-500">{formatDateTime(n.criado_em)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
