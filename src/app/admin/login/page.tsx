import { redirect } from "next/navigation";
import { adminLogin } from "@/app/actions/auth";
import { LoginForm } from "@/components/auth/login-form";
import { BrandLogo } from "@/components/brand/logo";
import { getAdminUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export default async function AdminLoginPage() {
  const [settings, user] = await Promise.all([getSettings(), getAdminUser()]);
  if (user) redirect("/admin/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101D36] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <BrandLogo settings={settings} />
        <h1 className="mt-6 font-serif text-3xl text-[#101D36]">Admin Portal</h1>
        <p className="mt-2 mb-6 text-sm text-slate-600">
          Restricted access. Use your authorised administrator credentials.
        </p>
        <LoginForm action={adminLogin} identifierLabel="Username" />
      </div>
    </div>
  );
}
