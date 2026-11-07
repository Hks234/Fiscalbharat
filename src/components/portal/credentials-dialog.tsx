"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CredentialsResult({
  clientId,
  password,
  name,
}: {
  clientId: string;
  password: string;
  name: string;
}) {
  const [copied, setCopied] = useState("");
  async function copy(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
  }

  return (
    <div className="mt-4 rounded-xl border border-[#C6A15B]/40 bg-[#fffaf0] p-4 text-sm">
      <p className="font-medium text-[#101D36]">Credentials for {name}</p>
      <p className="mt-2">Client ID: {clientId}</p>
      <p>Temporary password: {password}</p>
      <p className="mt-2 text-xs text-slate-600">
        This password is shown only once. It is not stored in plain text.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => copy(clientId, "id")}>
          Copy Client ID
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => copy(password, "password")}>
          Copy Password
        </Button>
        <Button
          type="button"
          size="sm"
          variant="gold"
          onClick={() => copy(`Client ID: ${clientId}\nPassword: ${password}`, "both")}
        >
          Copy Both
        </Button>
      </div>
      {copied ? <p className="mt-2 text-xs text-emerald-700">Copied {copied}.</p> : null}
    </div>
  );
}
