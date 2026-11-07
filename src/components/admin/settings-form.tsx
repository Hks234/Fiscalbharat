"use client";

import { useActionState } from "react";
import { saveWebsiteSettingsAction, uploadLogoAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/forms/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettings } from "@/lib/settings";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveWebsiteSettingsAction, null);

  return (
    <div className="space-y-10">
      <ActionForm action={uploadLogoAction} className="space-y-3 rounded-2xl border border-[#e4eaf3] p-5" successMessage="Logo updated.">
        <Label htmlFor="logo">Company logo</Label>
        <Input id="logo" name="logo" type="file" accept="image/*" required />
        <p className="text-xs text-slate-500">
          The uploaded logo is stored in Cloudinary and used on the website, portals and favicon.
        </p>
        <Button type="submit" variant="outline">
          Upload / replace logo
        </Button>
      </ActionForm>
      <form action={action} className="grid gap-4 md:grid-cols-2">
        {(
          [
            ["websiteName", "Website name", settings.websiteName],
            ["subBrand", "Sub-brand", settings.subBrand],
            ["contactPhone", "Contact number", settings.contactPhone],
            ["whatsappNumber", "WhatsApp number", settings.whatsappNumber],
            ["email", "Email", settings.email],
            ["websiteUrl", "Website URL", settings.websiteUrl],
            ["googleReviewsUrl", "Google Reviews URL", settings.googleReviewsUrl],
            ["googleReviewCount", "Google review count", settings.googleReviewCount],
          ] as const
        ).map(([name, label, value]) => (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} defaultValue={value} required />
          </div>
        ))}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" name="tagline" defaultValue={settings.tagline} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" name="address" defaultValue={settings.address} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="footerText">Footer information</Label>
          <Textarea id="footerText" name="footerText" defaultValue={settings.footerText} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mapsEmbedUrl">Maps embed URL</Label>
          <Input id="mapsEmbedUrl" name="mapsEmbedUrl" defaultValue={settings.mapsEmbedUrl} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mapsDirectionsUrl">Maps directions URL</Label>
          <Input id="mapsDirectionsUrl" name="mapsDirectionsUrl" defaultValue={settings.mapsDirectionsUrl} required />
        </div>
        {state && "error" in state && state.error ? (
          <p className="text-sm text-red-700 md:col-span-2">{state.error}</p>
        ) : null}
        {state && "ok" in state && state.ok ? (
          <p className="text-sm text-emerald-700 md:col-span-2">Settings saved.</p>
        ) : null}
        <div className="md:col-span-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
