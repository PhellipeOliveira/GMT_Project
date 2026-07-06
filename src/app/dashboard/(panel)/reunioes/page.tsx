import type { Metadata } from "next";

import {
  Badge,
  EmptyRow,
  Panel,
  PageError,
  formatDateTime,
  statusTone,
} from "@/components/dashboard/ui";
import { getReunioes } from "@/lib/dashboardApi";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Reuniões" };

export default async function ReunioesPage() {
  let data;
  try {
    data = await getReunioes({ limit: 100 });
  } catch (e) {
    return <PageError message={e instanceof Error ? e.message : "Erro desconhecido."} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Reuniões</h1>
        <p className="text-sm text-zinc-500">{data.total} no total.</p>
      </div>

      <Panel title="Todas as reuniões">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-2 font-medium">Lead</th>
              <th className="px-4 py-2 font-medium">E-mail</th>
              <th className="px-4 py-2 font-medium">Data/hora</th>
              <th className="px-4 py-2 font-medium">Tipo</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Calendar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.items.length === 0 ? (
              <EmptyRow colSpan={6} label="Nenhuma reunião registada." />
            ) : (
              data.items.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 font-medium text-zinc-900">{r.lead_nome ?? "—"}</td>
                  <td className="px-4 py-2 text-zinc-600">{r.lead_email ?? "—"}</td>
                  <td className="px-4 py-2 text-zinc-600">{formatDateTime(r.data_hora)}</td>
                  <td className="px-4 py-2 text-zinc-600">{r.tipo}</td>
                  <td className="px-4 py-2">
                    <Badge tone={statusTone(r.status_codigo)}>{r.status_codigo}</Badge>
                  </td>
                  <td className="px-4 py-2 text-zinc-500">{r.gcal_event_id ? "sincronizada" : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
