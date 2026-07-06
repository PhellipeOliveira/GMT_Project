import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DASH_COOKIE } from "@/lib/dashboardAuth";

/**
 * Proxy (antigo "middleware") — protege as rotas /dashboard/*.
 * Exige o cookie de sessão `gmt_dash` igual a DASHBOARD_SESSION_TOKEN; caso contrário,
 * redireciona para /dashboard/login. A própria página de login é liberada.
 * Runtime Node por padrão, então process.env está disponível aqui.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A página de login precisa ser acessível sem sessão (evita loop de redirect).
  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  const expected = process.env.DASHBOARD_SESSION_TOKEN;
  const token = request.cookies.get(DASH_COOKIE)?.value;

  if (!expected || !token || token !== expected) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
