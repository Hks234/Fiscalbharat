import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  CLIENT_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { generateSessionToken, hashSessionToken } from "@/lib/crypto";
import type { UserRole } from "@prisma/client";

export type AuthUser =
  | {
      role: "ADMIN";
      id: string;
      username: string;
      mustChangePassword: boolean;
    }
  | {
      role: "CLIENT";
      id: string;
      clientId: string;
      name: string;
      mobile: string;
      mustChangePassword: boolean;
      createdAt: Date;
    };

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function getRequestMeta() {
  const headerStore = await headers();
  return {
    ip:
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerStore.get("x-real-ip") ||
      "unknown",
    userAgent: headerStore.get("user-agent") || "unknown",
    origin: headerStore.get("origin"),
    host: headerStore.get("host"),
  };
}

export async function assertSameOrigin() {
  const { origin, host } = await getRequestMeta();
  if (!origin || !host) return;
  try {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      throw new Error("Invalid request origin.");
    }
  } catch {
    throw new Error("Invalid request origin.");
  }
}

export async function createSession(role: UserRole, userId: string) {
  const token = generateSessionToken();
  const meta = await getRequestMeta();
  await prisma.session.create({
    data: {
      tokenHash: hashSessionToken(token),
      role,
      userId,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
    },
  });
  const cookieStore = await cookies();
  cookieStore.set(role === "ADMIN" ? ADMIN_COOKIE : CLIENT_COOKIE, token, cookieOptions());
  return token;
}

export async function destroyCurrentSession(role: UserRole) {
  const cookieStore = await cookies();
  const name = role === "ADMIN" ? ADMIN_COOKIE : CLIENT_COOKIE;
  const token = cookieStore.get(name)?.value;
  if (token) {
    await prisma.session.updateMany({
      where: { tokenHash: hashSessionToken(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  cookieStore.delete(name);
}

export async function destroyAllSessions(role: UserRole, userId: string) {
  await prisma.session.updateMany({
    where: { role, userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  const cookieStore = await cookies();
  cookieStore.delete(role === "ADMIN" ? ADMIN_COOKIE : CLIENT_COOKIE);
}

async function readSession(role: UserRole): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(role === "ADMIN" ? ADMIN_COOKIE : CLIENT_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
  });
  if (
    !session ||
    session.role !== role ||
    session.revokedAt ||
    session.expiresAt.getTime() < Date.now()
  ) {
    return null;
  }

  if (role === "ADMIN") {
    const admin = await prisma.admin.findUnique({ where: { id: session.userId } });
    if (!admin || !admin.isActive) return null;
    return {
      role: "ADMIN",
      id: admin.id,
      username: admin.username,
      mustChangePassword: admin.mustChangePassword,
    };
  }

  const client = await prisma.client.findUnique({ where: { id: session.userId } });
  if (!client || !client.isActive) return null;
  return {
    role: "CLIENT",
    id: client.id,
    clientId: client.clientId,
    name: client.name,
    mobile: client.mobile,
    mustChangePassword: client.mustChangePassword,
    createdAt: client.createdAt,
  };
}

export async function getAdminUser() {
  return readSession("ADMIN");
}

export async function getClientUser() {
  return readSession("CLIENT");
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }
  return user;
}

export async function requireClient() {
  const user = await getClientUser();
  if (!user || user.role !== "CLIENT") {
    redirect("/client/login");
  }
  return user;
}

export async function logActivity(params: {
  actorType: UserRole;
  actorId: string;
  action: string;
  details?: string;
}) {
  const meta = await getRequestMeta();
  await prisma.activityLog.create({
    data: {
      ...params,
      ipAddress: meta.ip,
    },
  });
}

export async function isLoginRateLimited(identifier: string) {
  const meta = await getRequestMeta();
  const since = new Date(Date.now() - 15 * 60 * 1000);
  const failures = await prisma.loginAttempt.count({
    where: {
      identifier,
      ipAddress: meta.ip,
      success: false,
      createdAt: { gte: since },
    },
  });
  return failures >= 5;
}

export async function recordLoginAttempt(params: {
  identifier: string;
  success: boolean;
  role: UserRole;
  userId?: string;
}) {
  const meta = await getRequestMeta();
  await prisma.loginAttempt.create({
    data: {
      identifier: params.identifier,
      ipAddress: meta.ip,
      success: params.success,
    },
  });
  if (params.userId) {
    await prisma.loginActivity.create({
      data: {
        role: params.role,
        userId: params.userId,
        ipAddress: meta.ip,
        userAgent: meta.userAgent,
        success: params.success,
      },
    });
  }
}
