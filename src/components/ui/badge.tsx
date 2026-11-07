import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "navy",
  ...props
}: React.ComponentProps<"span"> & { tone?: "navy" | "gold" | "green" | "amber" | "slate" | "red" }) {
  const tones = {
    navy: "bg-[#174A83]/10 text-[#174A83]",
    gold: "bg-[#C6A15B]/20 text-[#8a6b2c]",
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    slate: "bg-slate-100 text-slate-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
