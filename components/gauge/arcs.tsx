"use client";

import { useGauge } from "./context";
import { foldValue } from "./math";
import type { StrokeCap, Zone } from "./utils";

interface ArcStyleProps {
  width?: number;
  color?: string;
  opacity?: number;
  cap?: StrokeCap;
  /** Offset from the scale's reference line: radial on a dial, across a
      bar. Positive moves outward, away from the centre or up from a bar. */
  offset?: number;
}

/** The whole scale as a background: a dial's full sweep, a bar's length. */
export const GaugeTrack = ({
  width = 24,
  color = "currentColor",
  opacity = 0.15,
  cap = "round",
  offset = 0,
}: ArcStyleProps) => {
  const { scale } = useGauge();
  return (
    <path
      d={scale.path(scale.start, scale.end, offset)}
      fill="none"
      stroke={color}
      strokeOpacity={opacity}
      strokeWidth={width}
      strokeLinecap={cap}
    />
  );
};

export type GaugeArcProps = ArcStyleProps & {
  /** Domain value the arc is anchored at. Defaults to `min`, or to the start
      of the gauge's range. */
  from?: number;
  /** Domain value the arc ends at. Defaults to the current value. */
  to?: number;
  /**
   * Grow the arc back from the end of the sweep instead of forward from its
   * start. The length is the same; only the end it is anchored to changes,
   * which is what a dial filling towards its start needs.
   */
  reverse?: boolean;
  /**
   * Carry the arc on round a closed ring instead of clamping it at the
   * domain: a span from eleven at night to two in the morning crosses the
   * seam in one piece. The arc runs forward from `from` however far past
   * `max` the `to` reaches.
   */
  wrap?: boolean;
};

/**
 * The filled arc, from `min` (or `from`) up to the current value (or `to`).
 * The ends may arrive either way round: an arc anchored above the value
 * grows back towards it, which is what a dial centred on zero needs. On a
 * gauge showing a range it fills between the two ends, and on a wrapped one
 * runs forward from the start across the seam where the range does.
 */
export const GaugeArc = ({
  width = 24,
  color = "currentColor",
  opacity = 1,
  cap = "round",
  offset = 0,
  from,
  to,
  reverse = false,
  wrap = false,
}: GaugeArcProps) => {
  const gauge = useGauge();
  const { min, max, value, scale, positionOf } = gauge;
  const tail = from ?? gauge.from;
  let head = to ?? value;
  /* A range on a closed ring is read forward from its start, so the far end
     is carried round past the seam when it sits below the start. */
  const forward =
    gauge.range && gauge.wrap && from === undefined && to === undefined;
  if (forward) {
    head = tail + foldValue(head - tail, 0, Math.abs(max - min));
  }
  const lo = Math.min(tail, head);
  const hi = Math.max(tail, head);

  let a0: number;
  let a1: number;
  if (wrap || forward) {
    const span = max - min;
    if (span <= 0) {
      return null;
    }
    /* Positions past the end carry on round a ring, and come back in at
       the start of a bar. */
    const sweep = scale.end - scale.start;
    const perUnit = sweep / span;
    a0 = scale.start + ((((lo - min) % span) + span) % span) * perUnit;
    a1 = a0 + Math.min((hi - lo) * perUnit, sweep);
  } else {
    [a0, a1] = reverse
      ? [positionOf(max - (hi - lo)), positionOf(max)]
      : [positionOf(lo), positionOf(hi)];
  }
  if (a1 <= a0) {
    return null;
  }

  return (
    <path
      d={scale.path(a0, a1, offset)}
      fill="none"
      stroke={color}
      strokeOpacity={opacity}
      strokeWidth={width}
      strokeLinecap={cap}
    />
  );
};

export interface GaugeStackPart {
  /** Share of the fill. Weighted parts split the value between them. */
  weight?: number;
  /** Fixed upper cutoff in domain units, for parts that stand still while
      the value sweeps across them. Runs from the end of the part before. */
  to?: number;
  color: string;
  opacity?: number;
}

export type GaugeStackProps = Omit<ArcStyleProps, "color"> & {
  parts: GaugeStackPart[];
  /** Domain value the stack starts at. Defaults to `min`, or to the start of
      the gauge's range. */
  from?: number;
};

