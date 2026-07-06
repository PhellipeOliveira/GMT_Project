import type { Metadata } from "next";

import { LoginForm } from "@/components/dashboard/LoginForm";

export const metadata: Metadata = { title: "Entrar · Dashboard GMT" };

export default async function DashboardLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/dashboard") ? next : "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-semibold text-zinc-900">Dashboard GMT</h1>
        <p className="mt-1 mb-6 text-sm text-zinc-500">Área interna. Introduza a palavra-passe.</p>
        <LoginForm next={safeNext} />
      </div>
    </div>
  );
}
