import Link from "next/link";
import { redirect } from "next/navigation";
import { clientLogin } from "@/app/actions/auth";
import { LoginForm } from "@/components/auth/login-form";
import { BrandLogo } from "@/components/brand/logo";
import { getClientUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { toWhatsAppLink } from "@/lib/utils";

export default async function ClientLoginPage() {
  const [settings, user] = await Promise.all([getSettings(), getClientUser()]);
  if (user) redirect("/client/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <BrandLogo settings={settings} />
        <h1 className="mt-6 font-serif text-3xl text-[#101D36]">Client Portal</h1>
        <p className="mt-2 mb-6 text-sm text-slate-600">
          Sign in with the Client ID issued by Fiscal Bharat.
        </p>
        <LoginForm
          action={clientLogin}
          identifierLabel="Client ID"
          footer={
            <p className="text-center text-sm text-slate-600">
              Forgot password?{" "}
              <a className="text-[#174A83]" href={toWhatsAppLink(settings.whatsappNumber, "I need help accessing my Fiscal Bharat client portal.")}>
                Contact Admin
              </a>
            </p>
          }
        />
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-[#174A83]">
            Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
