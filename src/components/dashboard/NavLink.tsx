"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-white/15 font-medium text-white"
          : "text-white/70 hover:bg-white/5 hover:text-white",
      )}
    >
      {label}
    </Link>
  );
}
