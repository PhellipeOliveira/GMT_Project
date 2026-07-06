import { cn } from "@/lib/utils";

const DATE_TIME = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Lisbon",
});
const DATE = new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeZone: "Europe/Lisbon" });

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : DATE_TIME.format(d);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : DATE.format(d);
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-zinc-400">{hint}</p> : null}
    </div>
  );
}

const TONES: Record<string, string> = {
  neutral: "bg-zinc-100 text-zinc-700",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium", TONES[tone])}>
      {children}
    </span>
  );
}

/** Mapeia status de envio de notificação para um tom de cor. */
export function envioTone(status: string): keyof typeof TONES {
  if (status === "enviado") return "green";
  if (status === "erro" || status === "falhou") return "red";
  return "amber";
}

/** Mapeia status de reunião/lead para um tom de cor. */
export function statusTone(status: string): keyof typeof TONES {
  if (["agendada", "concluida", "qualificado", "fechado"].includes(status)) return "green";
  if (["cancelada", "perdido"].includes(status)) return "red";
  if (["remarcada", "em_contato", "proposta_enviada"].includes(status)) return "amber";
  return "neutral";
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white">
      <header className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {action}
      </header>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-sm text-zinc-400">
        {label}
      </td>
    </tr>
  );
}

export function PageError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p className="font-medium">Não foi possível carregar os dados.</p>
      <p className="mt-1 text-red-600">{message}</p>
      <p className="mt-2 text-xs text-red-500">
        Verifique se o backend está acessível e se ADMIN_API_TOKEN está configurado no frontend e no backend.
      </p>
    </div>
  );
}
