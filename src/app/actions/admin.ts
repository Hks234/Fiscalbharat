"use server";

import { Prisma, ServiceStatus, EnquiryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { logActivity, requireAdmin } from "@/lib/auth";
import {
  generateClientCode,
  generateTemporaryPassword,
  hashPassword,
} from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { saveSettings } from "@/lib/settings";
import {
  deleteFromCloudinary,
  isCloudinaryConfigured,
  uploadPublicAsset,
  uploadToCloudinary,
} from "@/lib/storage";
import {
  createClientSchema,
  documentMetaSchema,
  testimonialSchema,
  websiteSettingsSchema,
} from "@/lib/validation";

async function uniqueClientCode() {
  for (let i = 0; i < 12; i += 1) {
    const clientId = generateClientCode();
    const exists = await prisma.client.findUnique({ where: { clientId } });
    if (!exists) return clientId;
  }
  throw new Error("Unable to generate a unique Client ID. Please try again.");
}

export async function createClientAction(_prev: unknown, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = createClientSchema.safeParse({
    name: formData.get("name"),
    mobile: formData.get("mobile"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid client details." };
  }

  const password = generateTemporaryPassword();
  try {
    const client = await prisma.client.create({
      data: {
        clientId: await uniqueClientCode(),
        name: parsed.data.name,
        mobile: parsed.data.mobile.replace(/\s/g, ""),
        passwordHash: await hashPassword(password),
        mustChangePassword: true,
      },
    });
    await logActivity({
      actorType: "ADMIN",
      actorId: admin.id,
      action: "CLIENT_CREATED",
      details: client.clientId,
    });
    revalidatePath("/admin/clients");
    revalidatePath("/admin/dashboard");
    return { clientId: client.clientId, password, name: client.name };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A client with this mobile number already exists." };
    }
    throw error;
  }
}

export async function updateClientAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const mobile = String(formData.get("mobile") || "").trim();
  if (!id || name.length < 2 || mobile.length < 10) {
    return { error: "Name and mobile number are required." };
  }
  try {
    await prisma.client.update({
      where: { id },
      data: { name, mobile: mobile.replace(/\s/g, "") },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A client with this mobile number already exists." };
    }
    throw error;
  }
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "CLIENT_UPDATED", details: id });
  revalidatePath("/admin/clients");
  return { ok: true };
}

export async function toggleClientAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const isActive = String(formData.get("isActive") || "") === "true";
  await prisma.client.update({ where: { id }, data: { isActive: !isActive } });
  await logActivity({
    actorType: "ADMIN",
    actorId: admin.id,
    action: isActive ? "CLIENT_DEACTIVATED" : "CLIENT_ACTIVATED",
    details: id,
  });
  revalidatePath("/admin/clients");
}

export async function deleteClientAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const confirm = String(formData.get("confirm") || "");
  if (confirm !== "DELETE") {
    return { error: "Type DELETE to confirm removal of this client and their documents." };
  }
  const docs = await prisma.document.findMany({ where: { clientId: id } });
  await prisma.client.delete({ where: { id } });
  await Promise.all(docs.map((doc) => deleteFromCloudinary(doc.storageKey)));
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "CLIENT_DELETED", details: id });
  revalidatePath("/admin/clients");
  revalidatePath("/admin/documents");
  return { ok: true };
}

export async function resetClientPasswordAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const password = generateTemporaryPassword();
  const client = await prisma.client.update({
    where: { id },
    data: {
      passwordHash: await hashPassword(password),
      mustChangePassword: true,
    },
  });
  await logActivity({
    actorType: "ADMIN",
    actorId: admin.id,
    action: "CLIENT_PASSWORD_RESET",
    details: client.clientId,
  });
  return { clientId: client.clientId, password, name: client.name };
}

export async function uploadDocumentAction(_prev: unknown, formData: FormData) {
  const admin = await requireAdmin();
  if (!isCloudinaryConfigured()) {
    return {
      error:
        "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    };
  }
  const parsed = documentMetaSchema.safeParse({
    clientId: formData.get("clientId"),
    documentName: formData.get("documentName"),
    categoryName: formData.get("categoryName"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid document details." };
  }
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "Please choose a file to upload." };
  }
  const category = await prisma.documentCategory.upsert({
    where: { name: parsed.data.categoryName },
    update: {},
    create: { name: parsed.data.categoryName },
  });
  const uploaded = await uploadToCloudinary(file, `fiscal-bharat/clients/${parsed.data.clientId}`);
  await prisma.document.create({
    data: {
      clientId: parsed.data.clientId,
      documentName: parsed.data.documentName,
      categoryId: category.id,
      description: parsed.data.description,
      fileName: uploaded.fileName,
      fileType: uploaded.fileType,
      fileSize: uploaded.fileSize,
      storageKey: uploaded.storageKey,
    },
  });
  await logActivity({
    actorType: "ADMIN",
    actorId: admin.id,
    action: "DOCUMENT_UPLOADED",
    details: parsed.data.documentName,
  });
  revalidatePath("/admin/documents");
  revalidatePath("/client/documents");
  return { ok: true };
}

export async function renameDocumentAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const documentName = String(formData.get("documentName") || "").trim();
  if (!id || documentName.length < 2) return { error: "Document name is required." };
  await prisma.document.update({ where: { id }, data: { documentName } });
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "DOCUMENT_RENAMED", details: id });
  revalidatePath("/admin/documents");
  return { ok: true };
}

