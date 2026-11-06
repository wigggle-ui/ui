import { getThresholdMap } from "@/lib/dither/matrices";
import type { Rgba } from "@/lib/dither/tokens";

/**
 * CPU dithering for still images. Pure functions over RGBA pixels: the
 * input is never changed and the result is a new `ImageData`, so this runs
 * on the main thread or in a Web Worker (anywhere `ImageData` exists).
 */

export type OrderedMethod = "bayer4" | "bayer8" | "blue-noise";
export type DiffusionMethod = "floyd-steinberg" | "atkinson" | "sierra-lite";
export type DitherMethod = OrderedMethod | DiffusionMethod;

export const DITHER_METHODS = [
  "bayer4",
  "bayer8",
  "blue-noise",
  "floyd-steinberg",
  "atkinson",
  "sierra-lite",
] as const satisfies readonly DitherMethod[];

/** An RGB colour, each channel in [0, 1]. Alpha in an `Rgba` is ignored. */
export type PaletteColor = readonly [number, number, number] | Rgba;

/** At least two colours. Pixels map to the nearest one. */
export type ImagePalette = readonly [
  PaletteColor,
  PaletteColor,
  ...PaletteColor[],
];

/** Anything shaped like `ImageData`: RGBA bytes, row by row. */
export interface PixelBuffer {
  readonly data: Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
}

interface SharedOptions {
  /** Output colours. Default black and white. */
  palette?: ImagePalette;
  /**
   * Brightness cut-off in [0, 1]. Lower values push more pixels towards
   * the lighter colours. Default 0.5.
   */
  threshold?: number;
}

/** Ordered dithering: stable between frames, a visible pattern. */
export interface OrderedOptions extends SharedOptions {
  method: OrderedMethod;
}

/** Error diffusion: finer detail on photos and logos. */
export interface DiffusionOptions extends SharedOptions {
  method: DiffusionMethod;
  /** Alternate the scan direction each row. Default `true`. */
  serpentine?: boolean;
}

export type DiffuseOptions = OrderedOptions | DiffusionOptions;

const BLACK_AND_WHITE: ImagePalette = [
  [0, 0, 0],
  [1, 1, 1],
];

// [dx, dy, weight] for each neighbour that receives part of the error.
type Kernel = readonly (readonly [number, number, number])[];

const KERNELS = {
  atkinson: [
    [1, 0, 1 / 8],
    [2, 0, 1 / 8],
    [-1, 1, 1 / 8],
    [0, 1, 1 / 8],
    [1, 1, 1 / 8],
    [0, 2, 1 / 8],
  ],
  "floyd-steinberg": [
    [1, 0, 7 / 16],
    [-1, 1, 3 / 16],
    [0, 1, 5 / 16],
    [1, 1, 1 / 16],
  ],
  "sierra-lite": [
    [1, 0, 2 / 4],
    [-1, 1, 1 / 4],
    [0, 1, 1 / 4],
  ],
} as const satisfies Record<DiffusionMethod, Kernel>;

const nearest = (palette: ImagePalette, r: number, g: number, b: number) => {
  let best = 0;
  let bestDistance = Infinity;
  for (let index = 0; index < palette.length; index += 1) {
    const color = palette[index];
    if (!color) {
      continue;
    }
    const dr = r - color[0];
    const dg = g - color[1];
    const db = b - color[2];
    // Weighted towards green, as the eye is.
    const distance = 0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  }
  return best;
};

const write = (
  out: Uint8ClampedArray,
  offset: number,
  color: PaletteColor,
  alpha: number
) => {
  out[offset] = color[0] * 255;
  out[offset + 1] = color[1] * 255;
  out[offset + 2] = color[2] * 255;
  out[offset + 3] = alpha;
};

