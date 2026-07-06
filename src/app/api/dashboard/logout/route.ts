import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { DASH_COOKIE } from "@/lib/dashboardAuth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(DASH_COOKIE);
  return NextResponse.json({ ok: true });
}