export async function replaceDocumentAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const file = formData.get("file");
  if (!(file instanceof File) || !id) return { error: "Choose a replacement file." };
  const current = await prisma.document.findUnique({ where: { id } });
  if (!current) return { error: "Document not found." };
  const uploaded = await uploadToCloudinary(file, `fiscal-bharat/clients/${current.clientId}`);
  await prisma.document.update({
    where: { id },
    data: {
      fileName: uploaded.fileName,
      fileType: uploaded.fileType,
      fileSize: uploaded.fileSize,
      storageKey: uploaded.storageKey,
    },
  });
  await deleteFromCloudinary(current.storageKey);
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "DOCUMENT_REPLACED", details: id });
  revalidatePath("/admin/documents");
  return { ok: true };
}

export async function deleteDocumentAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const current = await prisma.document.findUnique({ where: { id } });
  if (!current) return { error: "Document not found." };
  await prisma.document.delete({ where: { id } });
  await deleteFromCloudinary(current.storageKey);
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "DOCUMENT_DELETED", details: id });
  revalidatePath("/admin/documents");
  return { ok: true };
}

export async function assignServiceAction(formData: FormData) {
  const admin = await requireAdmin();
  const clientId = String(formData.get("clientId") || "");
  const serviceName = String(formData.get("serviceName") || "").trim();
  const clientNotes = String(formData.get("clientNotes") || "");
  const internalNotes = String(formData.get("internalNotes") || "");
  if (!clientId || serviceName.length < 2) return { error: "Select a client and service name." };
  const service = await prisma.service.upsert({
    where: { name: serviceName },
    update: { isActive: true },
    create: { name: serviceName },
  });
  const assignment = await prisma.clientService.create({
    data: {
      clientId,
      serviceId: service.id,
      clientNotes,
      internalNotes,
    },
  });
  await prisma.serviceHistory.create({
    data: {
      clientServiceId: assignment.id,
      status: "PENDING",
      note: "Service assigned",
      changedByAdminId: admin.id,
    },
  });
  await logActivity({
    actorType: "ADMIN",
    actorId: admin.id,
    action: "SERVICE_ASSIGNED",
    details: serviceName,
  });
  revalidatePath("/admin/services");
  revalidatePath("/client/services");
  return { ok: true };
}

export async function updateServiceStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as ServiceStatus;
  const clientNotes = String(formData.get("clientNotes") || "");
  const internalNotes = String(formData.get("internalNotes") || "");
  await prisma.clientService.update({
    where: { id },
    data: { status, clientNotes, internalNotes },
  });
  await prisma.serviceHistory.create({
    data: {
      clientServiceId: id,
      status,
      note: clientNotes,
      changedByAdminId: admin.id,
    },
  });
  revalidatePath("/admin/services");
  revalidatePath("/client/services");
}

export async function updateEnquiryStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as EnquiryStatus;
  await prisma.enquiry.update({ where: { id }, data: { status } });
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "ENQUIRY_UPDATED", details: status });
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiryAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  await prisma.enquiry.delete({ where: { id } });
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "ENQUIRY_DELETED", details: id });
  revalidatePath("/admin/enquiries");
}

export async function saveWebsiteSettingsAction(_prev: unknown, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = websiteSettingsSchema.safeParse({
    websiteName: formData.get("websiteName"),
    tagline: formData.get("tagline"),
    subBrand: formData.get("subBrand"),
    contactPhone: formData.get("contactPhone"),
    whatsappNumber: formData.get("whatsappNumber"),
    email: formData.get("email"),
    address: formData.get("address"),
    websiteUrl: formData.get("websiteUrl"),
    footerText: formData.get("footerText"),
    googleReviewsUrl: formData.get("googleReviewsUrl"),
    googleReviewCount: formData.get("googleReviewCount"),
    mapsEmbedUrl: formData.get("mapsEmbedUrl"),
    mapsDirectionsUrl: formData.get("mapsDirectionsUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check the settings." };
  }
  await saveSettings(parsed.data);
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "SETTINGS_UPDATED" });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function uploadLogoAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!isCloudinaryConfigured()) {
    return { error: "Cloudinary is not configured. Add the CLOUDINARY_* environment variables." };
  }
  const file = formData.get("logo");
  if (!(file instanceof File)) return { error: "Choose a logo file." };
  const uploaded = await uploadPublicAsset(file, "fiscal-bharat/brand");
  const logoUrl =
    uploaded.secureUrl ||
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${uploaded.storageKey}`;
  await saveSettings({ logoUrl });
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "LOGO_UPDATED" });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function saveTestimonialAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "");
  const parsed = testimonialSchema.safeParse({
    quote: formData.get("quote"),
    author: formData.get("author") || undefined,
    source: formData.get("source") || undefined,
    isEnabled: formData.get("isEnabled") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid testimonial." };
  if (id) {
    await prisma.testimonial.update({ where: { id }, data: parsed.data });
  } else {
    await prisma.testimonial.create({ data: parsed.data });
  }
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "TESTIMONIAL_SAVED" });
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
  return { ok: true };
}

export async function deleteTestimonialAction(formData: FormData) {
  const admin = await requireAdmin();
  await prisma.testimonial.delete({ where: { id: String(formData.get("id") || "") } });
  await logActivity({ actorType: "ADMIN", actorId: admin.id, action: "TESTIMONIAL_DELETED" });
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
}

export async function toggleTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const isEnabled = String(formData.get("isEnabled") || "") === "true";
  await prisma.testimonial.update({ where: { id }, data: { isEnabled: !isEnabled } });
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
}
