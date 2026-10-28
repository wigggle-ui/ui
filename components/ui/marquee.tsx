import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
}

const Marquee = ({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) => (
  <div
    {...props}
    className={cn(
      "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
      {
        "flex-col": vertical,
        "flex-row": !vertical,
      },
      className
    )}
  >
    {Array.from({ length: Math.max(0, Math.floor(repeat)) }, (_, index) => (
      <div
        key={index}
        className={cn("flex shrink-0 justify-around gap-(--gap)", {
          "animate-marquee flex-row": !vertical,
          "animate-marquee-vertical flex-col": vertical,
          "direction-[reverse]": reverse,
          "group-hover:paused": pauseOnHover,
        })}
      >
        {children}
      </div>
    ))}
  </div>
);

export { Marquee };
