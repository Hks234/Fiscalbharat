import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DEFAULT_SERVICES,
  DEFAULT_SETTINGS,
  DOCUMENT_CATEGORIES,
} from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.INITIAL_ADMIN_USERNAME;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error("Set INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD before seeding.");
  }

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (!existing) {
    await prisma.admin.create({
      data: {
        username,
        passwordHash: await bcrypt.hash(password, 12),
        mustChangePassword: true,
      },
    });
  }

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.websiteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  for (const name of DOCUMENT_CATEGORIES) {
    await prisma.documentCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const service of DEFAULT_SERVICES) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: { description: service.description },
      create: service,
    });
  }

  const genuineTestimonials = [
    {
      quote: "Fiscal Bharat offers honest and reliable financial services.",
      source: "Google Reviews",
      sortOrder: 1,
    },
    {
      quote: "Best Financial Service in Chhattisgarh.",
      source: "Google Reviews",
      sortOrder: 2,
    },
    {
      quote: "I've had a great experience working with Fiscal Bharat.",
      source: "Google Reviews",
      sortOrder: 3,
    },
  ];

  const count = await prisma.testimonial.count();
  if (count === 0) {
    await prisma.testimonial.createMany({ data: genuineTestimonials });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
