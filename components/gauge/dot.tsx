"use client";

import { useGauge } from "./context";
import { valueToTurnedAngle } from "./math";
import type { GaugeEnd } from "./utils";

export interface GaugeDotProps {
  /** Radius of the dot itself, in SVG units. */
  radius?: number;
  color?: string;
  opacity?: number;
  /** Offset of the dot's centre from the scale's reference line. */
  offset?: number;
  /**
   * Sweeps of the scale the dot makes across the domain, as
   * `GaugeNeedle.turns`: two sends it round twice while the value crosses
   * the domain once.
   */
  turns?: number;
  /**
   * Width of a ring drawn behind the dot in `haloColor`, so it stands off
   * whatever band it rides. 0 leaves the dot bare.
   */
  halo?: number;
  /** Colour of the halo: the surface under the gauge, usually. */
  haloColor?: string;
  /** Which end of a range the dot rides. Two dots, one at each end, make
      the handles of a range. */
  end?: GaugeEnd;
}

/**
 * A disc riding the scale at the current value: the head of a progress ring,
 * a body on its orbit, the handle on a dial or a slider. `GaugeMarks` stands at fixed values
 * and points along the radius; this follows the value the way a needle does,
 * and is round at any size a stroke cap could not reach.
 */
export const GaugeDot = ({
  radius = 10,
  color = "currentColor",
  opacity = 1,
  offset = 0,
  turns = 1,
  halo = 0,
  haloColor = "var(--background)",
  end = "to",
}: GaugeDotProps) => {
  const gauge = useGauge();
  const position = valueToTurnedAngle(
    end === "from" ? gauge.from : gauge.value,
    gauge.min,
    gauge.max,
    gauge.scale.start,
    gauge.scale.end,
    turns
  );
  const { x, y } = gauge.scale.point(position, offset);

  return (
    <>
      {halo > 0 && (
        <circle
          cx={x}
          cy={y}
          r={radius + halo}
          fill={haloColor}
          fillOpacity={opacity}
        />
      )}
      <circle cx={x} cy={y} r={radius} fill={color} fillOpacity={opacity} />
    </>
  );
};
