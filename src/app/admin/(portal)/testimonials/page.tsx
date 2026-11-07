import {
  deleteTestimonialAction,
  saveTestimonialAction,
  toggleTestimonialAction,
} from "@/app/actions/admin";
import { ActionForm } from "@/components/forms/action-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[#101D36]">Testimonials</h1>
        <p className="mt-1 text-slate-600">Publish only genuine reviews. Disabled items stay off the website.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionForm action={saveTestimonialAction} className="space-y-3" successMessage="Testimonial saved.">
            <div className="space-y-2">
              <Label htmlFor="quote">Quote</Label>
              <Textarea id="quote" name="quote" required />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author">Author (optional)</Label>
                <Input id="author" name="author" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input id="source" name="source" defaultValue="Google Reviews" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isEnabled" defaultChecked />
              Publish on website
            </label>
            <Button type="submit">Save testimonial</Button>
          </ActionForm>
        </CardContent>
      </Card>
      {testimonials.map((item) => (
        <Card key={item.id}>
          <CardContent className="space-y-3 pt-6">
            <div className="flex justify-between gap-3">
              <p className="leading-7">“{item.quote}”</p>
              <Badge tone={item.isEnabled ? "green" : "slate"}>
                {item.isEnabled ? "Published" : "Hidden"}
              </Badge>
            </div>
            <ActionForm action={saveTestimonialAction} className="space-y-3" successMessage="Testimonial updated.">
              <input type="hidden" name="id" value={item.id} />
              <Textarea name="quote" defaultValue={item.quote} />
              <div className="grid gap-3 md:grid-cols-2">
                <Input name="author" defaultValue={item.author || ""} placeholder="Author" />
                <Input name="source" defaultValue={item.source || ""} placeholder="Source" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isEnabled" defaultChecked={item.isEnabled} />
                Published
              </label>
              <Button type="submit" variant="outline">
                Update
              </Button>
            </ActionForm>
            <div className="flex gap-2">
              <form action={toggleTestimonialAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="isEnabled" value={String(item.isEnabled)} />
                <Button type="submit" size="sm" variant="outline">
                  {item.isEnabled ? "Disable" : "Enable"}
                </Button>
              </form>
              <form action={deleteTestimonialAction}>
                <input type="hidden" name="id" value={item.id} />
                <Button type="submit" size="sm" variant="destructive">
                  Delete
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
