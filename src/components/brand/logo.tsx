import Image from "next/image";
import { resolveLogoUrl } from "@/lib/constants";
import type { SiteSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

export function BrandLogo({
  settings,
  className,
  inverted: _inverted = false,
  size = "nav",
}: {
  settings: SiteSettings;
  className?: string;
  inverted?: boolean;
  size?: "nav" | "hero" | "footer";
}) {
  const src = resolveLogoUrl(settings.logoUrl);
  const sizes = {
    nav: { width: 180, height: 64, className: "h-12 w-auto md:h-14" },
    footer: { width: 180, height: 64, className: "h-14 w-auto" },
    hero: { width: 420, height: 320, className: "h-[210px] w-auto md:h-[236px]" },
  }[size];

  return (
    <Image
      src={src}
      alt={settings.websiteName}
      width={sizes.width}
      height={sizes.height}
      className={cn("object-contain", sizes.className, className)}
      unoptimized
      priority={size === "hero" || size === "nav"}
    />
  );
}
