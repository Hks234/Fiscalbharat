import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { DashboardCharts } from "@/components/admin/dashboard-charts";

export default async function AdminDashboardPage() {
  const [
    totalClients,
    totalDocuments,
    totalEnquiries,
    activeServices,
    pendingServices,
    recentClients,
    recentActivity,
    enquiryGroups,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.document.count(),
    prisma.enquiry.count(),
    prisma.clientService.count({ where: { status: { not: "COMPLETED" } } }),
    prisma.clientService.count({ where: { status: "PENDING" } }),
    prisma.client.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.enquiry.groupBy({ by: ["status"], _count: true }),
  ]);

  const stats = [
    ["Total Clients", totalClients],
    ["Total Documents", totalDocuments],
    ["Total Enquiries", totalEnquiries],
    ["Active Services", activeServices],
    ["Pending Services", pendingServices],
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">Admin Dashboard</h1>
        <p className="mt-1 text-slate-600">Live practice overview from your Fiscal Bharat database.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
            </CardHeader>
            <CardContent className="font-serif text-3xl text-[#174A83]">{value}</CardContent>
          </Card>
        ))}
      </div>
      <DashboardCharts
        enquiryData={enquiryGroups.map((row) => ({ status: row.status, count: row._count }))}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recently added clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {recentClients.length === 0 ? (
              <p className="text-slate-500">No clients yet.</p>
            ) : (
              recentClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between border-b border-[#f0f3f8] pb-2">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-slate-500">{client.clientId}</p>
                  </div>
                  <p className="text-slate-500">{formatDateTime(client.createdAt)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {recentActivity.length === 0 ? (
              <p className="text-slate-500">No activity yet.</p>
            ) : (
              recentActivity.map((item) => (
                <div key={item.id} className="border-b border-[#f0f3f8] pb-2">
                  <p className="font-medium">{item.action.replaceAll("_", " ")}</p>
                  <p className="text-slate-500">
                    {item.details || "—"} · {formatDateTime(item.createdAt)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
