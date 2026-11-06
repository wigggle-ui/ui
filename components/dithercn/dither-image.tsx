"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ComponentProps, CSSProperties, RefObject } from "react";

import {
  cssColor,
  ditherImage,
  fillStyle,
  readDitherCell,
  useDitherColors,
  useInView,
  usePrefersReducedMotion,
} from "@/lib/dither";
import type {
  DitherColor,
  DitherMethod,
  DitherPalette,
  Rgba,
} from "@/lib/dither";
import { cn } from "@/lib/utils";

import styles from "@/components/dithercn/dither-image.module.css";

/**
 * The cell grid an image is dithered on. One cell is `scale` device
 * pixels, a whole number, so cells stay crisp at any zoom. The canvas is
 * `width` x `height` CSS pixels, which can overshoot its box by less than
 * one cell.
 */
export interface DitherGrid {
  readonly columns: number;
  readonly rows: number;
  readonly scale: number;
  readonly width: number;
  readonly height: number;
}

export type ImageFit = "cover" | "contain";

/** The looks `DitherImage` ships with. */
export const DITHER_IMAGE_PRESETS = [
  "ink",
  "duotone",
  "newsprint",
  "gameboy",
  "riso",
] as const;
export type DitherImagePreset = (typeof DITHER_IMAGE_PRESETS)[number];

/** What a preset decides. Every field can be overridden by a prop. */
export interface PresetRecipe {
  method: DitherMethod;
  /** Cell size in CSS pixels. */
  cell: number;
  contrast: number;
  /** The palette, given the `color` prop. */
  palette: (color: DitherColor) => DitherPalette;
}

// A share of `color` mixed into the page colour, for in-between tones.
const tint = (color: DitherColor, share: number) =>
  `color-mix(in oklch, ${cssColor(color)} ${share}%, var(--dither-paper))`;

const NEWSPRINT = [
  "oklch(0.22 0.012 70)",
  "oklch(0.93 0.022 88)",
] as const satisfies DitherPalette;

const GAMEBOY = [
  "oklch(0.27 0.06 145)",
  "oklch(0.43 0.09 140)",
  "oklch(0.68 0.15 125)",
  "oklch(0.75 0.16 122)",
] as const satisfies DitherPalette;

const RISO = [
  "oklch(0.3 0.1 268)",
  "oklch(0.56 0.2 262)",
  "oklch(0.73 0.17 2)",
  "oklch(0.95 0.02 85)",
] as const satisfies DitherPalette;

export const IMAGE_PRESETS = {
  // Two tones: the page colour and one ink. Follows the theme.
  duotone: {
    cell: 2,
    contrast: 1.1,
    method: "blue-noise",
    palette: (color) => ["--dither-paper", tint(color, 42), color],
  },
  // Clean highlights in one ink on the page colour. Follows the theme.
  gameboy: {
    cell: 3,
    contrast: 1.15,
    method: "bayer4",
    palette: () => GAMEBOY,
  },
  ink: {
    cell: 2,
    contrast: 1,
    method: "atkinson",
    palette: (color) => ["--dither-paper", color],
  },
  // A regular ordered screen, black on warm paper, in both themes.
  newsprint: {
    cell: 2,
    contrast: 1.25,
    method: "bayer8",
    palette: () => NEWSPRINT,
  },
  // Navy, blue and pink on cream, like a two-drum print.
  riso: {
    cell: 2,
    contrast: 1.15,
    method: "atkinson",
    palette: () => RISO,
  },
} as const satisfies Record<DitherImagePreset, PresetRecipe>;

/** How a photo's tones become palette colours. */
export interface ToneOptions {
  method: DitherMethod;
  /** 1 leaves contrast alone; higher values push tones apart. */
  contrast: number;
  /** Added to every tone, from -1 to 1. */
  brightness: number;
  /** Swap light and dark. */
  invert: boolean;
  /** Stretch the darkest and lightest tones to the ends of the palette. */
  normalize: boolean;
  /** Edge sharpening before dithering, 0 to 1. */
  sharpen: number;
  fit: ImageFit;
}

/**
 * The props that decide how a dithered image looks, shared by every image
 * component in dithercn.
 */
