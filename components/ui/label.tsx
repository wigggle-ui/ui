"use client";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import { Label as LabelPrimitive } from "radix-ui";
import * as React from "react";

const labelVariants = cva(
  "flex items-center gap-2 leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
      weight: "default",
    },
    variants: {
      size: {
        default: "text-base",
        lg: "text-lg",
        md: "text-base",
        sm: "text-sm",
        xl: "text-xl",
        xs: "text-xs",
        xxl: "text-2xl",
        xxxl: "text-3xl",
        xxxxl: "text-4xl",
      },
      variant: {
        background: "text-background",
        default: "text-primary",
        destructive: "text-destructive",
        foreground: "text-foreground",
        info: "text-vercel-blue",
        "muted-foreground": "text-muted-foreground",
        productive: "text-productive",
        secondary: "text-secondary",
        warning: "text-vercel-yellow",
      },
      weight: {
        black: "font-black",
        bold: "font-bold",
        default: "font-normal",
        light: "font-light",
        medium: "font-medium",
        semibold: "font-semibold",
      },
    },
  }
);

const Label = ({
  className,
  variant = "default",
  size = "default",
  weight = "default",
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>) => (
  <LabelPrimitive.Root
    data-slot="label"
    className={cn(labelVariants({ className, size, variant, weight }))}
    {...props}
  />
);

export { Label };
