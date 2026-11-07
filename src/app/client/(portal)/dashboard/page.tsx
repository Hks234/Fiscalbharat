import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function ClientDashboardPage() {
  const client = await requireClient();
  const [documentCount, recentDocuments, recentActivity, services] = await Promise.all([
    prisma.document.count({ where: { clientId: client.id } }),
    prisma.document.findMany({
      where: { clientId: client.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.activityLog.findMany({
      where: { actorType: "CLIENT", actorId: client.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.clientService.count({ where: { clientId: client.id } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">Welcome, {client.name}</h1>
        <p className="mt-1 text-slate-600">Your secure Fiscal Bharat client workspace.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Client ID</CardTitle>
          </CardHeader>
          <CardContent className="font-medium">{client.clientId}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Mobile</CardTitle>
          </CardHeader>
          <CardContent className="font-medium">{client.mobile}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Documents</CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl text-[#174A83]">{documentCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Assigned services</CardTitle>
          </CardHeader>
          <CardContent className="font-serif text-3xl text-[#174A83]">{services}</CardContent>
        </Card>
      </div>
      <p className="text-sm text-slate-500">Account created {formatDate(client.createdAt)}</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {recentDocuments.length === 0 ? (
              <p className="text-slate-500">No documents have been uploaded for you yet.</p>
            ) : (
              recentDocuments.map((doc) => (
                <div key={doc.id} className="flex justify-between border-b border-[#f0f3f8] pb-2">
                  <span>
                    {doc.documentName}
                    <span className="block text-slate-500">{doc.category.name}</span>
                  </span>
                  <span className="text-slate-500">{formatDate(doc.createdAt)}</span>
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
              <p className="text-slate-500">No recent activity recorded.</p>
            ) : (
              recentActivity.map((item) => (
                <p key={item.id} className="border-b border-[#f0f3f8] pb-2">
                  {item.action.replaceAll("_", " ")} · {formatDateTime(item.createdAt)}
                </p>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