export interface DitherLook {
  /** A starting look. Default `"duotone"`. */
  preset?: DitherImagePreset;
  /** The ink for the `ink` and `duotone` presets. Default `"ink"`. */
  color?: DitherColor;
  /**
   * Two to four colours, which replace the preset's. Palette names such
   * as `"green"` work. Sorted from dark to light, so dark parts of the
   * image take the darkest colour.
   */
  palette?: DitherPalette;
  /** Dither algorithm. Default from the preset. */
  method?: DitherMethod;
  /** Size of one cell in CSS pixels. Default from the preset. */
  cell?: number;
  /** 1 leaves contrast alone. Default from the preset. */
  contrast?: number;
  /** Shifts every tone, from -1 to 1. Default 0. */
  brightness?: number;
  /** Swap light and dark. Default `false`. */
  invert?: boolean;
  /** Stretch the image's tones to fill the palette. Default `true`. */
  normalize?: boolean;
  /** Edge sharpening before dithering, 0 to 1. Default 0.3. */
  sharpen?: number;
  /** How the image fills its box, as in `object-fit`. Default `"cover"`. */
  fit?: ImageFit;
}

// A preset's cell shrinks, down to 1px, to keep at least this many columns.
const MIN_COLUMNS = 200;

/** A `DitherLook` with the preset applied and every default filled in. */
export interface ResolvedLook {
  palette: DitherPalette;
  cell: number;
  /**
   * Fewest columns before the cell shrinks below `cell`, so a small
   * thumbnail keeps enough detail to read. 0 when `cell` was set.
   */
  minColumns: number;
  tone: ToneOptions;
}

export const resolveLook = ({
  preset = "duotone",
  color = "ink",
  palette,
  method,
  cell,
  contrast,
  brightness = 0,
  invert = false,
  normalize = true,
  sharpen = 0.3,
  fit = "cover",
}: DitherLook): ResolvedLook => {
  const recipe: PresetRecipe = IMAGE_PRESETS[preset];
  return {
    cell: cell ?? recipe.cell,
    minColumns: cell === undefined ? MIN_COLUMNS : 0,
    palette: palette ?? recipe.palette(color),
    tone: {
      brightness,
      contrast: contrast ?? recipe.contrast,
      fit,
      invert,
      method: method ?? recipe.method,
      normalize,
      sharpen,
    },
  };
};

/**
 * Split a component's props into its `DitherLook` and everything else,
 * so the look can be resolved once and the rest spread onto the root.
 */
export const splitLook = <Props extends DitherLook>({
  preset,
  color,
  palette,
  method,
  cell,
  contrast,
  brightness,
  invert,
  normalize,
  sharpen,
  fit,
  ...rest
}: Props) => ({
  look: resolveLook({
    brightness,
    cell,
    color,
    contrast,
    fit,
    invert,
    method,
    normalize,
    palette,
    preset,
    sharpen,
  }),
  rest,
});

const imageCache = new Map<string, Promise<HTMLImageElement>>();

/**
 * Load and decode an image once per URL. Cross-origin images need CORS
 * headers, as the pixels are read back from a canvas.
 */
const decode = async (src: string) => {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.decoding = "async";
  image.src = src;
  try {
    await image.decode();
    return image;
  } catch (error) {
    // Let a later call try again.
    imageCache.delete(src);
    throw error;
  }
};

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  const cached = imageCache.get(src);
  if (cached) {
    return cached;
  }
  const promise = decode(src);
  imageCache.set(src, promise);
  return promise;
};

export type ImageStatus = "idle" | "loading" | "ready" | "error";

/**
 * Load an image when `enabled` turns true (usually when its box nears the
 * viewport). `status` is `"idle"` until then.
 */
