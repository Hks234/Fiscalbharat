import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">Website settings</h1>
        <p className="mt-1 text-slate-600">
          These values are stored in MySQL and used across the public website and both portals.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
