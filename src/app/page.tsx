import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  Landmark,
  Scale,
  ShieldCheck,
  MapPin,
  FolderLock,
} from "lucide-react";
import { Hero } from "@/components/public/hero";
import { PublicShell } from "@/components/public/public-shell";
import { Button } from "@/components/ui/button";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

const services = [
  {
    title: "Tax Solutions",
    copy: "Planning, filing and GST compliance support.",
    icon: Scale,
  },
  {
    title: "Business Advisory",
    copy: "Consulting, bookkeeping and management reporting.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Corporate Services",
    copy: "Registration, payroll, audit and compliance assistance.",
    icon: Building2,
  },
  {
    title: "Loans & Financing",
    copy: "Documentation and application support tailored to each case.",
    icon: Landmark,
  },
];

const reasons = [
  {
    title: "Client-first advice",
    copy: "Recommendations are based on your records, objectives and applicable law.",
    icon: ShieldCheck,
  },
  {
    title: "Organised delivery",
    copy: "A secure portal keeps documents and service status in one place.",
    icon: FolderLock,
  },
  {
    title: "Local, professional support",
    copy: "A Raipur practice with a clear, responsive working style.",
    icon: MapPin,
  },
];

export default async function HomePage() {
  const [settings, testimonials] = await Promise.all([
    getSettings(),
    prisma.testimonial
      .findMany({
        where: { isEnabled: true },
        orderBy: { sortOrder: "asc" },
        take: 3,
      })
      .catch(() => []),
  ]);

  return (
    <PublicShell>
      <Hero settings={settings} />
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-[11px] tracking-[0.28em] text-[#C6A15B] uppercase">{settings.websiteName}</p>
        <div className="mt-4 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h2 className="max-w-3xl font-serif text-4xl leading-tight text-[#101D36] md:text-5xl">
            A financial consultancy built around clarity, compliance and client care.
          </h2>
          <p className="max-w-xl text-base leading-8 text-slate-600">
            {settings.websiteName} is {settings.subBrand}. We support businesses and
            professionals with taxation, financial consulting, business development, corporate
            services and personalised loan assistance — always with advice that fits the facts of
            the engagement, never with guaranteed outcomes.
          </p>
        </div>
      </section>
      <section className="border-y border-[#e8eef6] bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-[#C6A15B] uppercase">Practice areas</p>
              <h2 className="mt-2 font-serif text-4xl text-[#101D36]">How we can help</h2>
            </div>
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link href="/services">View all services</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map(({ title, copy, icon: Icon }) => (
              <article
                key={title}
                className="group rounded-3xl border border-[#e4eaf3] bg-[#F5F7FA] p-6 transition hover:-translate-y-1 hover:border-[#C6A15B]/50 hover:bg-white hover:shadow-[0_18px_40px_rgba(16,29,54,0.08)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101D36] text-[#C6A15B]">
                  <Icon size={18} />
                </div>
                <h3 className="mt-5 font-serif text-2xl text-[#101D36]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button asChild>
              <Link href="/services">View all services</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-[11px] tracking-[0.28em] text-[#C6A15B] uppercase">Our difference</p>
        <h2 className="mt-2 font-serif text-4xl text-[#101D36]">Why choose Fiscal Bharat</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reasons.map(({ title, copy, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-[#e4eaf3] bg-white p-7 shadow-[0_10px_30px_rgba(16,29,54,0.04)]">
              <Icon className="text-[#174A83]" size={22} />
              <h3 className="mt-4 font-serif text-2xl text-[#101D36]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-[#101D36] py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-[11px] tracking-[0.28em] text-[#C6A15B] uppercase">Testimonials</p>
          <h2 className="mt-2 font-serif text-4xl">What clients say</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-7"
              >
                <p className="font-serif text-3xl text-[#C6A15B]">“</p>
                <p className="text-lg leading-8">{item.quote}</p>
                <footer className="mt-5 text-sm tracking-wide text-[#C6A15B]">
                  {item.author || item.source || "Client review"}
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="gold" className="rounded-full">
              <Link href="/testimonials">Read more reviews</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-[32px] bg-[#101D36] px-8 py-10 text-white shadow-[0_20px_50px_rgba(16,29,54,0.16)] md:flex md:items-center md:justify-between md:px-12">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-[#C6A15B] uppercase">Get in touch</p>
            <h2 className="mt-2 font-serif text-4xl">Speak with our team</h2>
            <p className="mt-3 max-w-xl text-white/75">
              Tell us about the support you need. We will review your enquiry and get in touch.
            </p>
          </div>
          <Button asChild size="lg" variant="gold" className="mt-6 rounded-full md:mt-0">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </PublicShell>
  );
}
