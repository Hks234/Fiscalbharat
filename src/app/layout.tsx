import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: settings.websiteName,
      template: `%s | ${settings.websiteName}`,
    },
    description: settings.tagline,
    icons: [{ rel: "icon", url: settings.logoUrl || "/brand/fiscal-bharat-logo.png" }],
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
