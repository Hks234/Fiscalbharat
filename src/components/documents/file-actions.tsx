import { Button } from "@/components/ui/button";

export function FileActions({
  documentId,
  fileType,
}: {
  documentId: string;
  fileType: string;
}) {
  const previewable =
    fileType.includes("pdf") || fileType.startsWith("image/");

  return (
    <div className="flex flex-wrap gap-2">
      {previewable ? (
        <Button asChild size="sm" variant="outline">
          <a href={`/api/documents/${documentId}?mode=preview`} target="_blank" rel="noreferrer">
            Preview
          </a>
        </Button>
      ) : null}
      <Button asChild size="sm">
        <a href={`/api/documents/${documentId}?mode=download`}>Download</a>
      </Button>
    </div>
  );
}
