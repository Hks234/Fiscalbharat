import { FileText, LayoutDashboard, LogOut, Briefcase, UserRound } from "lucide-react";
import { clientLogout } from "@/app/actions/auth";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { PortalSidebar } from "@/components/portal/sidebar";
import { requireClient } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const [client, settings] = await Promise.all([requireClient(), getSettings()]);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <PortalSidebar
        settings={settings}
        items={[
          { href: "/client/dashboard", label: "Overview", icon: <LayoutDashboard size={16} /> },
          { href: "/client/documents", label: "My Documents", icon: <FileText size={16} /> },
          { href: "/client/services", label: "My Services", icon: <Briefcase size={16} /> },
          { href: "/client/profile", label: "My Profile", icon: <UserRound size={16} /> },
          { href: "/client/profile#password", label: "Change Password", icon: <UserRound size={16} /> },
        ]}
        footer={
          <form action={clientLogout}>
            <Button type="submit" variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
              <LogOut size={16} /> Logout
            </Button>
          </form>
        }
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#e4eaf3] bg-white px-4 py-3 md:px-8">
          <div className="md:hidden">
            <BrandLogo settings={settings} />
          </div>
          <p className="text-sm text-slate-600">{client.name}</p>
        </header>
        {client.mustChangePassword ? (
          <div className="bg-amber-50 px-4 py-3 text-sm text-amber-900 md:px-8">
            Please set a new password in{" "}
            <a className="underline" href="/client/profile?setup=1">
              My Profile
            </a>{" "}
            before continuing.
          </div>
        ) : null}
        <div className="flex-1 px-4 py-6 pb-24 md:px-8">{children}</div>
      </div>
    </div>
  );
}
