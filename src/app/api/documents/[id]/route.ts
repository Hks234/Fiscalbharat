import { NextRequest, NextResponse } from "next/server";
import { getAdminUser, getClientUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signedFileUrl, signedPreviewUrl } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const [admin, client] = await Promise.all([getAdminUser(), getClientUser()]);
  if (!admin && !client) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (client && client.role === "CLIENT" && document.clientId !== client.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const mode = request.nextUrl.searchParams.get("mode") === "preview" ? "preview" : "download";
  try {
    const url =
      mode === "preview"
        ? signedPreviewUrl(document.storageKey)
        : signedFileUrl(document.storageKey, document.fileName);
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create a secure file URL.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
