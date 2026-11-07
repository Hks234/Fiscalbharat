"use client";

import { useActionState } from "react";
import { uploadDocumentAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function UploadDocumentForm({
  clients,
  categories,
}: {
  clients: { id: string; name: string; clientId: string }[];
  categories: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(uploadDocumentAction, null);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="clientId">Client</Label>
        <select
          id="clientId"
          name="clientId"
          required
          className="h-10 w-full rounded-md border border-[#d6dde8] bg-white px-3 text-sm"
        >
          <option value="">Select client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.clientId})
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="documentName">Document name</Label>
        <Input id="documentName" name="documentName" required placeholder="GST Registration Certificate" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoryName">Category</Label>
        <Input
          id="categoryName"
          name="categoryName"
          required
          list="category-options"
          placeholder="GST Documents"
        />
        <datalist id="category-options">
          {categories.map((category) => (
            <option key={category.id} value={category.name} />
          ))}
        </datalist>
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input id="file" name="file" type="file" required />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" name="description" />
      </div>
      {state && "error" in state && state.error ? (
        <p className="text-sm text-red-700 md:col-span-2">{state.error}</p>
      ) : null}
      {state && "ok" in state && state.ok ? (
        <p className="text-sm text-emerald-700 md:col-span-2">Document uploaded.</p>
      ) : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Uploading..." : "Upload Document"}
        </Button>
      </div>
    </form>
  );
}
