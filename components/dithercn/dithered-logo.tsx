"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { ComponentProps, CSSProperties, RefObject } from "react";

import {
  CANVAS_CLASS,
  FADE_CLASS,
  rasterize,
  sizeCanvas,
  useDitherGrid,
  useLoadedImage,
  useSeen,
} from "@/components/dithercn/dither-image";
import type { DitherGrid } from "@/components/dithercn/dither-image";
import {
  cssColor,
  thresholdAt,
  useDitherColors,
  useFrameLoop,
} from "@/lib/dither";
import type {
  DitherColor,
  DitherMatrix,
  FillVariant,
  Rgba,
} from "@/lib/dither";
import { cn } from "@/lib/utils";

/**
 * Which part of the file becomes the logo. `"alpha"` suits SVGs and PNGs
 * on a transparent background; `"dark"` suits a dark logo on a light,
 * opaque background.
 */
export type LogoSource = "alpha" | "dark";

/** One ink for every logo, or each file's own colours. */
export type LogoTone = "mono" | "original";

/**
 * Motion over the logo. `shimmer` sweeps a diagonal band of solid ink
 * across it; `scan` runs a bright line down it that leaves solid ink
 * behind for a moment.
 */
export const LOGO_EFFECTS = ["none", "shimmer", "scan"] as const;
export type LogoEffect = (typeof LOGO_EFFECTS)[number];

export type DitheredLogoProps = Omit<ComponentProps<"div">, "children"> & {
  /** SVG or PNG URL. Cross-origin files need CORS headers. */
  src: string;
  /** The brand name, read out by screen readers. `""` hides it. */
  alt: string;
  /** Ink colour when `tone` is `"mono"`. Default `"ink"`. */
  color?: DitherColor;
  /** One ink, or the file's own colours. Default `"mono"`. */
  tone?: LogoTone;
  /** Which pixels belong to the logo. Default `"alpha"`. */
  source?: LogoSource;
  /** Texture inside the letterforms. Default `"gradient"`. */
  fill?: FillVariant;
  /**
   * Keep a solid outline one cell wide, so the shapes stay exact however
   * open the fill is. Default `true`.
   */
  outline?: boolean;
  /** Gradient fill: how much ink is left at the bottom, 0 to 1. Default 0.3. */
  floor?: number;
  /** Threshold pattern for the gradient fill. Default `"bayer4"`. */
  matrix?: DitherMatrix;
  /**
   * Size of one cell in CSS pixels. Default 1, fine enough for small
   * type. Larger cells give a chunkier, pixel-art mark.
   */
  cell?: number;
  /** Motion over the logo. Off under reduced motion. Default `"none"`. */
  effect?: LogoEffect;
  /** Seconds per sweep. Default 6. */
  period?: number;
  /** Where in the sweep this logo starts, 0 to 1. Offsets logos in a row. Default 0. */
  phase?: number;
  /**
   * Width over height. Default: the logo's own ratio, once it loads. Set
   * it to reserve the space up front.
   */
  ratio?: number;
  /**
   * Load only when the logo nears the viewport. Turn it off inside a
   * clipped, moving row, where logos only intersect once they slide in.
   * Default `true`.
   */
  lazy?: boolean;
};

type LogoImageStatus = ReturnType<typeof useLoadedImage>["status"];
interface ProcessedLogo {
  shape: LogoShape;
  work: ImageData;
}

/** The logo on its cell grid, worked out once per size. */
interface LogoShape {
  readonly grid: DitherGrid;
  /** 1 where a cell is inside the logo. */
  readonly inside: Uint8Array;
  /** 1 where an inside cell touches the outside. */
  readonly rim: Uint8Array;
  /** The file's colour per cell, for `tone="original"`. */
  readonly pixels: ImageData;
  /** First and last rows with any ink. */
  readonly top: number;
  readonly bottom: number;
}

const coverageAt = (
  data: Uint8ClampedArray,
  index: number,
  source: LogoSource
) => {
  const offset = index * 4;
  const alpha = (data[offset + 3] ?? 0) / 255;
  if (source === "alpha") {
    return alpha;
  }
  const light =
    (0.2126 * (data[offset] ?? 0) +
      0.7152 * (data[offset + 1] ?? 0) +
      0.0722 * (data[offset + 2] ?? 0)) /
    255;
  return (1 - light) * alpha;
};

// Colour distance, 0 to 3 in summed RGB, that counts as a new part.
const COLOR_SEAM = 0.3;

