import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICE_STATUS_LABELS } from "@/lib/constants";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function ClientServicesPage() {
  const client = await requireClient();
  const assignments = await prisma.clientService.findMany({
    where: { clientId: client.id },
    include: { service: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">My Services</h1>
        <p className="mt-1 text-slate-600">Status updates are managed by the Fiscal Bharat team.</p>
      </div>
      {assignments.length === 0 ? (
        <p className="text-sm text-slate-500">No services have been assigned yet.</p>
      ) : (
        assignments.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-3 pt-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.service.name}</p>
                  <p className="text-xs text-slate-500">Assigned {formatDate(item.assignedAt)}</p>
                </div>
                <Badge>{SERVICE_STATUS_LABELS[item.status]}</Badge>
              </div>
              {item.service.description ? (
                <p className="text-sm text-slate-600">{item.service.description}</p>
              ) : null}
              {item.clientNotes ? (
                <p className="rounded-xl bg-[#F5F7FA] p-3 text-sm">{item.clientNotes}</p>
              ) : null}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
