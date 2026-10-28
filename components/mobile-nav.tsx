"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MENU_LINKS, WIDGET_CATEGORY_LINKS } from "@/config/links";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="ghost">
          <MenuIcon className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-3/4">
        <DrawerHeader className="overflow-y-auto">
          <div className="space-y-4">
            <div className="flex flex-col items-start justify-center gap-2 px-3">
              {MENU_LINKS.map((item) => (
                <Link
                  className="text-xl"
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <hr />
            <div className="grid w-full grid-cols-4 gap-4">
              {WIDGET_CATEGORY_LINKS.map((widget) => (
                <div key={widget.title} className="text-center">
                  <Link
                    href={widget.href}
                    className="bg-background peer hover:bg-secondary dark:border-border relative mx-auto flex size-24 flex-col items-center justify-center overflow-hidden rounded-lg border p-4 transition-colors duration-300 sm:flex"
                    tabIndex={-1}
                    onClick={() => setOpen(false)}
                  >
                    <widget.icon
                      className="mx-auto size-12"
                      strokeWidth={1.5}
                    />
                    <h2 className="text-foreground mt-1.5 text-xs font-light">
                      {widget.title} Widgets
                    </h2>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNav;
