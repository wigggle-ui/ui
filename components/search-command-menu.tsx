"use client";

import { SearchIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import {
  MENU_LINKS,
  SOCIAL_LINKS,
  WIDGET_CATEGORY_LINKS,
} from "@/config/links";

const SearchCommandMenu = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-fit"
        size="sm"
      >
        <SearchIcon className="size-4" />
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {MENU_LINKS.map((link) => (
                <CommandItem key={link.href}>
                  {link.icon}
                  <span>{link.title}</span>
                  <CommandShortcut monoFont>{link.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Widget Categories">
              {WIDGET_CATEGORY_LINKS.map((link) => (
                <CommandItem key={link.href}>
                  <link.icon />
                  <span>{link.title} Widgets</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Socials">
              {SOCIAL_LINKS.map((link) => (
                <CommandItem key={link.href}>
                  {link.icon}
                  <span>{link.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default SearchCommandMenu;
