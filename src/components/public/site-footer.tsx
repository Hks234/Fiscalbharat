import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { PUBLIC_NAV } from "@/lib/constants";
import type { SiteSettings } from "@/lib/settings";
import { toTelLink, toWhatsAppLink } from "@/lib/utils";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto bg-[#101D36] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <BrandLogo settings={settings} inverted size="footer" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">{settings.tagline}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-[0.18em] text-[#C6A15B] uppercase">
            Navigate
          </h2>
          <div className="mt-4 grid gap-2 text-sm text-white/80">
            {PUBLIC_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[#C6A15B]">
                {item.label}
              </Link>
            ))}
            <Link href="/admin/login" className="hover:text-[#C6A15B]">
              Admin Portal
            </Link>
          </div>
        </div>
        <div className="text-sm text-white/80">
          <h2 className="text-sm font-semibold tracking-[0.18em] text-[#C6A15B] uppercase">
            Contact
          </h2>
          <p className="mt-4">{settings.address}</p>
          <p className="mt-3">
            <a href={toTelLink(settings.contactPhone)} className="hover:text-[#C6A15B]">
              {settings.contactPhone}
            </a>
          </p>
          <p className="mt-1">
            <a href={`mailto:${settings.email}`} className="hover:text-[#C6A15B]">
              {settings.email}
            </a>
          </p>
          <p className="mt-3">
            <a href={toWhatsAppLink(settings.whatsappNumber)} className="hover:text-[#C6A15B]">
              WhatsApp
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        {settings.footerText}
      </div>
    </footer>
  );
}
