import {
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  Users,
  Briefcase,
  Quote,
} from "lucide-react";
import { adminLogout } from "@/app/actions/auth";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { PortalSidebar } from "@/components/portal/sidebar";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export default async function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const [admin, settings] = await Promise.all([requireAdmin(), getSettings()]);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <PortalSidebar
        settings={settings}
        items={[
          { href: "/admin/dashboard", label: "Overview", icon: <LayoutDashboard size={16} /> },
          { href: "/admin/clients", label: "Clients", icon: <Users size={16} /> },
          { href: "/admin/documents", label: "Documents", icon: <FileText size={16} /> },
          { href: "/admin/services", label: "Services", icon: <Briefcase size={16} /> },
          { href: "/admin/enquiries", label: "Enquiries", icon: <MessageSquare size={16} /> },
          { href: "/admin/testimonials", label: "Testimonials", icon: <Quote size={16} /> },
          { href: "/admin/settings", label: "Settings", icon: <Settings size={16} /> },
          { href: "/admin/account", label: "Account", icon: <Shield size={16} /> },
        ]}
        footer={
          <form action={adminLogout}>
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
          <p className="text-sm text-slate-600">
            Signed in as <span className="font-medium text-[#101D36]">{admin.username}</span>
          </p>
        </header>
        {admin.mustChangePassword ? (
          <div className="bg-amber-50 px-4 py-3 text-sm text-amber-900 md:px-8">
            Please change the initial administrator password in{" "}
            <a className="underline" href="/admin/account?setup=1">
              Account settings
            </a>{" "}
            before continuing.
          </div>
        ) : null}
        <div className="flex-1 px-4 py-6 pb-24 md:px-8">{children}</div>
      </div>
    </div>
  );
}
