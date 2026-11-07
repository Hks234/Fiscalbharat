import type { Metadata } from "next";
import { PublicShell } from "@/components/public/public-shell";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const [settings, testimonials] = await Promise.all([
    getSettings(),
    prisma.testimonial
      .findMany({
        where: { isEnabled: true },
        orderBy: { sortOrder: "asc" },
      })
      .catch(() => []),
  ]);

  return (
    <PublicShell>
      <section className="bg-[#101D36] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm tracking-[0.22em] text-[#C6A15B] uppercase">Testimonials</p>
          <h1 className="mt-3 font-serif text-5xl">Client feedback</h1>
          <p className="mt-5 max-w-2xl text-white/80">
            Published comments are limited to genuine reviews. {settings.googleReviewCount} Google
            reviews are currently associated with Fiscal Bharat.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.id} className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-lg leading-8 text-[#101D36]">“{item.quote}”</p>
              <footer className="mt-4 text-sm text-[#174A83]">
                {item.author ? item.author : item.source || "Google Review"}
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild variant="gold">
            <a href={settings.googleReviewsUrl} target="_blank" rel="noreferrer">
              Read More Reviews
            </a>
          </Button>
        </div>
      </section>
    </PublicShell>
  );
}
