import { OpenPanelComponent } from "@openpanel/nextjs";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import "./globals.css";

import React from "react";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});
const openPanelClientId = process.env.OPEN_PANEL_CLIENT_ID;

export const metadata: Metadata = {
  description: siteConfig.description,
  icons: {
    shortcut: "/favicon.ico",
  },
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
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    description: siteConfig.description,
    images: [
      {
        alt: `${siteConfig.name} Cover`,
        height: 630,
        url: siteConfig.ogImage,
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: siteConfig.name,
    title: siteConfig.title,
    type: "website",
    url: siteConfig.url,
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  twitter: {
    card: "summary_large_image",
    creator: siteConfig.author,
    description: siteConfig.description,
    images: [
      {
        alt: `${siteConfig.name} Cover`,
        height: 630,
        url: siteConfig.ogImage,
        width: 1200,
      },
    ],
    site: siteConfig.author,
    title: siteConfig.title,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element => (
  <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
    <body className={`${outfit.className} antialiased`}>
      {openPanelClientId && (
        <OpenPanelComponent
          clientId={openPanelClientId}
          trackScreenViews={true}
        />
      )}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <div className="bg-background text-foreground relative grid min-h-screen w-full grid-rows-[auto_1fr_auto] font-sans">
            <SiteHeader />
            <div className="min-w-0 p-6">{children}</div>
            <SiteFooter />
          </div>
        </TooltipProvider>
      </ThemeProvider>
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
