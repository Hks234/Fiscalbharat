"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State = { error?: string; ok?: boolean } | null;

export function ChangePasswordForm({
  action,
  submitLabel = "Update password",
}: {
  action: (state: State, formData: FormData) => Promise<{ error?: string; ok?: boolean }>;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input id="newPassword" name="newPassword" type="password" required />
        <p className="text-xs text-slate-500">
          At least 10 characters, with uppercase, lowercase, number and special character.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state?.ok ? <p className="text-sm text-emerald-700">Password updated.</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
