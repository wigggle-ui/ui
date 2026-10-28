import { cn } from "cn";
import type { ComponentProps } from "react";

const Step = ({ children, className, ...props }: ComponentProps<"h3">) => (
  <h3 className={cn("step my-6 font-medium", className)} {...props}>
    {children}
  </h3>
);

const Steps = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "relative md:pl-8 [&_h3]:text-base",
      "before:bg-muted-foreground/50 before:pointer-events-none before:absolute before:top-0 before:left-2 before:hidden before:h-full before:w-px before:-translate-x-1/2 before:md:flex",
      className
    )}
    {...props}
  />
);

export { Step, Steps };
