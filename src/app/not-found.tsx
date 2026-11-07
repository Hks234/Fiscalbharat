import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F7FA] px-4 text-center">
      <h1 className="font-serif text-5xl text-[#101D36]">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-600">
        The page you requested is not available. Return to the Fiscal Bharat website to continue.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
