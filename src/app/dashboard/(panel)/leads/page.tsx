import type { Metadata } from "next";

import {
  Badge,
  EmptyRow,
  Panel,
  PageError,
  formatDateTime,
  statusTone,
} from "@/components/dashboard/ui";
import { getLeads } from "@/lib/dashboardApi";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let data;
  try {
    data = await getLeads({ q, limit: 100 });
  } catch (e) {
    return <PageError message={e instanceof Error ? e.message : "Erro desconhecido."} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Leads</h1>
          <p className="text-sm text-zinc-500">{data.total} no total.</p>
        </div>
        <form method="get" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Procurar nome, e-mail, empresa…"
            className="w-64 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Procurar
          </button>
        </form>
      </div>

      <Panel title="Todos os leads">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-2 font-medium">Nome</th>
              <th className="px-4 py-2 font-medium">E-mail</th>
              <th className="px-4 py-2 font-medium">Telefone</th>
              <th className="px-4 py-2 font-medium">Empresa</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Score</th>
              <th className="px-4 py-2 font-medium">Criado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.items.length === 0 ? (
              <EmptyRow colSpan={7} label="Nenhum lead encontrado." />
            ) : (
              data.items.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-2 font-medium text-zinc-900">{l.nome}</td>
                  <td className="px-4 py-2 text-zinc-600">{l.email ?? "—"}</td>
                  <td className="px-4 py-2 text-zinc-600">{l.telefone ?? "—"}</td>
                  <td className="px-4 py-2 text-zinc-600">{l.empresa ?? "—"}</td>
                  <td className="px-4 py-2">
                    <Badge tone={statusTone(l.status_codigo)}>{l.status_codigo}</Badge>
                    {l.qualificado ? <span className="ml-1"><Badge tone="green">qualificado</Badge></span> : null}
                  </td>
                  <td className="px-4 py-2 text-zinc-600">{l.score ?? 0}</td>
                  <td className="px-4 py-2 text-zinc-500">{formatDateTime(l.criado_em)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
