import { arcBox, arcPath, polar } from "./math";

export interface GaugePoint {
  x: number;
  y: number;
}
export interface GaugeBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
/** Which way a bar runs. A vertical one fills upward. */
export type GaugeOrientation = "horizontal" | "vertical";

export interface GaugeScale {
  /** Position of the start of the domain. */
  start: number;
  /** Position of the end of the domain. */
  end: number;
  /** The scale runs right round and meets itself, as a full ring does, so
      its two ends land on the same spot. */
  closed: boolean;
  /** The point at a position, `offset` outward from the reference line. */
  point: (position: number, offset?: number) => GaugePoint;
  /**
   * SVG path along the scale between two positions, `offset` outward. Empty
   * when `to` is not past `from`. A span carried past the end of a bar, as a
   * wrapped arc is, comes back in at its start.
   */
  path: (from: number, to: number, offset?: number) => string;
  /** The outward direction at a position, as a unit vector. */
  normal: (position: number) => GaugePoint;
  /**
   * Box round the whole scale with its reference line moved `offset`
   * outward. A dial's takes in its centre too, where a needle pivots.
   */
  box: (offset?: number) => GaugeBox;
}

/** A dial's scale: a circle of `radius` swept from one gauge angle to another. */
export const arcScale = (
  radius: number,
  startAngle: number,
  endAngle: number
): GaugeScale => ({
  box: (offset = 0) => arcBox(radius + offset, startAngle, endAngle),
  closed: endAngle - startAngle >= 360,
  end: endAngle,
  normal: (angle) => polar(1, angle),
  path: (from, to, offset = 0) => arcPath(radius + offset, from, to),
  point: (angle, offset = 0) => polar(radius + offset, angle),
  start: startAngle,
});

/* Rounded as `polar` is, so server and client render identical attributes. */
const round = (n: number) => Math.round(n * 1000) / 1000;

/**
 * A bar's scale: a straight line of `length` centred on the origin, so text
 * placed at the gauge's centre sits at the middle of the bar. A vertical bar
 * is a horizontal one turned a quarter turn anticlockwise: it starts at the
 * bottom, and its outside is on the left.
 */
export const lineScale = (
  orientation: GaugeOrientation,
  length: number
): GaugeScale => {
  const half = length / 2;
  const vertical = orientation === "vertical";

  const point = (position: number, offset = 0) =>
    vertical
      ? { x: round(-offset), y: round(-position) }
      : { x: round(position), y: round(-offset) };

  const segment = (from: number, to: number, offset: number) => {
    const a = point(from, offset);
    const b = point(to, offset);
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  };

  return {
    box: (offset = 0) => {
      const o = Math.abs(offset);
      return vertical
        ? { height: length + 2 * o, width: 2 * o, x: -o, y: -half - o }
        : { height: 2 * o, width: length + 2 * o, x: -half - o, y: -o };
    },
    closed: false,
    end: half,
    normal: () => (vertical ? { x: -1, y: 0 } : { x: 0, y: -1 }),
    path: (from, to, offset = 0) => {
      if (to <= from || length <= 0) {
        return "";
      }
      if (to <= half) {
        return segment(from, to, offset);
      }
      const over = Math.min(to - half, length);
      return [
        from < half ? segment(from, half, offset) : "",
        segment(-half, -half + over, offset),
      ]
        .filter(Boolean)
        .join(" ");
    },
    point,
    start: -half,
  };
};
