"use client";

import { useActionState } from "react";
import { submitEnquiry } from "@/app/actions/public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SERVICES = [
  "Tax Solutions",
  "Business Advisory & Accounting",
  "Wealth & Corporate Services",
  "Loans & Financing",
  "General Enquiry",
];

export function ContactForm() {
  const [state, action, pending] = useActionState(submitEnquiry, null);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile number</Label>
          <Input id="mobile" name="mobile" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="service">Service required</Label>
        <select
          id="service"
          name="service"
          className="h-10 w-full rounded-md border border-[#d6dde8] bg-white px-3 text-sm"
          required
        >
          <option value="">Select a service</option>
          {SERVICES.map((service) => (
            <option key={service}>{service}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required />
      </div>
      {state ? (
        <p className={state.ok ? "text-sm text-emerald-700" : "text-sm text-red-700"}>{state.message}</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Submit Enquiry"}
      </Button>
    </form>
  );
}