export const useLoadedImage = (src: string, enabled: boolean) => {
  const [result, setResult] = useState<{
    src: string;
    image: HTMLImageElement | null;
  } | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let cancelled = false;
    const load = async () => {
      let image: HTMLImageElement | null = null;
      try {
        image = await loadImage(src);
      } catch {
        image = null;
      }
      if (!cancelled) {
        setResult({ image, src });
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [src, enabled]);

  if (!enabled || result?.src !== src) {
    return { image: null, status: enabled ? "loading" : "idle" } as const;
  }
  return result.image
    ? ({ image: result.image, status: "ready" } as const)
    : ({ image: null, status: "error" } as const);
};

/** `true` once the element has come within `rootMargin` of the viewport. */
export const useSeen = (ref: RefObject<Element | null>, rootMargin = "320px") =>
  useInView(ref, { rootMargin, triggerOnce: true });

const gridFor = (width: number, height: number, cell: number): DitherGrid => {
  const ratio = window.devicePixelRatio || 1;
  const scale = Math.max(1, Math.round(cell * ratio));
  const columns = Math.max(1, Math.ceil((width * ratio) / scale));
  const rows = Math.max(1, Math.ceil((height * ratio) / scale));
  return {
    columns,
    height: (rows * scale) / ratio,
    rows,
    scale,
    width: (columns * scale) / ratio,
  };
};

const sameGrid = (a: DitherGrid | null, b: DitherGrid) =>
  a !== null &&
  a.columns === b.columns &&
  a.rows === b.rows &&
  a.scale === b.scale;

/**
 * The same box on a grid `factor` times coarser, for the blocky first
 * frames of a resolve. Cells stay whole device pixels.
 */
export const coarsen = (grid: DitherGrid, factor: number): DitherGrid => {
  const step = Math.max(1, Math.round(factor));
  if (step === 1) {
    return grid;
  }
  const ratio = (grid.columns * grid.scale) / grid.width;
  const scale = grid.scale * step;
  const columns = Math.max(1, Math.ceil(grid.columns / step));
  const rows = Math.max(1, Math.ceil(grid.rows / step));
  return {
    columns,
    height: (rows * scale) / ratio,
    rows,
    scale,
    width: (columns * scale) / ratio,
  };
};

/**
 * The cell grid for the element's current size, updated on resize and
 * zoom. `cell` is in CSS pixels; omit it to read `--dither-cell`.
 */
export const useDitherGrid = (
  ref: RefObject<HTMLElement | null>,
  cell?: number,
  minColumns = 0
): DitherGrid | null => {
  const [grid, setGrid] = useState<DitherGrid | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width < 1 || height < 1) {
        return;
      }
      const base = cell ?? readDitherCell(el);
      const size =
        minColumns > 0 ? Math.min(base, Math.max(1, width / minColumns)) : base;
      const next = gridFor(width, height, size);
      setGrid((current) => (sameGrid(current, next) ? current : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, cell, minColumns]);

  return grid;
};

const makeCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

/** Where the image lands in a `columns` x `rows` box, as object-fit does. */
const fitRect = (
  image: HTMLImageElement,
  columns: number,
  rows: number,
  fit: ImageFit
) => {
  const scaleX = columns / image.naturalWidth;
  const scaleY = rows / image.naturalHeight;
  const scale =
    fit === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  return {
    height,
    width,
    x: (columns - width) / 2,
    y: (rows - height) / 2,
  };
};

/**
 * Draw `image` into a `columns` x `rows` buffer, one pixel per cell.
 * Large downscales halve in steps first, which keeps fine detail from
 * aliasing into noise.
 */
export const rasterize = (
  image: HTMLImageElement,
  columns: number,
  rows: number,
  fit: ImageFit
): ImageData | null => {
  const rect = fitRect(image, columns, rows, fit);
  let source: CanvasImageSource = image;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  while (sourceWidth / 2 > rect.width && sourceHeight / 2 > rect.height) {
    const half = makeCanvas(
      Math.ceil(sourceWidth / 2),
      Math.ceil(sourceHeight / 2)
    );
    const context = half.getContext("2d");
    if (!context) {
      break;
    }
    context.imageSmoothingQuality = "high";
    context.drawImage(source, 0, 0, half.width, half.height);
    source = half;
    sourceWidth = half.width;
    sourceHeight = half.height;
  }

  const canvas = makeCanvas(columns, rows);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }
  context.imageSmoothingQuality = "high";
  context.drawImage(source, rect.x, rect.y, rect.width, rect.height);
  return context.getImageData(0, 0, columns, rows);
};

const luminance = (color: Rgba) =>
  0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];

/**
 * Palette colours from darkest to lightest, so dark parts of a photo take
 * the darkest colour in both light and dark themes.
 */
export const byLuminance = (colors: readonly Rgba[]): Rgba[] =>
  colors.toSorted((a, b) => luminance(a) - luminance(b));

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Lightness of every pixel, 0 to 1. */
const lightnessOf = ({ data, width, height }: ImageData) => {
  const light = new Float32Array(width * height);
  for (let index = 0; index < light.length; index += 1) {
    const offset = index * 4;
    light[index] =
      (0.2126 * (data[offset] ?? 0) +
        0.7152 * (data[offset + 1] ?? 0) +
        0.0722 * (data[offset + 2] ?? 0)) /
      255;
  }
  return light;
};

/**
 * The tones at the 0.5th and 99.5th percentiles, ignoring transparent
 * pixels. Stretching between them fills the palette without letting a few
 * specks of white or black set the range.
 */
