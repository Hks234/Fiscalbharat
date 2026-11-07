"use client";

import { useActionState } from "react";
import { createClientAction } from "@/app/actions/admin";
import { CredentialsResult } from "@/components/portal/credentials-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateClientForm() {
  const [state, action, pending] = useActionState(createClientAction, null);

  return (
    <div>
      <form action={action} className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile number</Label>
          <Input id="mobile" name="mobile" required />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create Client"}
          </Button>
        </div>
      </form>
      {state && "error" in state && state.error ? (
        <p className="mt-3 text-sm text-red-700">{state.error}</p>
      ) : null}
      {state && "clientId" in state && state.clientId && state.password && state.name ? (
        <CredentialsResult clientId={state.clientId} password={state.password} name={state.name} />
      ) : null}
    </div>
  );
}
