import { deleteEnquiryAction, updateEnquiryStatusAction } from "@/app/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ENQUIRY_STATUS_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import type { EnquiryStatus } from "@prisma/client";

const statuses: EnquiryStatus[] = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">Enquiries</h1>
        <p className="mt-1 text-slate-600">Messages submitted from the public contact form.</p>
      </div>
      {enquiries.length === 0 ? (
        <p className="text-sm text-slate-500">No enquiries yet.</p>
      ) : (
        enquiries.map((enquiry) => (
          <Card key={enquiry.id}>
            <CardContent className="space-y-3 pt-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{enquiry.name}</p>
                  <p className="text-sm text-slate-500">
                    {enquiry.mobile} · {enquiry.email}
                  </p>
                </div>
                <Badge tone={enquiry.status === "NEW" ? "gold" : "navy"}>
                  {ENQUIRY_STATUS_LABELS[enquiry.status]}
                </Badge>
              </div>
              <p className="text-sm">
                <span className="font-medium">Service:</span> {enquiry.service}
              </p>
              <p className="text-sm leading-6 text-slate-700">{enquiry.message}</p>
              <p className="text-xs text-slate-500">{formatDateTime(enquiry.createdAt)}</p>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <form action={updateEnquiryStatusAction} key={status}>
                    <input type="hidden" name="id" value={enquiry.id} />
                    <input type="hidden" name="status" value={status} />
                    <Button type="submit" size="sm" variant="outline">
                      Mark {ENQUIRY_STATUS_LABELS[status].toLowerCase()}
                    </Button>
                  </form>
                ))}
                <form action={deleteEnquiryAction}>
                  <input type="hidden" name="id" value={enquiry.id} />
                  <Button type="submit" size="sm" variant="destructive">
                    Delete
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
