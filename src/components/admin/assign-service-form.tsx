import { assignServiceAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/forms/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AssignServiceForm({
  clients,
  services,
}: {
  clients: { id: string; name: string; clientId: string }[];
  services: { id: string; name: string }[];
}) {
  return (
    <ActionForm action={assignServiceAction} className="grid gap-4 md:grid-cols-2" successMessage="Service assigned.">
      <div className="space-y-2">
        <Label htmlFor="clientId">Client</Label>
        <select
          id="clientId"
          name="clientId"
          required
          className="h-10 w-full rounded-md border border-[#d6dde8] bg-white px-3 text-sm"
        >
          <option value="">Select client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.clientId})
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="serviceName">Service name</Label>
        <Input id="serviceName" name="serviceName" list="service-options" required />
        <datalist id="service-options">
          {services.map((service) => (
            <option key={service.id} value={service.name} />
          ))}
        </datalist>
      </div>
      <div className="space-y-2">
        <Label htmlFor="clientNotes">Client-visible notes</Label>
        <Textarea id="clientNotes" name="clientNotes" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="internalNotes">Internal notes</Label>
        <Textarea id="internalNotes" name="internalNotes" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit">Assign service</Button>
      </div>
    </ActionForm>
  );
}
