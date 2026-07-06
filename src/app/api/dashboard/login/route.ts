import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { DASH_COOKIE } from "@/lib/dashboardAuth";

/**
 * Autenticação simples do dashboard: compara a senha enviada com DASHBOARD_PASSWORD
 * e, em caso de sucesso, grava um cookie httpOnly de sessão (gmt_dash) cujo valor é
 * o DASHBOARD_SESSION_TOKEN — o mesmo que o proxy valida.
 */
export async function POST(request: Request) {
  const expectedPassword = process.env.DASHBOARD_PASSWORD;
  const sessionToken = process.env.DASHBOARD_SESSION_TOKEN;

  if (!expectedPassword || !sessionToken) {
    return NextResponse.json(
      { error: "Dashboard não configurado (defina DASHBOARD_PASSWORD e DASHBOARD_SESSION_TOKEN)." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password ?? "";

  if (password !== expectedPassword) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(DASH_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });

  return NextResponse.json({ ok: true });
}