/** Summed RGB distance between two pixels, 0 to 3. */
const colorGap = (data: Uint8ClampedArray, a: number, b: number) =>
  (Math.abs((data[a] ?? 0) - (data[b] ?? 0)) +
    Math.abs((data[a + 1] ?? 0) - (data[b + 1] ?? 0)) +
    Math.abs((data[a + 2] ?? 0) - (data[b + 2] ?? 0))) /
  255;

/**
 * Threshold the rasterised logo at half coverage, so every edge lands on
 * a cell boundary instead of fraying into dither.
 */
const shapeOf = (
  pixels: ImageData,
  grid: DitherGrid,
  source: LogoSource
): LogoShape => {
  const { columns, rows } = grid;
  const inside = new Uint8Array(columns * rows);
  let top = rows;
  let bottom = 0;
  for (let index = 0; index < inside.length; index += 1) {
    if (coverageAt(pixels.data, index, source) >= 0.5) {
      inside[index] = 1;
      const row = Math.floor(index / columns);
      top = Math.min(top, row);
      bottom = Math.max(bottom, row);
    }
  }
  const at = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < columns && y < rows
      ? (inside[y * columns + x] ?? 0)
      : 0;
  // Inner edges too: where the file changes colour, as between the parts
  // of a multicolour mark, so the parts stay apart in one ink.
  const seam = (x: number, y: number, dx: number, dy: number) =>
    at(x + dx, y + dy) === 1 &&
    colorGap(
      pixels.data,
      (y * columns + x) * 4,
      ((y + dy) * columns + x + dx) * 4
    ) > COLOR_SEAM;
  const rim = new Uint8Array(inside.length);
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const edge =
        at(x, y) === 1 &&
        (at(x - 1, y) === 0 ||
          at(x + 1, y) === 0 ||
          at(x, y - 1) === 0 ||
          at(x, y + 1) === 0 ||
          seam(x, y, 1, 0) ||
          seam(x, y, 0, 1));
      rim[y * columns + x] = edge ? 1 : 0;
    }
  }
  return { bottom, grid, inside, pixels, rim, top };
};

/** Whether a textured fill inks this cell at `density` (0 to 1). */
const fillInks = (
  fill: FillVariant,
  matrix: DitherMatrix,
  x: number,
  y: number,
  density: number
) => {
  switch (fill) {
    case "solid": {
      return true;
    }
    case "dotted": {
      return y % 2 === 0 && (x + y / 2) % 2 === 0;
    }
    case "hatched": {
      return (x + y) % 4 === 3;
    }
    case "gradient": {
      return density > thresholdAt(matrix, x, y);
    }
    default: {
      const exhaustive: never = fill;
      return exhaustive;
    }
  }
};

// Width of the shimmer band, as a share of the logo.
const BAND = 0.14;
// Rows of solid ink the scan line leaves behind it, as a share of the logo.
const TRAIL = 0.35;

/**
 * How much the effect fills in each cell at `sweep` (0 to 1 through one
 * pass), and whether the cell sits on the scan line itself.
 */
const effectAt = ({
  effect,
  sweep,
  x,
  y,
  columns,
  top,
  height,
}: {
  effect: LogoEffect;
  sweep: number;
  x: number;
  y: number;
  columns: number;
  top: number;
  height: number;
}) => {
  if (effect === "shimmer") {
    const along = x / columns - ((y - top) / height) * 0.3;
    const center = -BAND * 2 + sweep * (1 + BAND * 4);
    return { boost: Math.exp(-(((along - center) / BAND) ** 2)), line: false };
  }
  if (effect === "scan") {
    // The line travels from above the logo to below it.
    const row = top - height * TRAIL + sweep * height * (1 + TRAIL * 2);
    const behind = row - y;
    const line = Math.round(row) === y;
    const boost =
      behind >= 0 && behind < height * TRAIL
        ? 1 - behind / (height * TRAIL)
        : 0;
    return { boost, line };
  }
  return { boost: 0, line: false };
};

interface PaintOptions {
  shape: LogoShape;
  work: ImageData;
  ink: Rgba;
  glint: Rgba;
  tone: LogoTone;
  fill: FillVariant;
  outline: boolean;
  floor: number;
  matrix: DitherMatrix;
  effect: LogoEffect;
  sweep: number;
}

const writeCell = (
  out: Uint8ClampedArray,
  offset: number,
  color: Rgba | readonly number[]
) => {
  out[offset] = (color[0] ?? 0) * 255;
  out[offset + 1] = (color[1] ?? 0) * 255;
  out[offset + 2] = (color[2] ?? 0) * 255;
  out[offset + 3] = (color[3] ?? 1) * 255;
};

