"use client";

import { toast } from "sonner";

type ActionResult = { error?: string; ok?: boolean } | void | null;

export function ActionForm({
  action,
  className,
  children,
  successMessage,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  className?: string;
  children: React.ReactNode;
  successMessage?: string;
}) {
  return (
    <form
      className={className}
      action={async (formData) => {
        const result = await action(formData);
        if (result && result.error) {
          toast.error(result.error);
          return;
        }
        if (successMessage) {
          toast.success(successMessage);
        }
      }}
    >
      {children}
    </form>
  );
}