const ditherOrdered = (
  image: PixelBuffer,
  method: OrderedMethod,
  palette: ImagePalette,
  bias: number
): Uint8ClampedArray<ArrayBuffer> => {
  const { data, width, height } = image;
  const out = new Uint8ClampedArray(data.length);
  const map = getThresholdMap(method);
  // Spread the threshold over one step between palette colours.
  const spread = 1 / (palette.length - 1);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const threshold =
        map.thresholds[(y % map.size) * map.size + (x % map.size)] ?? 0.5;
      const shift = (0.5 - threshold) * spread + bias;
      const r = (data[offset] ?? 0) / 255 + shift;
      const g = (data[offset + 1] ?? 0) / 255 + shift;
      const b = (data[offset + 2] ?? 0) / 255 + shift;
      const color = palette[nearest(palette, r, g, b)] ?? palette[0];
      write(out, offset, color, data[offset + 3] ?? 255);
    }
  }
  return out;
};

/** Pass one pixel's rounding error on to its unvisited neighbours. */
const spreadError = ({
  error,
  height,
  kernel,
  reverse,
  width,
  work,
  x,
  y,
}: {
  error: readonly [number, number, number];
  height: number;
  kernel: Kernel;
  reverse: boolean;
  width: number;
  work: Float32Array;
  x: number;
  y: number;
}) => {
  for (const [dx, dy, weight] of kernel) {
    const nx = reverse ? x - dx : x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= width || ny >= height) {
      continue;
    }
    const target = (ny * width + nx) * 3;
    for (let channel = 0; channel < 3; channel += 1) {
      work[target + channel] =
        (work[target + channel] ?? 0) + error[channel] * weight;
    }
  }
};

const ditherDiffusion = (
  image: PixelBuffer,
  kernel: Kernel,
  palette: ImagePalette,
  bias: number,
  serpentine: boolean
): Uint8ClampedArray<ArrayBuffer> => {
  const { data, width, height } = image;
  const out = new Uint8ClampedArray(data.length);
  const work = new Float32Array(width * height * 3);
  for (let index = 0; index < width * height; index += 1) {
    for (let channel = 0; channel < 3; channel += 1) {
      work[index * 3 + channel] = (data[index * 4 + channel] ?? 0) / 255 + bias;
    }
  }

  for (let y = 0; y < height; y += 1) {
    const reverse = serpentine && y % 2 === 1;
    for (let step = 0; step < width; step += 1) {
      const x = reverse ? width - 1 - step : step;
      const index = y * width + x;
      const r = work[index * 3] ?? 0;
      const g = work[index * 3 + 1] ?? 0;
      const b = work[index * 3 + 2] ?? 0;
      const color = palette[nearest(palette, r, g, b)] ?? palette[0];
      write(out, index * 4, color, data[index * 4 + 3] ?? 255);

      spreadError({
        error: [r - color[0], g - color[1], b - color[2]],
        height,
        kernel,
        reverse,
        width,
        work,
        x,
        y,
      });
    }
  }
  return out;
};

const DEFAULT_OPTIONS: DiffuseOptions = { method: "floyd-steinberg" };

/**
 * Dither an image to a palette. Returns a new `ImageData` the same size;
 * `image` is not modified. Default: Floyd–Steinberg in black and white.
 */
export const ditherImage = (
  image: PixelBuffer,
  options: DiffuseOptions = DEFAULT_OPTIONS
): ImageData => {
  const palette = options.palette ?? BLACK_AND_WHITE;
  const bias = 0.5 - (options.threshold ?? 0.5);
  let data: Uint8ClampedArray<ArrayBuffer>;
  switch (options.method) {
    case "bayer4":
    case "bayer8":
    case "blue-noise": {
      data = ditherOrdered(image, options.method, palette, bias);
      break;
    }
    case "floyd-steinberg":
    case "atkinson":
    case "sierra-lite": {
      data = ditherDiffusion(
        image,
        KERNELS[options.method],
        palette,
        bias,
        options.serpentine ?? true
      );
      break;
    }
    default: {
      const exhaustive: never = options;
      return exhaustive;
    }
  }
  return new ImageData(data, image.width, image.height);
};
