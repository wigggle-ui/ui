"use client";

import type { CSSProperties, SVGProps } from "react";

import { cn } from "@/lib/utils";

import { GaugeContext, useLinearGaugeContextValue } from "./context";
import type { LinearGaugeDomainProps } from "./context";

/** Room on each side of a bar, in SVG units. A side left out gets none. */
export type LinearGaugePadding =
  | number
  | { top?: number; right?: number; bottom?: number; left?: number };

export type LinearGaugeProps = Omit<SVGProps<SVGSVGElement>, "viewBox"> &
  LinearGaugeDomainProps & {
    /**
     * Extra room round the bar for thick strokes, ticks, labels and value
     * text, which the root cannot measure since its children draw them. One
     * number for every side, or a side each: a readout above a horizontal
     * bar and its labels below rarely need the same.
     */
    padding?: LinearGaugePadding;
  };

/**
 * Root of a straight gauge: a horizontal or vertical bar. It publishes the
 * same context `Gauge` does with a straight scale in place of an arc, so
 * every primitive that draws along the scale — track, arc, stack, zones,
 * ticks, tick fill, marks, labels, dot, tooltip and text — works inside it
 * unchanged. Only the needle, which pivots about a centre, needs a round one.
 *
 * The bar runs `length` SVG units centred on the origin, left to right or
 * bottom to top. Offsets move a part outward: up from a horizontal bar, left
 * of a vertical one, so labels below or to the right take a negative offset
 * just as they sit inside a dial. The SVG takes its box from the bar and its
 * padding and sets a matching `aspect-ratio`, so a horizontal bar fills the
 * width it is given and a vertical one the height.
 */
export const LinearGauge = ({
  value,
  min,
  max,
  transition,
  initialValue,
  wrap,
  orientation,
  length,
  padding = 32,
  className,
  style,
  children,
  ...props
}: LinearGaugeProps) => {
  const gauge = useLinearGaugeContextValue({
    initialValue,
    length,
    max,
    min,
    orientation,
    transition,
    value,
    wrap,
  });

  const pad =
    typeof padding === "number"
      ? { bottom: padding, left: padding, right: padding, top: padding }
      : { bottom: 0, left: 0, right: 0, top: 0, ...padding };
  const half = gauge.length / 2;
  const vertical = gauge.orientation === "vertical";
  const box = vertical
    ? {
        height: gauge.length + pad.top + pad.bottom,
        width: pad.left + pad.right,
        x: -pad.left,
        y: -half - pad.top,
      }
    : {
        height: pad.top + pad.bottom,
        width: gauge.length + pad.left + pad.right,
        x: -half - pad.left,
        y: -pad.top,
      };

  return (
    <GaugeContext.Provider value={gauge}>
      <svg
        viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
        preserveAspectRatio="xMidYMid meet"
        style={
          {
            "--gauge-aspect-ratio": `${box.width} / ${box.height}`,
            ...style,
          } as CSSProperties
        }
        className={cn(
          "aspect-(--gauge-aspect-ratio) overflow-visible",
          vertical ? "h-full w-auto" : "h-auto w-full",
          className
        )}
        {...props}
      >
        {children}
      </svg>
    </GaugeContext.Provider>
  );
};
