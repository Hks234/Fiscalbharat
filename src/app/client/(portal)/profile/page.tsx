import { changeClientPassword } from "@/app/actions/auth";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireClient } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default async function ClientProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const client = await requireClient();
  const { setup } = await searchParams;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">My Profile</h1>
        {setup ? (
          <p className="mt-2 text-amber-800">Please change your temporary password to continue.</p>
        ) : null}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-slate-500">Name:</span> {client.name}
          </p>
          <p>
            <span className="text-slate-500">Client ID:</span> {client.clientId}
          </p>
          <p>
            <span className="text-slate-500">Mobile:</span> {client.mobile}
          </p>
          <p>
            <span className="text-slate-500">Account created:</span> {formatDate(client.createdAt)}
          </p>
          <p className="text-xs text-slate-500">Client ID cannot be changed.</p>
        </CardContent>
      </Card>
      <Card id="password">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm action={changeClientPassword} />
        </CardContent>
      </Card>
    </div>
  );
}
