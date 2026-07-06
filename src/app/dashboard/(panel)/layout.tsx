import type { Metadata } from "next";

import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { NavLink } from "@/components/dashboard/NavLink";

export const metadata: Metadata = {
  title: { default: "Dashboard GMT", template: "%s · Dashboard GMT" },
};

const NAV = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/reunioes", label: "Reuniões" },
  { href: "/dashboard/notificacoes", label: "Notificações" },
  { href: "/dashboard/relatorios", label: "Relatórios" },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900">
      <aside className="hidden w-60 shrink-0 flex-col bg-zinc-900 p-4 md:flex">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-white">GMT</p>
          <p className="text-xs text-white/50">Painel interno</p>
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <div className="border-t border-white/10 pt-2">
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 overflow-x-auto bg-zinc-900 px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
