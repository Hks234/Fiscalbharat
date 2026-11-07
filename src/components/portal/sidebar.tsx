"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/settings";

export function PortalSidebar({
  settings,
  items,
  footer,
}: {
  settings: SiteSettings;
  items: { href: string; label: string; icon: React.ReactNode }[];
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-[#e4eaf3] bg-[#101D36] text-white md:flex md:flex-col">
        <div className="p-5">
          <BrandLogo settings={settings} inverted />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                pathname === item.href ? "bg-white/10 text-[#C6A15B]" : "text-white/80 hover:bg-white/5",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">{footer}</div>
      </aside>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#e4eaf3] bg-white md:hidden">
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-2 text-[10px]",
              pathname === item.href ? "text-[#174A83]" : "text-slate-500",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
