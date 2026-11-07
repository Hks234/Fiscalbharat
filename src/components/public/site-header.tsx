"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { PUBLIC_NAV } from "@/lib/constants";
import type { SiteSettings } from "@/lib/settings";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#101D36]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="min-w-0">
          <BrandLogo settings={settings} inverted className="text-white" />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/80 transition hover:text-[#C6A15B]"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild variant="gold" size="sm">
            <Link href="/client/login">Client Login</Link>
          </Button>
        </nav>
        <button
          className="rounded-md p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <div className="space-y-2 border-t border-white/10 px-4 py-4 md:hidden">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-white"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild variant="gold" className="w-full">
            <Link href="/client/login">Client Login</Link>
          </Button>
        </div>
      ) : null}
    </header>
  );
}
