"use client";

import { useState } from "react";
import { resetClientPasswordAction } from "@/app/actions/admin";
import { CredentialsResult } from "@/components/portal/credentials-dialog";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm({ clientDbId }: { clientDbId: string }) {
  const [result, setResult] = useState<{ clientId: string; password: string; name: string } | null>(null);

  return (
    <div>
      <form
        action={async (formData) => {
          const data = await resetClientPasswordAction(formData);
          if (data && "password" in data && data.password) setResult(data);
        }}
      >
        <input type="hidden" name="id" value={clientDbId} />
        <Button type="submit" size="sm" variant="outline">
          Reset password
        </Button>
      </form>
      {result ? <CredentialsResult {...result} /> : null}
    </div>
  );
}
