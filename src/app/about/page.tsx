import type { Metadata } from "next";
import { PublicShell } from "@/components/public/public-shell";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "About Us" };

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <PublicShell>
      <section className="bg-[#101D36] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm tracking-[0.22em] text-[#C6A15B] uppercase">About Us</p>
          <h1 className="mt-3 font-serif text-5xl">
            {settings.websiteName} – {settings.subBrand}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-white/80">{settings.tagline}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl space-y-8 px-4 py-16 text-slate-700">
        <p className="max-w-3xl text-lg leading-8">
          {settings.websiteName} is a financial consultancy that helps businesses and professionals
          organise their tax, accounting and corporate obligations with care. We work as a
          practical partner: reviewing records, explaining options, and supporting the filings and
          documentation that keep an organisation on a sound footing.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            [
              "Financial consultancy",
              "We help clients interpret financial information and plan next steps with a clear view of cash, compliance and commercial priorities.",
            ],
            [
              "Taxation and compliance",
              "Income tax, GST and related compliance work is handled with attention to accuracy, deadlines and complete supporting records.",
            ],
            [
              "Business development",
              "Advisory support covers business planning, reporting and the financial disciplines that support growth.",
            ],
            [
              "Financial planning",
              "We assist with structured financial planning so decisions are informed by current numbers rather than assumptions.",
            ],
            [
              "Corporate services",
              "Company registration, payroll, audit assistance and corporate compliance are delivered as coordinated professional support.",
            ],
            [
              "Client-focused assistance",
              "Each engagement is scoped to the client’s actual needs, with a secure portal for documents and progress updates.",
            ],
          ].map(([title, copy]) => (
            <article key={title} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl text-[#101D36]">{title}</h2>
              <p className="mt-3 leading-7">{copy}</p>
            </article>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-[#e4eaf3] bg-white p-6">
            <h2 className="text-2xl text-[#174A83]">Our Mission</h2>
            <p className="mt-3 leading-7">
              To provide dependable financial, tax and corporate support that helps clients make
              informed decisions and meet their statutory responsibilities.
            </p>
          </article>
          <article className="rounded-2xl border border-[#e4eaf3] bg-white p-6">
            <h2 className="text-2xl text-[#174A83]">Our Vision</h2>
            <p className="mt-3 leading-7">
              To be a trusted consultancy where fiscal discipline and sound monetary judgement work
              together to support sustainable business growth.
            </p>
          </article>
          <article className="rounded-2xl border border-[#e4eaf3] bg-white p-6">
            <h2 className="text-2xl text-[#174A83]">Our Approach</h2>
            <p className="mt-3 leading-7">
              We begin with facts: documents, numbers and the client’s objectives. Advice is then
              framed around applicable law and practical execution, with regular communication.
            </p>
          </article>
          <article className="rounded-2xl border border-[#e4eaf3] bg-white p-6">
            <h2 className="text-2xl text-[#174A83]">Why Choose Us</h2>
            <p className="mt-3 leading-7">
              Clients work with a focused practice that combines professional service delivery, a
              secure client portal and clear communication — without inflated claims or guaranteed
              results.
            </p>
          </article>
        </div>
      </section>
    </PublicShell>
  );
}
