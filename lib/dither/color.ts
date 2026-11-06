"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";

import { cssColor } from "@/lib/dither/tokens";
import type { DitherColor, Rgba } from "@/lib/dither/tokens";

const DEFAULT_CELL = 3;

let probe: CanvasRenderingContext2D | null = null;

const getProbe = () => {
  if (!probe) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    probe = canvas.getContext("2d", { willReadFrequently: true });
  }
  return probe;
};

/**
 * Resolve a colour to sRGB. CSS variables resolve in the context of `el`
 * (the document root by default), so scoped overrides apply. Any format
 * the browser understands works, including oklch, because the colour is
 * painted into a 1x1 canvas and read back.
 */
export const resolveColor = (value: DitherColor, el?: Element | null): Rgba => {
  const host = el ?? document.documentElement;
  const span = document.createElement("span");
  span.style.color = cssColor(value);
  span.style.display = "none";
  host.append(span);
  const { color } = getComputedStyle(span);
  span.remove();

  const context = getProbe();
  if (!context) {
    return [0, 0, 0, 1];
  }
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0, a = 0] = context.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255, a / 255];
};

/** The dither cell size in CSS pixels, read from `--dither-cell` on `el`. */
export const readDitherCell = (el?: Element | null): number => {
  const host = el ?? document.documentElement;
  const value = Number(
    getComputedStyle(host).getPropertyValue("--dither-cell")
  );
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_CELL;
};

const themeListeners = new Set<() => void>();
let themeObserver: MutationObserver | null = null;

/**
 * Call `listener` whenever the class or style of `<html>` changes, which is
 * how next-themes and most theme switchers swap palettes. One observer is
 * shared by every subscriber. Returns the unsubscribe function.
 */
export const subscribeToTheme = (listener: () => void): (() => void) => {
  themeListeners.add(listener);
  if (!themeObserver) {
    themeObserver = new MutationObserver(() => {
      for (const notify of themeListeners) {
        notify();
      }
    });
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["class", "style", "data-theme"],
      attributes: true,
    });
  }
  return () => {
    themeListeners.delete(listener);
    if (themeListeners.size === 0) {
      themeObserver?.disconnect();
      themeObserver = null;
    }
  };
};

const DEFAULT_NAMES = ["--dither-ink", "--dither-paper"] as const;

type ResolvedColors<Names extends readonly DitherColor[]> = {
  readonly [Index in keyof Names]: Rgba;
};

/**
 * Resolve a list of colours (CSS variable names by default) and re-resolve
 * them when the site theme changes. Returns `null` until mounted.
 *
 * ```ts
 * const colors = useDitherColors(ref);
 * if (colors) { const [ink, paper] = colors; }
 * ```
 */
export function useDitherColors(
  el?: RefObject<Element | null>
): ResolvedColors<typeof DEFAULT_NAMES> | null;
export function useDitherColors<const Names extends readonly DitherColor[]>(
  el: RefObject<Element | null> | undefined,
  names: Names
): ResolvedColors<Names> | null;
export function useDitherColors(
  el?: RefObject<Element | null>,
  names: readonly DitherColor[] = DEFAULT_NAMES
): readonly Rgba[] | null {
  const [colors, setColors] = useState<readonly Rgba[] | null>(null);
  const key = names.join("|");

  useEffect(() => {
    const list = key === "" ? [] : key.split("|");
    const read = () =>
      setColors(list.map((name) => resolveColor(name, el?.current)));
    read();
    return subscribeToTheme(read);
  }, [el, key]);

  return colors;
}
