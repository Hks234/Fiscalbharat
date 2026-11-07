import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { PublicShell } from "@/components/public/public-shell";
import { Button } from "@/components/ui/button";
import { getSettings } from "@/lib/settings";
import { toTelLink, toWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <PublicShell>
      <section className="bg-[#101D36] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm tracking-[0.22em] text-[#C6A15B] uppercase">Contact Us</p>
          <h1 className="mt-3 font-serif text-5xl">
            {settings.websiteName} – {settings.subBrand}
          </h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-slate-600">{settings.address}</p>
          <p>
            Phone:{" "}
            <a className="text-[#174A83]" href={toTelLink(settings.contactPhone)}>
              {settings.contactPhone}
            </a>
          </p>
          <p>
            Website:{" "}
            <a className="text-[#174A83]" href={settings.websiteUrl}>
              {settings.websiteUrl}
            </a>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={toTelLink(settings.contactPhone)}>Call Now</a>
            </Button>
            <Button asChild variant="gold">
              <a href={toWhatsAppLink(settings.whatsappNumber)}>WhatsApp</a>
            </Button>
            <Button asChild variant="outline">
              <a href={settings.mapsDirectionsUrl} target="_blank" rel="noreferrer">
                Directions
              </a>
            </Button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#e4eaf3]">
            <iframe
              title="Fiscal Bharat location"
              src={settings.mapsEmbedUrl}
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="font-serif text-3xl text-[#101D36]">Send an enquiry</h2>
          <p className="mt-2 mb-6 text-sm text-slate-600">
            Your message is stored securely and reviewed by our team.
          </p>
          <ContactForm />
        </div>
      </section>
    </PublicShell>
  );
}
