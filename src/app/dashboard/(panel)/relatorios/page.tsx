import type { Metadata } from "next";

import { Badge, EmptyRow, Panel, PageError, formatDate } from "@/components/dashboard/ui";
import { getRelatorios } from "@/lib/dashboardApi";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Relatórios" };

export default async function RelatoriosPage() {
  let data;
  try {
    data = await getRelatorios({ limit: 100 });
  } catch (e) {
    return <PageError message={e instanceof Error ? e.message : "Erro desconhecido."} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Relatórios semanais</h1>
        <p className="text-sm text-zinc-500">{data.total} no total.</p>
      </div>

      <Panel title="Histórico">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-2 font-medium">Período</th>
              <th className="px-4 py-2 font-medium">Leads</th>
              <th className="px-4 py-2 font-medium">Reuniões</th>
              <th className="px-4 py-2 font-medium">Orçamentos</th>
              <th className="px-4 py-2 font-medium">Dúvidas</th>
              <th className="px-4 py-2 font-medium">Resolução</th>
              <th className="px-4 py-2 font-medium">Enviado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.items.length === 0 ? (
              <EmptyRow colSpan={7} label="Nenhum relatório gerado ainda." />
            ) : (
              data.items.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-zinc-700">
                    {formatDate(r.periodo_inicio)} – {formatDate(r.periodo_fim)}
                  </td>
                  <td className="px-4 py-2 text-zinc-600">
                    {r.leads_novos} <span className="text-zinc-400">({r.leads_qualificados} qual.)</span>
                  </td>
                  <td className="px-4 py-2 text-zinc-600">
                    {r.reunioes_agendadas} <span className="text-zinc-400">({r.reunioes_concluidas} conc.)</span>
                  </td>
                  <td className="px-4 py-2 text-zinc-600">
                    {r.orcamentos_criados} <span className="text-zinc-400">({r.orcamentos_aprovados} aprov.)</span>
                  </td>
                  <td className="px-4 py-2 text-zinc-600">
                    {r.duvidas_total} <span className="text-zinc-400">({r.duvidas_escaladas} esc.)</span>
                  </td>
                  <td className="px-4 py-2 text-zinc-600">{r.taxa_resolucao ?? 0}%</td>
                  <td className="px-4 py-2">
                    <Badge tone={r.enviado ? "green" : "neutral"}>{r.enviado ? "sim" : "não"}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
