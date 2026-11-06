"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { RefObject } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/** Whether the visitor asked for reduced motion. `false` on the server. */
export const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );

const subscribeToVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

/** Whether the tab is visible. `true` on the server. */
export const useDocumentVisible = (): boolean =>
  useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState === "visible",
    () => true
  );

/**
 * Whether the element is on screen, or within `rootMargin` of it.
 * `false` until the first observation.
 */
export const useInView = (
  ref: RefObject<Element | null>,
  {
    rootMargin = "120px",
    triggerOnce = false,
  }: { rootMargin?: string; triggerOnce?: boolean } = {}
): boolean => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry?.isIntersecting ?? false;
        setInView((current) =>
          triggerOnce ? current || isIntersecting : isIntersecting
        );
        if (triggerOnce && isIntersecting) {
          observer.unobserve(el);
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, triggerOnce]);

  return inView;
};

/**
 * `running`: drawing every frame. `paused`: offscreen or the tab is hidden.
 * `static`: motion is off (reduced motion or `enabled: false`), so the
 * callback ran once for a still frame.
 */
export type FrameLoopState = "running" | "paused" | "static";

/**
 * Called once per drawn frame with the seconds of motion so far (frozen
 * while paused) and the seconds since the previous frame (at most 0.1).
 * For the still frame drawn when motion is off, `delta` is 0 and `time` is
 * `stillTime`.
 */
export type FrameLoopCallback = (time: number, delta: number) => void;

export interface FrameLoopOptions {
  /** Pause while this element is offscreen. Omit to ignore visibility. */
  target?: RefObject<Element | null>;
  /** `false` holds a still frame, as reduced motion does. Default `true`. */
  enabled?: boolean;
  /** Frame rate cap. Default 30, which keeps slow drifts smooth. */
  fps?: number;
  /** The `time` passed for the still frame. Default 0. */
  stillTime?: number;
}

const NO_TARGET: RefObject<Element | null> = { current: null };

// One long frame (a tab switch, a debugger) must not jump the motion.
const MAX_DELTA = 0.1;

/**
 * A requestAnimationFrame loop that runs only when it can be seen. It
 * pauses offscreen and in hidden tabs, and under reduced motion (or
 * `enabled: false`) it calls `callback` once with `stillTime` instead.
 * Returns the loop state, which changes rarely, never per frame.
 */
export const useFrameLoop = (
  callback: FrameLoopCallback,
  { target, enabled = true, fps = 30, stillTime = 0 }: FrameLoopOptions = {}
): FrameLoopState => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  const reducedMotion = usePrefersReducedMotion();
  const visible = useDocumentVisible();
  const inView = useInView(target ?? NO_TARGET);
  const onScreen = target ? inView : true;

  const isStatic = reducedMotion || !enabled;
  const isRunning = !isStatic && visible && onScreen;
  const timeRef = useRef(0);

  useEffect(() => {
    if (isStatic) {
      callbackRef.current(stillTime, 0);
      return;
    }
    if (!isRunning) {
      return;
    }
    const interval = 1000 / Math.max(1, fps);
    let frame = 0;
    let lastTick = performance.now();
    let lastDraw = -Infinity;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const delta = Math.min((now - lastTick) / 1000, MAX_DELTA);
      lastTick = now;
      timeRef.current += delta;
      // A small tolerance so 60Hz screens hit 30fps evenly.
      if (now - lastDraw >= interval - 2) {
        const sinceDraw = Math.min((now - lastDraw) / 1000, MAX_DELTA);
        lastDraw = now;
        callbackRef.current(timeRef.current, sinceDraw);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isStatic, isRunning, fps, stillTime]);

  if (isStatic) {
    return "static";
  }
  return isRunning ? "running" : "paused";
};
