import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";
import * as React from "react";

import { Separator } from "@/components/ui/separator";

const ItemGroup = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <ul
    data-slot="item-group"
    className={cn(
      "group/item-group m-0 flex list-none flex-col p-0",
      className
    )}
    {...props}
  />
);

const ItemSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) => (
  <Separator
    data-slot="item-separator"
    orientation="horizontal"
    className={cn("my-0", className)}
    {...props}
  />
);

const itemVariants = cva(
  "group/item focus-visible:border-ring focus-visible:ring-ring/50 [a]:hover:bg-accent/50 flex flex-wrap items-center rounded-md border border-transparent text-sm transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "gap-4 p-4",
        sm: "gap-2.5 px-4 py-3",
      },
      variant: {
        default: "bg-transparent",
        muted: "bg-muted/50",
        outline: "border-border",
      },
    },
  }
);

const Item = ({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"li"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot.Root : "li";
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ className, size, variant }))}
      {...props}
    />
  );
};

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
  }
);

const ItemMedia = ({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) => (
  <div
    data-slot="item-media"
    data-variant={variant}
    className={cn(itemMediaVariants({ className, variant }))}
    {...props}
  />
);

const ItemContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-content"
    className={cn(
      "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
      className
    )}
    {...props}
  />
);

const ItemTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-title"
    className={cn(
      "flex w-fit items-center gap-2 text-sm leading-snug font-medium",
      className
    )}
    {...props}
  />
);

const ItemDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => (
  <p
    data-slot="item-description"
    className={cn(
      "text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance",
      "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
      className
    )}
    {...props}
  />
);

const ItemActions = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-actions"
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
);

const ItemHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-header"
    className={cn(
      "flex basis-full items-center justify-between gap-2",
      className
    )}
    {...props}
  />
);

const ItemFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-footer"
    className={cn(
      "flex basis-full items-center justify-between gap-2",
      className
    )}
    {...props}
  />
);

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};
