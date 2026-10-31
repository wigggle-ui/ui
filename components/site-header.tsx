import Link from "next/link";

import { Icons } from "@/components/icons";
import MobileNav from "@/components/mobile-nav";
import RotatingLogo from "@/components/rotating-logo";
import SearchCommandMenu from "@/components/search-command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/widgets", label: "Widgets" },
  { href: "/playground", label: "Playground" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/changelog", label: "Changelog" },
];

const SiteHeader = () => (
  <header className="bg-background border-border sticky inset-x-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b px-6">
    <div className="flex items-center justify-start gap-3 md:gap-6">
      <div className="block md:hidden">
        <MobileNav />
      </div>
      <Link className="group flex items-center justify-center gap-1.5" href="/">
        <RotatingLogo />
        {/* <Label className="group-hover:cursor-pointer" size="lg">
          Wigggle UI
        </Label> */}
      </Link>
      <div className="hidden md:flex md:items-center md:justify-start md:gap-4">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted-foreground hover:text-foreground text-sm no-underline transition-colors duration-300"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
    <div className="flex items-center justify-end gap-4">
      <SearchCommandMenu />
      <Button
        asChild
        size="icon"
        variant="ghost"
        className="group hidden sm:inline-flex"
      >
        <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
          <Icons.GitHub className="text-muted-foreground group-hover:text-foreground size-4.5 transition-colors duration-300" />
        </Link>
      </Button>
      <ThemeToggle />
    </div>
  </header>
);

export default SiteHeader;
