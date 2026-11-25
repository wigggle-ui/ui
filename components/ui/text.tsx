import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

const textVariants = cva(
  "flex items-center gap-2 leading-none text-wrap select-none",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
      weight: "default",
    },
    variants: {
      decoration: {
        cancelled: "line-through",
      },
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
        xxxxxl: "text-5xl",
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

const Text = ({
  className,
  decoration,
  size = "default",
  variant = "default",
  weight = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof textVariants>) => (
  <span
    data-slot="text"
    className={cn(
      textVariants({ className, decoration, size, variant, weight })
    )}
    {...props}
  />
);

export { Text, textVariants };
