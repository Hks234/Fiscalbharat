import {
  deleteDocumentAction,
  renameDocumentAction,
  replaceDocumentAction,
} from "@/app/actions/admin";
import { UploadDocumentForm } from "@/components/admin/upload-document-form";
import { ActionForm } from "@/components/forms/action-form";
import { FileActions } from "@/components/documents/file-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { formatBytes, formatDateTime } from "@/lib/utils";

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; clientId?: string; categoryId?: string }>;
}) {
  const { q = "", clientId = "", categoryId = "" } = await searchParams;
  const [clients, categories, documents] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.documentCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.document.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [{ documentName: { contains: q } }, { fileName: { contains: q } }],
              }
            : {},
          clientId ? { clientId } : {},
          categoryId ? { categoryId } : {},
        ],
      },
      include: { client: true, category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">Documents</h1>
        <p className="mt-1 text-slate-600">
          Files are stored in Cloudinary. Metadata is saved in TiDB and shown only to the assigned client.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upload document</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadDocumentForm clients={clients} categories={categories} />
        </CardContent>
      </Card>
      <form className="grid gap-3 md:grid-cols-4">
        <Input name="q" defaultValue={q} placeholder="Search documents" />
        <select
          name="clientId"
          defaultValue={clientId}
          className="h-10 rounded-md border border-[#d6dde8] bg-white px-3 text-sm"
        >
          <option value="">All clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <select
          name="categoryId"
          defaultValue={categoryId}
          className="h-10 rounded-md border border-[#d6dde8] bg-white px-3 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>
      <div className="space-y-4">
        {documents.length === 0 ? (
          <p className="text-sm text-slate-500">No documents uploaded yet.</p>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{doc.documentName}</p>
                    <p className="text-sm text-slate-500">
                      {doc.client.name} · {doc.category.name} · {doc.fileType} · {formatBytes(doc.fileSize)}
                    </p>
                    <p className="text-xs text-slate-500">{formatDateTime(doc.createdAt)}</p>
                    {doc.description ? <p className="mt-2 text-sm">{doc.description}</p> : null}
                  </div>
                  <FileActions documentId={doc.id} fileType={doc.fileType} />
                </div>
                <ActionForm action={renameDocumentAction} className="flex gap-2" successMessage="Document renamed.">
                  <input type="hidden" name="id" value={doc.id} />
                  <Input name="documentName" defaultValue={doc.documentName} />
                  <Button type="submit" variant="outline">
                    Rename
                  </Button>
                </ActionForm>
                <ActionForm action={replaceDocumentAction} className="flex gap-2" successMessage="Document replaced.">
                  <input type="hidden" name="id" value={doc.id} />
                  <Input name="file" type="file" required />
                  <Button type="submit" variant="outline">
                    Replace
                  </Button>
                </ActionForm>
                <ActionForm action={deleteDocumentAction} successMessage="Document deleted.">
                  <input type="hidden" name="id" value={doc.id} />
                  <Button type="submit" variant="destructive" size="sm">
                    Delete
                  </Button>
                </ActionForm>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