/**
 * The value arc split into parts that sweep as one. A part with a `weight`
 * takes that share of the fill, so a memory ring keeps wired, app and cache
 * in proportion frame by frame; a part with a fixed `to` runs from the end
 * of the one before and is clipped to the value, so a night of sleep stages
 * draws on in order as the dial sweeps in. Use one kind or the other in a
 * single stack.
 */
export const GaugeStack = ({
  parts,
  width = 24,
  opacity = 1,
  cap = "butt",
  offset = 0,
  from,
}: GaugeStackProps) => {
  const gauge = useGauge();
  const { value, scale, positionOf } = gauge;
  if (parts.length === 0) {
    return null;
  }

  const total = parts.reduce((sum, p) => sum + (p.weight ?? 0), 0);
  const start = from ?? gauge.from;
  const fill = value - start;

  /* Each part runs from the end of the one before: its own cutoff, or its
     share of the fill. */
  const ends: number[] = [];
  let previousEnd = start;
  for (const part of parts) {
    previousEnd =
      part.to ??
      previousEnd + (total > 0 ? (fill * (part.weight ?? 0)) / total : 0);
    ends.push(previousEnd);
  }

  return (
    <g opacity={opacity}>
      {parts.map((p, i) => {
        const a0 = positionOf(i === 0 ? start : ends[i - 1]);
        const a1 = positionOf(Math.min(ends[i], value));
        if (a1 <= a0) {
          return null;
        }
        return (
          <path
            key={i}
            d={scale.path(a0, a1, offset)}
            fill="none"
            stroke={p.color}
            strokeOpacity={p.opacity}
            strokeWidth={width}
            strokeLinecap={cap}
          />
        );
      })}
    </g>
  );
};

export type GaugeZonesProps = Omit<ArcStyleProps, "color"> & {
  /**
   * Ordered cutoffs. Each zone runs from the previous zone's `to` (or `min`)
   * up to its own `to`; the last zone always extends to `max`.
   */
  zones: Zone[];
  /** Gap between neighbouring zones, in the scale's units: degrees round a
      dial, SVG units along a bar. */
  gap?: number;
  /**
   * Cap on the two outer ends of the whole band (the start of the first zone
   * and the end of the last). `cap` covers the joints between zones. Defaults
   * to `cap`, so a single value still rounds or squares every end.
   */
  endCap?: StrokeCap;
};

/** Coloured bands marking the cutoffs of the domain. */
export const GaugeZones = ({
  zones,
  width = 8,
  opacity = 1,
  cap = "butt",
  endCap = cap,
  offset = 0,
  gap = 0,
}: GaugeZonesProps) => {
  const { min, max, scale, positionOf } = useGauge();
  if (zones.length === 0) {
    return null;
  }

  /* Segments are drawn with butt caps and rounded where asked with a disc of
     the stroke width, which is exactly the shape a round cap adds. Drawing
     the discs separately lets the joints and the outer ends differ. */
  const dot = (position: number, color: string, key: string) => {
    const { x, y } = scale.point(position, offset);
    return <circle key={key} cx={x} cy={y} r={width / 2} fill={color} />;
  };

  /* Each zone runs from the previous cutoff to its own, clamped to the domain. */
  const segments: { from: number; to: number }[] = [];
  let previousTo = min;
  for (const [index, zone] of zones.entries()) {
    const from = previousTo;
    const isLast = index === zones.length - 1;
    const to = isLast ? max : Math.min(Math.max(zone.to, from), max);
    segments.push({ from, to });
    previousTo = to;
  }

  return (
    <g opacity={opacity}>
      {zones.map((zone, i) => {
        const isFirst = i === 0;
        const isLast = i === zones.length - 1;
        const { from, to } = segments[i];
        const a0 = positionOf(from) + (isFirst ? 0 : gap / 2);
        const a1 = positionOf(to) - (isLast ? 0 : gap / 2);
        if (a1 <= a0) {
          return null;
        }
        const startCap = isFirst ? endCap : cap;
        const finishCap = isLast ? endCap : cap;
        return (
          <g key={i}>
            <path
              d={scale.path(a0, a1, offset)}
              fill="none"
              stroke={zone.color}
              strokeWidth={width}
              strokeLinecap="butt"
            />
            {startCap === "round" && dot(a0, zone.color, "start")}
            {finishCap === "round" && dot(a1, zone.color, "end")}
          </g>
        );
      })}
    </g>
  );
};
