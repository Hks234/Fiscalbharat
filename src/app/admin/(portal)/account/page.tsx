import { changeAdminUsername, logoutAllAdminSessions, changeAdminPassword } from "@/app/actions/auth";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { ActionForm } from "@/components/forms/action-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function AdminAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const admin = await requireAdmin();
  const { setup } = await searchParams;
  const activity = await prisma.loginActivity.findMany({
    where: { role: "ADMIN", userId: admin.id },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">Admin account</h1>
        {setup ? (
          <p className="mt-2 text-amber-800">
            First login detected. Change the initial password before using the rest of the portal.
          </p>
        ) : null}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Change username</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionForm action={changeAdminUsername} className="flex max-w-md gap-3" successMessage="Username updated.">
            <div className="flex-1 space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" defaultValue={admin.username} required />
            </div>
            <div className="flex items-end">
              <Button type="submit">Save</Button>
            </div>
          </ActionForm>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm action={changeAdminPassword} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={logoutAllAdminSessions}>
            <Button type="submit" variant="destructive">
              Logout from all sessions
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent login activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {activity.map((item) => (
            <p key={item.id} className="border-b border-[#f0f3f8] pb-2">
              {item.success ? "Successful" : "Failed"} · {item.ipAddress || "unknown IP"} ·{" "}
              {formatDateTime(item.createdAt)}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
