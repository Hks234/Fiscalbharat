"use server";

import { enquirySchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

export async function submitEnquiry(_prev: { ok: boolean; message: string } | null, formData: FormData) {
  const parsed = enquirySchema.safeParse({
    name: formData.get("name"),
    mobile: formData.get("mobile"),
    email: formData.get("email"),
    service: formData.get("service"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Please check the form and try again.",
    };
  }

  await prisma.enquiry.create({ data: parsed.data });
  return {
    ok: true,
    message: "Thank you. Your enquiry has been received. Our team will contact you shortly.",
  };
}