const toneRange = (light: Float32Array, data: Uint8ClampedArray) => {
  const histogram = new Uint32Array(256);
  let total = 0;
  for (let index = 0; index < light.length; index += 1) {
    if ((data[index * 4 + 3] ?? 0) > 127) {
      histogram[Math.round((light[index] ?? 0) * 255)] += 1;
      total += 1;
    }
  }
  const edge = total * 0.005;
  let low = 0;
  let seen = 0;
  while (low < 255 && seen + (histogram[low] ?? 0) <= edge) {
    seen += histogram[low] ?? 0;
    low += 1;
  }
  let high = 255;
  seen = 0;
  while (high > low && seen + (histogram[high] ?? 0) <= edge) {
    seen += histogram[high] ?? 0;
    high -= 1;
  }
  return { high: high / 255, low: low / 255 };
};

// Share of the tone range left free at each end after normalising.
const HEADROOM = 0.04;

/** A 3 x 3 box blur, for unsharp masking. Edges clamp. */
const boxBlur = (light: Float32Array, width: number, height: number) => {
  const out = new Float32Array(light.length);
  for (let y = 0; y < height; y += 1) {
    const up = Math.max(0, y - 1) * width;
    const row = y * width;
    const down = Math.min(height - 1, y + 1) * width;
    for (let x = 0; x < width; x += 1) {
      const left = Math.max(0, x - 1);
      const right = Math.min(width - 1, x + 1);
      out[row + x] =
        ((light[up + left] ?? 0) +
          (light[up + x] ?? 0) +
          (light[up + right] ?? 0) +
          (light[row + left] ?? 0) +
          (light[row + x] ?? 0) +
          (light[row + right] ?? 0) +
          (light[down + left] ?? 0) +
          (light[down + x] ?? 0) +
          (light[down + right] ?? 0)) /
        9;
    }
  }
  return out;
};

/**
 * The tone of every pixel after levels, sharpening, contrast, brightness
 * and invert, 0 to 1.
 */
export const prepareTones = (
  pixels: ImageData,
  {
    contrast,
    brightness,
    invert,
    normalize,
    sharpen,
  }: Omit<ToneOptions, "fit" | "method">
): Float32Array => {
  const { width, height, data } = pixels;
  const light = lightnessOf(pixels);
  const { low, high } = normalize
    ? toneRange(light, data)
    : { high: 1, low: 0 };
  const span = high - low > 0.1 ? high - low : 1;
  const base = span === 1 ? 0 : low;
  const blur = sharpen > 0 ? boxBlur(light, width, height) : light;
  // Sharpening pushes each pixel away from its neighbourhood average.
  const amount = sharpen * 1.5;
  for (let index = 0; index < light.length; index += 1) {
    const value = light[index] ?? 0;
    const sharp = value + amount * (value - (blur[index] ?? value));
    // Normalised tones stop short of the ends, so the brightest and
    // darkest areas keep a little grain instead of going flat.
    const level = normalize
      ? HEADROOM + ((sharp - base) / span) * (1 - HEADROOM * 2)
      : (sharp - base) / span;
    const tone = clamp01((level - 0.5) * contrast + 0.5 + brightness);
    light[index] = invert ? 1 - tone : tone;
  }
  return light;
};

/**
 * Dither a rasterised image to `colors` (darkest first). Works in tone
 * only: the photo becomes grey, the grey is dithered to as many steps as
 * there are colours, and each step takes its colour.
 */
export const ditherPixels = (
  pixels: ImageData,
  colors: readonly Rgba[],
  { method, ...tone }: Omit<ToneOptions, "fit">
): ImageData => {
  const { data, width, height } = pixels;
  const steps = Math.max(2, colors.length);
  const tones = prepareTones(pixels, tone);
  const greys = new Uint8ClampedArray(data.length);
  for (let index = 0; index < tones.length; index += 1) {
    const offset = index * 4;
    const value = (tones[index] ?? 0) * 255;
    greys[offset] = value;
    greys[offset + 1] = value;
    greys[offset + 2] = value;
    greys[offset + 3] = data[offset + 3] ?? 0;
  }

  const levels = Array.from({ length: steps }, (_, index) => {
    const grey = index / (steps - 1);
    return [grey, grey, grey] as const;
  });
  const [first = [0, 0, 0] as const, second = [1, 1, 1] as const, ...rest] =
    levels;
  const result = ditherImage(
    { data: greys, height, width },
    { method, palette: [first, second, ...rest] }
  );

  const out = result.data;
  for (let offset = 0; offset < out.length; offset += 4) {
    const step = Math.round(((out[offset] ?? 0) / 255) * (steps - 1));
    const color = colors[step] ?? colors[0];
    if (!color) {
      continue;
    }
    out[offset] = color[0] * 255;
    out[offset + 1] = color[1] * 255;
    out[offset + 2] = color[2] * 255;
    out[offset + 3] = color[3] * (out[offset + 3] ?? 0);
  }
  return result;
};

