"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/settings";

const reasons = [
  "Clear, practical advice across tax, accounts and corporate compliance.",
  "A dedicated client portal for documents and service progress.",
  "Personal support for financing documentation and applications.",
  "A Raipur-based practice serving businesses across Chhattisgarh.",
];

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative overflow-hidden bg-[#101D36] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(198,161,91,0.16),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(23,74,131,0.55),transparent_34%),linear-gradient(165deg,#0c162b_0%,#101D36_46%,#163a68_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(198,161,91,0.05))]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] tracking-[0.32em] text-[#C6A15B] uppercase">
            {settings.subBrand}
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-[2.6rem] leading-[1.12] md:text-[3.7rem]">
            Empowering Businesses Through Smarter Financial Decisions.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/78 md:text-lg">
            Your trusted partner for taxation, financial consulting, business advisory,
            corporate services and personalized loan assistance.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg" className="rounded-full px-7">
              <Link href="/services">Explore Our Services</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/70 text-white hover:bg-white/10"
            >
              <Link href="/contact">Contact Our Experts</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-full text-white hover:bg-white/10">
              <Link href="/client/login">Client Login</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative overflow-hidden rounded-[28px] border border-[#C6A15B]/25 bg-[#0b1428]/70 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-md md:p-8"
        >
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent" />
          <div className="flex justify-center overflow-hidden rounded-2xl bg-[#141414] ring-1 ring-[#C6A15B]/20">
            <BrandLogo settings={settings} size="hero" className="max-w-full" />
          </div>
          <p className="mt-7 text-center text-[11px] tracking-[0.28em] text-[#C6A15B] uppercase">
            Why clients choose us
          </p>
          <ul className="mt-5 space-y-3.5">
            {reasons.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-white/85">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#C6A15B]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
