import { updateServiceStatusAction } from "@/app/actions/admin";
import { AssignServiceForm } from "@/components/admin/assign-service-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import type { ServiceStatus } from "@prisma/client";

const statuses: ServiceStatus[] = ["PENDING", "IN_PROGRESS", "DOCUMENTS_REQUIRED", "COMPLETED"];

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId = "" } = await searchParams;
  const [clients, services, assignments] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.service.findMany({ orderBy: { name: "asc" } }),
    prisma.clientService.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: true,
        service: true,
        history: { orderBy: { createdAt: "desc" }, take: 5 },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">Services</h1>
        <p className="mt-1 text-slate-600">Assign work, update status and keep client-visible notes separate from internal notes.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Assign a service</CardTitle>
        </CardHeader>
        <CardContent>
          <AssignServiceForm clients={clients} services={services} />
        </CardContent>
      </Card>
      <div className="space-y-4">
        {assignments.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.service.name}</p>
                  <p className="text-sm text-slate-500">
                    {item.client.name} · {item.client.clientId}
                  </p>
                </div>
                <Badge>{SERVICE_STATUS_LABELS[item.status]}</Badge>
              </div>
              <form action={updateServiceStatusAction} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={item.id} />
                <select
                  name="status"
                  defaultValue={item.status}
                  className="h-10 rounded-md border border-[#d6dde8] bg-white px-3 text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {SERVICE_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
                <div />
                <Textarea name="clientNotes" defaultValue={item.clientNotes || ""} placeholder="Client-visible notes" />
                <Textarea name="internalNotes" defaultValue={item.internalNotes || ""} placeholder="Internal notes" />
                <div className="md:col-span-2">
                  <Button type="submit">Update service</Button>
                </div>
              </form>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">History</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {item.history.map((entry) => (
                    <li key={entry.id}>
                      {SERVICE_STATUS_LABELS[entry.status]} · {formatDateTime(entry.createdAt)}
                      {entry.note ? ` · ${entry.note}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