/** The file's colour at a cell, 0 to 1. */
const sourceColor = (data: Uint8ClampedArray, offset: number) =>
  [
    (data[offset] ?? 0) / 255,
    (data[offset + 1] ?? 0) / 255,
    (data[offset + 2] ?? 0) / 255,
    1,
  ] as const;

const paintLogo = ({
  shape,
  work,
  ink,
  glint,
  tone,
  fill,
  outline,
  floor,
  matrix,
  effect,
  sweep,
}: PaintOptions) => {
  const { columns, rows } = shape.grid;
  const out = work.data;
  const height = Math.max(1, shape.bottom - shape.top);
  for (let y = 0; y < rows; y += 1) {
    const fall =
      1 - (1 - floor) * Math.min(1, Math.max(0, (y - shape.top) / height));
    for (let x = 0; x < columns; x += 1) {
      const index = y * columns + x;
      const offset = index * 4;
      if (shape.inside[index] !== 1) {
        out[offset + 3] = 0;
        continue;
      }
      const { boost, line } = effectAt({
        columns,
        effect,
        height,
        sweep,
        top: shape.top,
        x,
        y,
      });
      const density = fall + (1 - fall) * boost;
      const inked =
        (outline && shape.rim[index] === 1) ||
        fillInks(fill, matrix, x, y, density) ||
        boost > thresholdAt(matrix, x, y);
      if (!inked) {
        out[offset + 3] = 0;
        continue;
      }
      const base =
        tone === "original" ? sourceColor(shape.pixels.data, offset) : ink;
      writeCell(out, offset, line ? glint : base);
    }
  }
};

const paintLogoFrame = (
  canvas: HTMLCanvasElement | null,
  work: ImageData | null,
  shape: LogoShape | null,
  colors: readonly Rgba[] | null,
  options: {
    effect: LogoEffect;
    fill: FillVariant;
    floor: number;
    matrix: DitherMatrix;
    outline: boolean;
    period: number;
    phase: number;
    tone: LogoTone;
  },
  time: number
) => {
  const context = canvas?.getContext("2d");
  if (!(context && work && shape && colors)) {
    return;
  }
  const [ink, glint] = colors;
  if (!(ink && glint)) {
    return;
  }
  const { effect, fill, floor, matrix, outline, period, phase, tone } = options;
  const moving = effect !== "none";
  const sweep = moving
    ? (((time / Math.max(0.5, period) + phase) % 1) + 1) % 1
    : 0;
  paintLogo({
    effect: moving ? effect : "none",
    fill,
    floor,
    glint,
    ink,
    matrix,
    outline,
    shape,
    sweep,
    tone,
    work,
  });
  context.putImageData(work, 0, 0);
};

const useLogoShape = (
  image: HTMLImageElement | null,
  grid: DitherGrid | null,
  source: LogoSource
): ProcessedLogo | null => {
  const columns = grid?.columns ?? 0;
  const rows = grid?.rows ?? 0;
  const scale = grid?.scale ?? 0;
  const width = grid?.width ?? 0;
  const height = grid?.height ?? 0;
  return useMemo(() => {
    if (!(image && columns && rows)) {
      return null;
    }
    const shapeGrid = { columns, height, rows, scale, width };
    const pixels = rasterize(image, columns, rows, "contain");
    if (!pixels) {
      return null;
    }
    return {
      shape: shapeOf(pixels, shapeGrid, source),
      work: new ImageData(columns, rows),
    };
  }, [columns, height, image, rows, scale, source, width]);
};

const useLogoAnimation = (
  rootRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  processedLogo: ProcessedLogo | null,
  colors: readonly Rgba[] | null,
  options: {
    effect: LogoEffect;
    fill: FillVariant;
    floor: number;
    matrix: DitherMatrix;
    outline: boolean;
    period: number;
    phase: number;
    tone: LogoTone;
  }
) => {
  const { effect, fill, floor, matrix, outline, period, phase, tone } = options;
  const shape = processedLogo?.shape ?? null;
  const draw = (time: number) =>
    paintLogoFrame(
      canvasRef.current,
      processedLogo?.work ?? null,
      shape,
      colors,
      options,
      time
    );
  const loop = useFrameLoop(draw, {
    enabled: effect !== "none" && shape !== null,
    fps: 30,
    stillTime: -phase * period,
    target: rootRef,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!(canvas && shape)) {
      return;
    }
    sizeCanvas(canvas, shape.grid);
    paintLogoFrame(
      canvas,
      processedLogo?.work ?? null,
      shape,
      colors,
      { effect, fill, floor, matrix, outline, period, phase, tone },
      -phase * period
    );
  }, [
    canvasRef,
    colors,
    effect,
    fill,
    floor,
    matrix,
    outline,
    period,
    phase,
    processedLogo,
    shape,
    tone,
  ]);
  return loop;
};

