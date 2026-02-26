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
import { siteConfig } from "@/config/site";

const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "react widgets",
    "react components",
    "tailwindcss ui",
    "shadcn/ui",
    "shadcn ui components",
    "react ui library",
    "customizable components",
    "dark mode components",
  ],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        width: 1200,
        height: 630,
        url: siteConfig.ogImage,
        alt: `${siteConfig.name} Cover`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: siteConfig.title,
    description: siteConfig.description,
    card: "summary_large_image",
    images: [
      {
        width: 1200,
        height: 630,
        url: siteConfig.ogImage,
        alt: `${siteConfig.name} Cover`,
      },
    ],
    site: siteConfig.author,
    creator: siteConfig.author,
  },
  icons: {
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
