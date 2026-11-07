"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  action,
  identifierLabel,
  footer,
}: {
  action: (state: { error?: string } | null, formData: FormData) => Promise<{ error?: string }>;
  identifierLabel: string;
  footer?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">{identifierLabel}</Label>
        <Input id="identifier" name="identifier" autoComplete="username" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Login"}
      </Button>
      {footer}
    </form>
  );
}
