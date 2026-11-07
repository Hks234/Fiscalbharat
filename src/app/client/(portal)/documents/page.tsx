import { FileActions } from "@/components/documents/file-actions";
import { Card, CardContent } from "@/components/ui/card";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatBytes, formatDateTime } from "@/lib/utils";

export default async function ClientDocumentsPage() {
  const client = await requireClient();
  const documents = await prisma.document.findMany({
    where: { clientId: client.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">My Documents</h1>
        <p className="mt-1 text-slate-600">Only files assigned to your account are listed here.</p>
      </div>
      {documents.length === 0 ? (
        <p className="text-sm text-slate-500">No documents are available yet.</p>
      ) : (
        documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
              <div>
                <p className="font-medium">{doc.documentName}</p>
                <p className="text-sm text-slate-500">
                  {doc.category.name} · {doc.fileType} · {formatBytes(doc.fileSize)}
                </p>
                <p className="text-xs text-slate-500">{formatDateTime(doc.createdAt)}</p>
                {doc.description ? <p className="mt-2 text-sm">{doc.description}</p> : null}
              </div>
              <FileActions documentId={doc.id} fileType={doc.fileType} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