/** Rasterise and dither in one go. */
export const renderDitheredImage = (
  image: HTMLImageElement,
  grid: DitherGrid,
  colors: readonly Rgba[],
  { fit, ...tone }: ToneOptions
): ImageData | null => {
  const pixels = rasterize(image, grid.columns, grid.rows, fit);
  return pixels ? ditherPixels(pixels, colors, tone) : null;
};

/** Size a canvas to the grid: one canvas pixel per cell, scaled up crisp. */
export const sizeCanvas = (canvas: HTMLCanvasElement, grid: DitherGrid) => {
  if (canvas.width !== grid.columns || canvas.height !== grid.rows) {
    canvas.width = grid.columns;
    canvas.height = grid.rows;
  }
  canvas.style.width = `${grid.width}px`;
  canvas.style.height = `${grid.height}px`;
};

/** One dithered image at one grid. */
export interface DitherFrame {
  readonly pixels: ImageData;
  readonly grid: DitherGrid;
}

/** Put a frame on a canvas, resizing the canvas to its grid. */
export const paintFrame = (
  canvas: HTMLCanvasElement | null,
  frame: DitherFrame | null
) => {
  if (!(canvas && frame)) {
    return;
  }
  sizeCanvas(canvas, frame.grid);
  canvas.getContext("2d")?.putImageData(frame.pixels, 0, 0);
};

export const CANVAS_CLASS =
  "pointer-events-none absolute top-0 left-0 max-w-none [image-rendering:pixelated]";

/** Fades a canvas in once its first frame is drawn. */
export const FADE_CLASS = `transition-opacity duration-150 ease-(--dither-fade-ease) motion-reduce:transition-none ${styles.fadeEase}`;

/**
 * Renders a frame at `factor` times the cell size; 1 is full detail.
 * Results are cached, so scrubbing back and forth costs nothing.
 */
export type FrameRenderer = (factor: number) => DitherFrame | null;

/**
 * Everything a component needs to show a dithered image: lazy loading,
 * the cell grid and theme colours, and a cached renderer for any
 * coarseness. The renderer is `null` until all three are ready, and
 * changes identity when any of them, or the look, changes.
 */
export const useDitherSource = (
  ref: RefObject<HTMLElement | null>,
  src: string,
  { palette, cell, minColumns, tone }: ResolvedLook
) => {
  const seen = useSeen(ref);
  const { image, status } = useLoadedImage(src, seen);
  const grid = useDitherGrid(ref, cell, minColumns);
  const colors = useDitherColors(ref, palette);
  const { method, contrast, brightness, invert, normalize, sharpen, fit } =
    tone;

  const render = useMemo<FrameRenderer | null>(() => {
    if (!(image && grid && colors)) {
      return null;
    }
    const sorted = byLuminance(colors);
    const cache = new Map<number, DitherFrame | null>();
    return function renderAtFactor(factor: number) {
      const step = Math.max(1, Math.round(factor));
      const cached = cache.get(step);
      if (cached !== undefined) {
        return cached;
      }
      const target = coarsen(grid, step);
      const pixels = renderDitheredImage(image, target, sorted, {
        brightness,
        contrast,
        fit,
        invert,
        method,
        normalize,
        sharpen,
      });
      const frame = pixels ? { grid: target, pixels } : null;
      cache.set(step, frame);
      return frame;
    };
  }, [
    image,
    grid,
    colors,
    method,
    contrast,
    brightness,
    invert,
    normalize,
    sharpen,
    fit,
  ]);

  return { image, render, status };
};

/**
 * The quiet dotted field shown while an image loads, so the box never
 * reads as empty.
 */
