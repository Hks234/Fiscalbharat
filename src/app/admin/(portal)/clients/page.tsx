import { CreateClientForm } from "@/components/admin/create-client-form";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";
import { ActionForm } from "@/components/forms/action-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deleteClientAction, toggleClientAction, updateClientAction } from "@/app/actions/admin";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const clients = await prisma.client.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { mobile: { contains: q } },
            { clientId: { contains: q } },
          ],
        }
      : undefined,
    include: {
      _count: { select: { documents: true, services: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">Clients</h1>
        <p className="mt-1 text-slate-600">Create accounts using only a name and mobile number.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add client</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateClientForm />
        </CardContent>
      </Card>
      <form className="flex gap-2">
        <Input name="q" defaultValue={q} placeholder="Search by name, mobile or Client ID" />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>
      <div className="space-y-4">
        {clients.length === 0 ? (
          <p className="text-sm text-slate-500">No clients match this search.</p>
        ) : (
          clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#101D36]">{client.name}</p>
                    <p className="text-sm text-slate-500">
                      {client.clientId} · {client.mobile}
                    </p>
                    <p className="text-xs text-slate-500">Created {formatDate(client.createdAt)}</p>
                  </div>
                  <Badge tone={client.isActive ? "green" : "red"}>
                    {client.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">
                  {client._count.documents} documents · {client._count.services} services
                </p>
                <ActionForm action={updateClientAction} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" successMessage="Client updated.">
                  <input type="hidden" name="id" value={client.id} />
                  <Input name="name" defaultValue={client.name} />
                  <Input name="mobile" defaultValue={client.mobile} />
                  <Button type="submit" variant="outline">
                    Save
                  </Button>
                </ActionForm>
                <div className="flex flex-wrap gap-2">
                  <form action={toggleClientAction}>
                    <input type="hidden" name="id" value={client.id} />
                    <input type="hidden" name="isActive" value={String(client.isActive)} />
                    <Button type="submit" size="sm" variant="outline">
                      {client.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </form>
                  <Button asChild size="sm" variant="ghost">
                    <a href={`/admin/documents?clientId=${client.id}`}>View documents</a>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <a href={`/admin/services?clientId=${client.id}`}>View services</a>
                  </Button>
                </div>
                <ResetPasswordForm clientDbId={client.id} />
                <ActionForm action={deleteClientAction} className="rounded-xl border border-red-100 p-3" successMessage="Client deleted.">
                  <input type="hidden" name="id" value={client.id} />
                  <p className="mb-2 text-xs text-red-700">
                    Type DELETE to remove this client and associated documents.
                  </p>
                  <div className="flex gap-2">
                    <Input name="confirm" placeholder="DELETE" />
                    <Button type="submit" variant="destructive">
                      Delete client
                    </Button>
                  </div>
                </ActionForm>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
