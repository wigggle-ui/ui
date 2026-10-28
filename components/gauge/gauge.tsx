"use client";

import type { CSSProperties, SVGProps } from "react";

import { cn } from "@/lib/utils";

import { GaugeContext, useGaugeContextValue } from "./context";
import type { GaugeDomainProps } from "./context";
import { arcBox } from "./math";

/** See `GaugeProps.fit`. */
export type GaugeFit = "square" | "content";

export type GaugeProps = Omit<SVGProps<SVGSVGElement>, "viewBox"> &
  GaugeDomainProps & {
    /** Extra room around the reference circle for thick strokes, ticks and labels. */
    padding?: number;
    /**
     * How the SVG box is sized. `square` boxes the whole circle, so a half gauge
     * reserves the room a full one would. `content` fits the box to the arc's own
     * sweep and sets a matching `aspect-ratio`, so the dial fills the width it is
     * given. `padding` is still what makes room for ticks, labels and value text,
     * since those are drawn by children the root cannot measure.
     */
    fit?: GaugeFit;
  };

/**
 * Root of a composable gauge. Renders a square SVG centred on the origin and
 * publishes the value, domain and geometry to any primitive rendered inside.
 */
export const Gauge = ({
  value,
  min,
  max,
  startAngle,
  endAngle,
  radius,
  transition,
  initialValue,
  wrap,
  rotate,
  padding = 48,
  fit = "square",
  className,
  style,
  children,
  ...props
}: GaugeProps) => {
  const gauge = useGaugeContextValue({
    endAngle,
    initialValue,
    max,
    min,
    radius,
    rotate,
    startAngle,
    transition,
    value,
    wrap,
  });

  const half = gauge.radius + padding;
  const box =
    fit === "content"
      ? arcBox(gauge.radius, gauge.startAngle, gauge.endAngle, padding)
      : { height: 2 * half, width: 2 * half, x: -half, y: -half };

  return (
    <GaugeContext.Provider value={gauge}>
      <svg
        viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
        preserveAspectRatio="xMidYMid meet"
        /* A fitted box takes its height from its width, so it needs the ratio
           on the element; a square one fills whatever box it is handed. */
        style={
          fit === "content"
            ? ({
                "--gauge-aspect-ratio": `${box.width} / ${box.height}`,
                ...style,
              } as CSSProperties)
            : style
        }
        className={cn(
          "overflow-visible",
          fit === "content"
            ? "aspect-(--gauge-aspect-ratio) max-h-full w-full"
            : "h-full w-full",
          className
        )}
        {...props}
      >
        {children}
      </svg>
    </GaugeContext.Provider>
  );
};