const useLogoAspectRatio = (
  rootRef: RefObject<HTMLDivElement | null>,
  aspectRatio: CSSProperties["aspectRatio"] | undefined
) => {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || aspectRatio === undefined) {
      return;
    }
    root.style.setProperty("--dithered-logo-aspect-ratio", String(aspectRatio));
    return () => {
      root.style.removeProperty("--dithered-logo-aspect-ratio");
    };
  }, [aspectRatio, rootRef]);
};

const DitheredLogoFrame = ({
  props,
  rootRef,
  canvasRef,
  alt,
  status,
  shape,
  effect,
  loop,
  aspectRatio,
  className,
}: {
  props: ComponentProps<"div">;
  rootRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  alt: string;
  status: LogoImageStatus;
  shape: LogoShape | null;
  effect: LogoEffect;
  loop: ReturnType<typeof useFrameLoop>;
  aspectRatio: CSSProperties["aspectRatio"] | undefined;
  className?: string;
}) => {
  const decorative = alt === "";
  const state = status === "ready" && !shape ? "loading" : status;
  const loopState = effect === "none" ? undefined : loop;
  const aspectClass =
    aspectRatio !== undefined && "aspect-(--dithered-logo-aspect-ratio)";
  const canvasClass = shape ? "opacity-100" : "opacity-0";
  return (
    <div
      {...props}
      ref={rootRef}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
      data-state={state}
      data-loop={loopState}
      className={cn(
        "relative h-8 shrink-0 overflow-hidden",
        aspectClass,
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(CANVAS_CLASS, FADE_CLASS, canvasClass)}
      />
    </div>
  );
};

const normalizeLogoProps = ({
  src,
  alt,
  color = "ink",
  tone = "mono",
  source = "alpha",
  fill = "gradient",
  outline = true,
  floor = 0.3,
  matrix = "bayer4",
  cell = 1,
  effect = "none",
  period = 6,
  phase = 0,
  ratio,
  lazy = true,
  className,
  ...divProps
}: DitheredLogoProps) => ({
  alt,
  cell,
  className,
  color,
  divProps,
  effect,
  fill,
  floor,
  lazy,
  matrix,
  outline,
  period,
  phase,
  ratio,
  source,
  src,
  tone,
});

/**
 * A logo drawn in dithered ink. Edges land on whole cells, so the shapes
 * stay sharp while the inside takes a dither texture, with an optional
 * shimmer or scan line. Size it with a height in `className`; the width
 * follows the logo's own ratio.
 */
export const DitheredLogo = (input: DitheredLogoProps) => {
  const {
    src,
    alt,
    color,
    tone,
    source,
    fill,
    outline,
    floor,
    matrix,
    cell,
    effect,
    period,
    phase,
    ratio,
    lazy,
    className,
    divProps,
  } = normalizeLogoProps(input);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seen = useSeen(rootRef);
  const { image, status } = useLoadedImage(src, seen || !lazy);
  const grid = useDitherGrid(rootRef, cell);
  const colors = useDitherColors(rootRef, [
    color,
    `color-mix(in oklch, ${cssColor(color)} 35%, white)`,
  ]);
  const processedLogo = useLogoShape(image, grid, source);
  const shape = processedLogo?.shape ?? null;
  const options = { effect, fill, floor, matrix, outline, period, phase, tone };
  const loop = useLogoAnimation(
    rootRef,
    canvasRef,
    processedLogo,
    colors,
    options
  );
  const aspectRatio =
    divProps.style?.aspectRatio ??
    ratio ??
    (image ? image.naturalWidth / image.naturalHeight : undefined);
  useLogoAspectRatio(rootRef, aspectRatio);

  return (
    <DitheredLogoFrame
      props={divProps}
      rootRef={rootRef}
      canvasRef={canvasRef}
      alt={alt}
      status={status}
      shape={shape}
      effect={effect}
      loop={loop}
      aspectRatio={aspectRatio}
      className={className}
    />
  );
};
