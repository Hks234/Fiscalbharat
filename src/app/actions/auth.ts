"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import {
  createSession,
  destroyAllSessions,
  destroyCurrentSession,
  getAdminUser,
  getClientUser,
  isLoginRateLimited,
  logActivity,
  recordLoginAttempt,
  requireAdmin,
  requireClient,
} from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema, loginSchema } from "@/lib/validation";

export async function adminLogin(_prev: { error?: string } | null, formData: FormData) {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid login details." };
  }

  const { identifier, password } = parsed.data;
  if (await isLoginRateLimited(identifier.toLowerCase())) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }

  const admin = await prisma.admin.findUnique({
    where: { username: identifier },
  });
  const valid = admin ? await verifyPassword(password, admin.passwordHash) : false;
  await recordLoginAttempt({
    identifier: identifier.toLowerCase(),
    success: Boolean(admin && valid && admin.isActive),
    role: "ADMIN",
    userId: admin?.id,
  });

  if (!admin || !valid || !admin.isActive) {
    return { error: "Invalid username or password." };
  }

  await createSession("ADMIN", admin.id);
  await logActivity({
    actorType: "ADMIN",
    actorId: admin.id,
    action: "ADMIN_LOGIN",
  });
  redirect(admin.mustChangePassword ? "/admin/account?setup=1" : "/admin/dashboard");
}

export async function clientLogin(_prev: { error?: string } | null, formData: FormData) {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid login details." };
  }

  const { identifier, password } = parsed.data;
  if (await isLoginRateLimited(identifier.toUpperCase())) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }

  const client = await prisma.client.findUnique({
    where: { clientId: identifier.toUpperCase() },
  });
  const valid = client ? await verifyPassword(password, client.passwordHash) : false;
  await recordLoginAttempt({
    identifier: identifier.toUpperCase(),
    success: Boolean(client && valid && client.isActive),
    role: "CLIENT",
    userId: client?.id,
  });

  if (!client || !valid || !client.isActive) {
    return { error: "Invalid Client ID or password." };
  }

  await createSession("CLIENT", client.id);
  await logActivity({
    actorType: "CLIENT",
    actorId: client.id,
    action: "CLIENT_LOGIN",
  });
  redirect(client.mustChangePassword ? "/client/profile?setup=1" : "/client/dashboard");
}

export async function adminLogout() {
  const user = await getAdminUser();
  if (user) {
    await destroyCurrentSession("ADMIN");
  }
  redirect("/admin/login");
}

export async function clientLogout() {
  const user = await getClientUser();
  if (user) {
    await destroyCurrentSession("CLIENT");
  }
  redirect("/client/login");
}

export async function changeAdminPassword(_prev: { error?: string; ok?: boolean } | null, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check the form." };
  }
  const record = await prisma.admin.findUnique({ where: { id: admin.id } });
  if (!record || !(await verifyPassword(parsed.data.currentPassword, record.passwordHash))) {
    return { error: "Current password is incorrect." };
  }
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      passwordHash: await hashPassword(parsed.data.newPassword),
      mustChangePassword: false,
    },
  });
  await logActivity({
    actorType: "ADMIN",
    actorId: admin.id,
    action: "ADMIN_PASSWORD_CHANGED",
  });
  return { ok: true };
}

export async function changeAdminUsername(formData: FormData) {
  const admin = await requireAdmin();
  const username = String(formData.get("username") || "").trim();
  if (username.length < 4) {
    return { error: "Username must be at least 4 characters." };
  }
  try {
    await prisma.admin.update({
      where: { id: admin.id },
      data: { username },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "That username is already in use." };
    }
    throw error;
  }
  await logActivity({
    actorType: "ADMIN",
    actorId: admin.id,
    action: "ADMIN_USERNAME_CHANGED",
  });
  return { ok: true };
}

export async function logoutAllAdminSessions() {
  const admin = await requireAdmin();
  await destroyAllSessions("ADMIN", admin.id);
  await logActivity({
    actorType: "ADMIN",
    actorId: admin.id,
    action: "ADMIN_LOGOUT_ALL_SESSIONS",
  });
  redirect("/admin/login");
}

export async function changeClientPassword(_prev: { error?: string; ok?: boolean } | null, formData: FormData) {
  const client = await requireClient();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check the form." };
  }
  const record = await prisma.client.findUnique({ where: { id: client.id } });
  if (!record || !(await verifyPassword(parsed.data.currentPassword, record.passwordHash))) {
    return { error: "Current password is incorrect." };
  }
  await prisma.client.update({
    where: { id: client.id },
    data: {
      passwordHash: await hashPassword(parsed.data.newPassword),
      mustChangePassword: false,
    },
  });
  return { ok: true };
}