export const LoadingField = ({
  visible,
  cell,
}: {
  visible: boolean;
  cell: number;
}) => {
  const fill = fillStyle("dotted", { cell: cell * 2, color: "grey" });
  const style: CSSProperties & {
    "--loading-field-color": CSSProperties["backgroundColor"];
    "--loading-field-mask": CSSProperties["maskImage"];
    "--loading-field-size": CSSProperties["maskSize"];
  } = {
    "--loading-field-color": fill.backgroundColor,
    "--loading-field-mask": fill.maskImage,
    "--loading-field-size": fill.maskSize,
  };
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 bg-(--loading-field-color) mask-(--loading-field-mask) mask-size-(--loading-field-size) transition-opacity duration-300 ease-out [-webkit-mask-image:var(--loading-field-mask)] [-webkit-mask-size:var(--loading-field-size)] motion-reduce:transition-none",
        visible ? "opacity-25" : "opacity-0"
      )}
      style={style}
    />
  );
};

// Coarseness of each frame of the first resolve, then full detail.
const RESOLVE_STEPS = [16, 8, 4, 2, 1] as const;
const RESOLVE_INTERVAL = 70;

/**
 * Paints the image, resolving from coarse to fine the first time each
 * `src` appears. Later changes (palette, theme, size) repaint at once.
 */
const useResolve = ({
  canvasRef,
  render,
  src,
  resolve,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  render: FrameRenderer | null;
  src: string;
  resolve: boolean;
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const resolvedRef = useRef<string | null>(null);
  const [painted, setPainted] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!render) {
      return;
    }
    const steps =
      resolve && !reducedMotion && resolvedRef.current !== src
        ? RESOLVE_STEPS
        : [1];
    resolvedRef.current = src;
    let index = 0;
    paintFrame(canvasRef.current, render(steps[0] ?? 1));
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setPainted(true);
      }
    });
    if (steps.length === 1) {
      return () => {
        cancelled = true;
      };
    }
    queueMicrotask(() => {
      if (!cancelled) {
        setResolving(true);
      }
    });
    const timer = window.setInterval(() => {
      index += 1;
      paintFrame(canvasRef.current, render(steps[index] ?? 1));
      if (index >= steps.length - 1) {
        window.clearInterval(timer);
        setResolving(false);
      }
    }, RESOLVE_INTERVAL);
    // An interrupted resolve stops here; the next run paints full detail.
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      queueMicrotask(() => setResolving(false));
    };
  }, [render, src, resolve, reducedMotion, canvasRef]);

  return { painted, resolving };
};

export type DitherImageProps = Omit<ComponentProps<"div">, "children"> &
  DitherLook & {
    /** Image URL. Cross-origin images need CORS headers. */
    src: string;
    /** Describes the image. Pass `""` for a decorative image. */
    alt: string;
    /**
     * Width over height. Default: the image's own ratio, once it loads. A
     * height set in `className` wins.
     */
    ratio?: number;
    /**
     * Resolve from coarse blocks to full detail when the image first
     * appears. Off under reduced motion. Default `true`.
     */
    resolve?: boolean;
  };

/**
 * Any image, dithered on the CPU to a preset or your own palette. It
 * loads near the viewport, resolves from coarse to fine, redraws on resize
 * and theme change, and keeps its alt text for assistive technology.
 */
export const DitherImage = (allProps: DitherImageProps) => {
  const { look, rest } = splitLook(allProps);
  const { src, alt, ratio, resolve = true, className, ...props } = rest;
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { image, render, status } = useDitherSource(rootRef, src, look);
  const { painted, resolving } = useResolve({
    canvasRef,
    render,
    resolve,
    src,
  });

  const naturalRatio = image ? image.naturalWidth / image.naturalHeight : null;
  const aspectRatio = ratio ?? naturalRatio ?? undefined;
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || aspectRatio === undefined) {
      return;
    }
    root.style.setProperty("--dither-image-aspect-ratio", String(aspectRatio));
    return () => {
      root.style.removeProperty("--dither-image-aspect-ratio");
    };
  }, [aspectRatio]);
  const state = status === "ready" && resolving ? "resolving" : status;
  const decorative = alt === "";

  return (
    <div
      {...props}
      ref={rootRef}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
      aria-busy={status === "loading" || resolving ? true : undefined}
      data-state={status === "ready" && !painted ? "loading" : state}
      className={cn(
        "relative overflow-hidden",
        aspectRatio !== undefined && "aspect-(--dither-image-aspect-ratio)",
        className
      )}
    >
      <LoadingField visible={!painted} cell={look.cell} />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          CANVAS_CLASS,
          FADE_CLASS,
          painted ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};
