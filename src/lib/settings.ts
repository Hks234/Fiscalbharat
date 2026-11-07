import "server-only";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export type SiteSettings = typeof DEFAULT_SETTINGS;

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.websiteSetting.findMany();
    const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    return {
      ...DEFAULT_SETTINGS,
      ...map,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(values: Partial<SiteSettings>) {
  await Promise.all(
    Object.entries(values).map(([key, value]) =>
      prisma.websiteSetting.upsert({
        where: { key },
        update: { value: String(value ?? "") },
        create: { key, value: String(value ?? "") },
      }),
    ),
  );
}
