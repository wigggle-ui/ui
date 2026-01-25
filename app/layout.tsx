import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { OpenPanelComponent } from "@openpanel/nextjs";

import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { DotBackground } from "@/components/dot-background";
import { TailwindIndicator } from "@/components/tailwind-indicator";

const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wigggle UI",
  description:
    "A beautiful collection of copy-and-paste widgets for your next project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <OpenPanelComponent
          clientId={process.env.OPEN_PANEL_CLIENT_ID!}
          trackScreenViews={true}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative">
            <div className="absolute inset-0">
              <DotBackground />
            </div>
            <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col max-sm:text-center">
              <SiteHeader />
              <div className="flex-1 sm:px-6">{children}</div>
              <SiteFooter />
            </div>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
