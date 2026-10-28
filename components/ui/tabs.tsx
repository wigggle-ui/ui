"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

const Tabs = ({ className, ...props }: TabsPrimitive.Root.Props) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    className={cn(
      "border-border bg-code flex flex-col rounded-md border",
      className
    )}
    {...props}
  />
);

const TabsList = ({
  className,
  hasSvg = false,
  ...props
}: TabsPrimitive.List.Props & { hasSvg?: boolean }) => (
  <TabsPrimitive.List
    data-slot="tabs-list"
    className={cn(
      "bg-code relative z-0 flex h-fit w-fit items-center justify-center rounded-md p-1",
      "text-muted-foreground",
      hasSvg && "pl-4",
      className
    )}
    {...props}
  />
);

const TabsIndicator = ({
  className,
  ...props
}: TabsPrimitive.Indicator.Props) => (
  <TabsPrimitive.Indicator
    data-slot="tabs-indicator"
    className={cn(
      "dark:bg-foreground absolute bottom-0 left-0 -z-1 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) rounded-md bg-white transition-[width,translate] duration-200 ease-in-out",
      "inset-ring-foreground/10 dark:inset-ring-foreground/6 inset-ring-1",
      className
    )}
    {...props}
  />
);

const TabsTrigger = ({ className, ...props }: TabsPrimitive.Tab.Props) => (
  <TabsPrimitive.Tab
    data-slot="tabs-trigger"
    className={cn(
      "hover:text-foreground focus-visible:inset-ring-ring data-active:text-foreground flex flex-1 shrink-0 items-center justify-center gap-2 rounded-md px-4 py-1 font-sans text-base font-medium whitespace-nowrap transition-[color,background-color] outline-none focus-visible:inset-ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  />
);

const TabsContent = ({ className, ...props }: TabsPrimitive.Panel.Props) => (
  <TabsPrimitive.Panel
    data-slot="tabs-content"
    className={cn("bg-background flex-1 rounded-b-md outline-none", className)}
    {...props}
  />
);

export { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger };
