"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { useGauge } from "./context";
import { fontClass, weightClass } from "./utils";
import type { FontFamily, FontWeight, GaugeEnd, TextAnchor } from "./utils";

export interface GaugeTextProps {
  /** Position relative to the gauge centre in SVG units. Positive y is down. */
  x?: number;
  y?: number;
  fontSize?: number;
  color?: string;
  font?: FontFamily;
  weight?: FontWeight;
  anchor?: TextAnchor;
  className?: string;
  children: ReactNode;
}

/** A free-standing label anywhere on the gauge. */
export const GaugeText = ({
  x = 0,
  y = 0,
  fontSize = 24,
  color = "currentColor",
  font = "sans",
  weight = "medium",
  anchor = "middle",
  className,
  children,
}: GaugeTextProps) => (
  <text
    x={x}
    y={y}
    fill={color}
    fontSize={fontSize}
    textAnchor={anchor}
    dominantBaseline="central"
    className={cn(fontClass[font], weightClass[weight], className)}
  >
    {children}
  </text>
);

export type GaugeValueProps = Omit<GaugeTextProps, "children"> & {
  decimals?: number;
  /** Formats each number shown; a range formats its two ends apart. */
  format?: (value: number) => string;
  /** Placed between the two ends of a range. */
  separator?: string;
  /** Show only one end of a range rather than both. */
  end?: GaugeEnd;
};

/** The current value as text, or a range as its two ends. */
export const GaugeValue = ({
  decimals = 0,
  format,
  separator = "–",
  end,
  className,
  fontSize = 96,
  weight = "semibold",
  ...props
}: GaugeValueProps) => {
  const { value, from, range } = useGauge();
  const text = (v: number) => (format ? format(v) : v.toFixed(decimals));
  let valueText: string;
  if (end === "from") {
    valueText = text(from);
  } else if (range && !end) {
    valueText = `${text(from)}${separator}${text(value)}`;
  } else {
    valueText = text(value);
  }

  return (
    <GaugeText
      fontSize={fontSize}
      weight={weight}
      className={cn("tabular-nums", className)}
      {...props}
    >
      {valueText}
    </GaugeText>
  );
};
