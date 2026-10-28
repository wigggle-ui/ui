"use client";

import { useId } from "react";

import { useRoundGauge } from "./context";
import { polar, valueToTurnedAngle } from "./math";
import type { GaugeEnd, NeedleStyle } from "./utils";

export interface GaugeNeedleProps {
  /**
   * `line` is a stroke with round ends, `pointer` a tapered blade that is
   * widest at the centre and ends in a rounded tip, and `compass` a lozenge
   * whose two halves can take different colours. `arrow` is a shaft ending in
   * a triangular arrowhead, sized from the width, for wind or flow direction.
   */
  style?: NeedleStyle;
  /** Length as a fraction of the reference radius. */
  length?: number;
  /** Stroke width for `line`; width at the centre for the filled styles. */
  width?: number;
  color?: string;
  /** How far the needle extends behind the centre, in SVG units. */
  tail?: number;
  /** Colour of the tail half of a `pointer`, `compass` or `arrow`. Defaults to `color`. */
  tailColor?: string;
  /**
   * Radius of a disc drawn at the end of the tail in `tailColor`, like the
   * counterweight on a wind vane. 0 leaves the tail plain.
   */
  tailDot?: number;
  /**
   * Sweeps of the arc the needle makes across the domain. A clock's minute
   * hand turns 12 times while the hour hand turns once.
   */
  turns?: number;
  /**
   * Radius of a clear circle around the centre, in SVG units, that splits the
   * needle in two so a readout can sit between the halves. 0 draws it whole.
   */
  gap?: number;
  /** Which end of a range the needle points at. */
  end?: GaugeEnd;
}

const pts = (points: { x: number; y: number }[]) =>
  points.map((p) => `${p.x},${p.y}`).join(" ");

const offset = (p: { x: number; y: number }, d: { x: number; y: number }) => ({
  x: p.x + d.x,
  y: p.y + d.y,
});

const NeedleShape = ({
  style = "line",
  length = 0.85,
  width = 6,
  color = "currentColor",
  tail = 30,
  tailColor = color,
  tailDot = 0,
  turns = 1,
  end = "to",
}: Omit<GaugeNeedleProps, "gap">) => {
  const gauge = useRoundGauge("GaugeNeedle");
  const { radius, min, max, startAngle, endAngle } = gauge;
  const value = end === "from" ? gauge.from : gauge.value;

  const angle = valueToTurnedAngle(
    value,
    min,
    max,
    startAngle,
    endAngle,
    turns
  );

  const tip = polar(radius * length, angle);
  const back = polar(-tail, angle);
  const endDot =
    tail > 0 && tailDot > 0 ? (
      <circle cx={back.x} cy={back.y} r={tailDot} fill={tailColor} />
    ) : null;

  if (style === "arrow") {
    /* A shaft of `width` capped by a triangular head that scales with it,
       never longer than the needle itself. The shaft stops where the head
       begins so the two never overlap, and the tail is the shaft carried on
       behind the centre in its own colour, rounded off at the end. */
    const reach = radius * length;
    const headLength = Math.min(width * 4, reach);
    const base = polar(reach - headLength, angle);
    const shaftLeft = polar(width / 2, angle - 90);
    const shaftRight = polar(width / 2, angle + 90);
    const headLeft = polar(width * 2, angle - 90);
    const headRight = polar(width * 2, angle + 90);

    return (
      <g>
        {tail > 0 && (
          <>
            <polygon
              points={pts([
                shaftLeft,
                shaftRight,
                offset(back, shaftRight),
                offset(back, shaftLeft),
              ])}
              fill={tailColor}
            />
            <circle cx={back.x} cy={back.y} r={width / 2} fill={tailColor} />
          </>
        )}
        <polygon
          points={pts([
            shaftLeft,
            offset(base, shaftLeft),
            offset(base, headLeft),
            tip,
            offset(base, headRight),
            offset(base, shaftRight),
            shaftRight,
          ])}
          fill={color}
        />
        {endDot}
      </g>
    );
  }

  if (style === "line") {
    return (
      <>
        <line
          x1={back.x}
          y1={back.y}
          x2={tip.x}
          y2={tip.y}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
        />
        {endDot}
      </>
    );
  }

  /* The filled styles are two polygons meeting at the centre, so the tail can
     take its own colour. Their shared base runs across the pivot. Both ends
     keep a fifth of the width and are rounded off with a disc of that size,
     as a round cap would, so a thin needle never vanishes to a point. */
  const left = polar(width / 2, angle - 90);
  const right = polar(width / 2, angle + 90);
  const endRadius = width * 0.2;
  const endLeft = polar(endRadius, angle - 90);
  const endRight = polar(endRadius, angle + 90);
  const blade = (tipPoint: { x: number; y: number }) =>
    pts([
      { x: tipPoint.x + endLeft.x, y: tipPoint.y + endLeft.y },
      { x: tipPoint.x + endRight.x, y: tipPoint.y + endRight.y },
      right,
      left,
    ]);

  /* A pointer's tail is a blunt stub; a compass tapers the same both ways. */
  const rear =
    style === "compass"
      ? blade(back)
      : pts([
          { x: back.x + left.x * 0.6, y: back.y + left.y * 0.6 },
          { x: back.x + right.x * 0.6, y: back.y + right.y * 0.6 },
          right,
          left,
        ]);

  return (
    <g>
      {tail > 0 && <polygon points={rear} fill={tailColor} />}
      {tail > 0 && style === "compass" && (
        <circle cx={back.x} cy={back.y} r={endRadius} fill={tailColor} />
      )}
      <polygon points={blade(tip)} fill={color} />
      <circle cx={tip.x} cy={tip.y} r={endRadius} fill={color} />
      {endDot}
    </g>
  );
};

/**
 * A needle pointing at the current value. Add a `GaugeHub` for the pivot, or
 * a `gap` to clear the centre for a readout instead.
 */
export const GaugeNeedle = ({ gap = 0, ...props }: GaugeNeedleProps) => {
  /* useId's output is not a safe fragment identifier, so keep word
     characters only. */
  const maskId = `gauge-needle-gap${useId().replaceAll(/\W/gu, "")}`;
  if (gap <= 0) {
    return <NeedleShape {...props} />;
  }

  /* A mask rather than geometry, so every style splits the same way. The
     cut edges follow the circle, which on a gap this much wider than the
     needle reads as straight. */
  return (
    <g>
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x={-1e4}
        y={-1e4}
        width={2e4}
        height={2e4}
      >
        <rect x={-1e4} y={-1e4} width={2e4} height={2e4} fill="foreground" />
        <circle r={gap} fill="background" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <NeedleShape {...props} />
      </g>
    </g>
  );
};

export interface GaugeHubProps {
  radius?: number;
  color?: string;
}

/** The pivot disc at the centre, drawn once however many needles there are. */
export const GaugeHub = ({
  radius = 12,
  color = "currentColor",
}: GaugeHubProps) => (radius > 0 ? <circle r={radius} fill={color} /> : null);
