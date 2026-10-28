export type StrokeCap = "round" | "butt";
export type FontFamily = "sans" | "rounded" | "mono";
export type FontWeight = "regular" | "medium" | "semibold" | "bold";
export type NeedleStyle = "line" | "pointer" | "compass" | "arrow";
/**
 * Which end of a range a part follows: `to`, the far end, which is the value
 * itself on a single-value gauge, or `from`, where the range starts.
 */
export type GaugeEnd = "from" | "to";
/** A colour for every mark alike, or one per mark worked out from its value. */
export type ValueColor = string | ((value: number) => string);
/** Which edge of a text sits at its position: left, centre or right. */
export type TextAnchor = "start" | "middle" | "end";

export interface Zone {
  /** Upper cutoff of the zone in domain units. Ignored for the last zone. */
  to: number;
  color: string;
}

export const fontClass: Record<FontFamily, string> = {
  mono: "font-mono",
  rounded: "font-rounded",
  sans: "font-sans",
};

export const weightClass: Record<FontWeight, string> = {
  bold: "font-bold",
  medium: "font-medium",
  regular: "font-normal",
  semibold: "font-semibold",
};

/** Colour of the zone a value falls in, or `fallback` when there are none. */
export const zoneColor = (zones: Zone[], value: number, fallback: string) => {
  if (zones.length === 0) {
    return fallback;
  }
  for (let i = 0; i < zones.length - 1; i += 1) {
    if (value < zones[i].to) {
      return zones[i].color;
    }
  }
  return zones.at(-1)?.color;
};

/** Cutoff values that separate neighbouring zones. */
export const zoneCutoffs = (zones: Zone[]) =>
  zones.slice(0, -1).map((zone) => zone.to);

const compassPoints = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

/**
 * Formats a heading in degrees as a compass point when it lands on one of the
 * sixteen, and as degrees otherwise, so a 0–360 domain reads like a bezel:
 * N, 30°, 60°, E, and so on.
 */
export const compassLabel = (degrees: number) => {
  const turn = ((degrees % 360) + 360) % 360;
  const index = Math.round(turn / 22.5) % 16;
  const exact = Math.abs(turn - index * 22.5) < 0.5;
  return exact ? compassPoints[index] : `${Math.round(turn)}°`;
};

/** Formats a value in hours as a clock numeral, so 0 and 12 both read "12". */
export const clockLabel = (hours: number) =>
  String(((Math.round(hours) % 12) + 12) % 12 || 12);

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Hours past midnight as a 24-hour clock time: 6.5 reads "06:30". Negative
 * hours reach back into the day before, and past 24 into the day after.
 */
export const clockTime = (hours: number) => {
  const minutes = Math.round((((hours % 24) + 24) % 24) * 60);
  return `${pad(Math.floor(minutes / 60) % 24)}:${pad(minutes % 60)}`;
};

/** A duration in hours as "7h 32m". */
export const durationLabel = (hours: number) => {
  const minutes = Math.round(hours * 60);
  return `${Math.floor(minutes / 60)}h ${pad(minutes % 60)}m`;
};

/**
 * `color` thinned towards transparent: the one ink of a face taken down to
 * its quieter tones, holding apart in either theme.
 */
export const fadeColor = (color: string, percent: number) =>
  `color-mix(in oklch, ${color} ${percent}%, transparent)`;
