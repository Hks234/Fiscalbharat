import type { Metadata } from "next";
import { PublicShell } from "@/components/public/public-shell";
import { Button } from "@/components/ui/button";
import { getSettings } from "@/lib/settings";
import { toTelLink, toWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = { title: "Our Services" };

const GROUPS = [
  {
    title: "Tax Solutions",
    items: [
      "Tax planning",
      "Accurate income tax filing",
      "GST registration and compliance",
      "GST return assistance",
      "Tax-related consultation",
    ],
  },
  {
    title: "Business Advisory & Accounting",
    items: [
      "Financial consulting",
      "Business plan development",
      "Strategic planning",
      "Bookkeeping",
      "Financial statement preparation",
      "Management reporting",
    ],
  },
  {
    title: "Wealth & Corporate Services",
    items: [
      "Company registration",
      "Payroll processing",
      "Audit assistance",
      "Corporate compliance support",
    ],
  },
  {
    title: "Loans & Financing",
    items: [
      "Personalized loan support",
      "Financing solutions",
      "Loan application assistance",
      "Financial documentation support",
    ],
  },
];

export default async function ServicesPage() {
  const settings = await getSettings();
  const enquiry = `Hello Fiscal Bharat, I would like to discuss your professional services.`;

  return (
    <PublicShell>
      <section className="bg-[#101D36] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm tracking-[0.22em] text-[#C6A15B] uppercase">Our Services</p>
          <h1 className="mt-3 font-serif text-5xl">Professional support across tax, advisory and finance</h1>
          <p className="mt-5 max-w-3xl text-white/80">
            Service outcomes depend on complete information, eligibility and applicable regulations.
            We do not guarantee loan approvals or tax savings.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2">
        {GROUPS.map((group) => (
          <article key={group.title} className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="font-serif text-3xl text-[#101D36]">{group.title}</h2>
            <ul className="mt-5 space-y-2 text-slate-600">
              {group.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={toWhatsAppLink(settings.whatsappNumber, `${enquiry} Service: ${group.title}`)}>
                  Contact Our Team
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={toTelLink(settings.contactPhone)}>Call</a>
              </Button>
            </div>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}
