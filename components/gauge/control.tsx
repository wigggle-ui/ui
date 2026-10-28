"use client";

import { useRef } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { GaugeRange } from "./context";
import { angleToValue, clamp, foldValue, valueToAngle } from "./math";
import type { GaugeOrientation } from "./scale";

/** How far out from the centre a press starts counting as the ring, as a
    share of the half width. Inside it is the face, left for `onPress`. */
const FACE = 0.55;

/** Too near the centre for the angle under the pointer to mean anything. */
const HUB = 0.08;

/** The gauge angle under a point, measured round the element's centre. */
const angleAt = (el: HTMLElement, x: number, y: number) => {
  const box = el.getBoundingClientRect();
  const dx = x - (box.left + box.width / 2);
  const dy = y - (box.top + box.height / 2);
  const theta = (Math.atan2(dy, dx) * 180) / Math.PI;
  return {
    /* Gauge degrees start at six o'clock, a quarter turn behind the maths. */
    angle: (((theta - 90) % 360) + 360) % 360,
    /** How far out from the centre, as a share of the half width. */
    reach: Math.hypot(dx, dy) / (box.width / 2),
  };
};

/**
 * The position along a bar under a point, in the SVG units of the
 * `LinearGauge` inside, read through the SVG's own screen transform so its
 * padding and scaling need no knowing.
 */
const positionAt = (
  el: HTMLElement,
  x: number,
  y: number,
  orientation: GaugeOrientation
) => {
  const ctm = el.querySelector("svg")?.getScreenCTM();
  if (!ctm) {
    return 0;
  }
  const p = new DOMPoint(x, y).matrixTransform(ctm.inverse());
  /* A vertical bar runs bottom to top, against the SVG's y. */
  return orientation === "vertical" ? -p.y : p.x;
};

/** Degrees between two angles the short way round. */
const turnBetween = (a: number, b: number) =>
  Math.abs(((((a - b) % 360) + 540) % 360) - 180);

/** A literal number widened, so `value={42}` still takes any number back. */
type Widen<V> = V extends number ? number : [number, number];

export interface GaugeControlProps<V extends number | GaugeRange = number> {
  /** A number for one handle, or a `[from, to]` range for two. */
  value: V;
  onChange: (value: Widen<V>) => void;
  /** A press on the middle of the face, or Enter, for a dial that is also a
      switch. Left out, the middle does nothing. */
  onPress?: () => void;
  min?: number;
  max?: number;
  /** Granularity a drag lands on, and the size of an arrow-key step. */
  step?: number;
  /** Gauge degrees, matching the gauge drawn inside. */
  startAngle?: number;
  endAngle?: number;
  /**
   * Make the `LinearGauge` inside a slider instead of a round gauge: a
   * press anywhere along the bar sets the value under it, and a drag
   * follows the pointer along the bar. Match it to the gauge's own.
   */
  orientation?: GaugeOrientation;
  /** Length of the bar in SVG units, matching the `LinearGauge` inside. */
  length?: number;
  /**
   * The domain is a closed ring, as the gauge's own `wrap`: values carry on
   * round past either end instead of holding there, and a range may run
   * across the seam, its ends in either order.
   */
  wrap?: boolean;
  /** Read to screen readers; every slider needs one. On a range it names the
      pair, and each thumb gets its own from `thumbLabels`. */
  label: string;
  /** Names for a range's two thumbs. Defaults to the label with "start" and
      "end" after it. */
  thumbLabels?: readonly [string, string];
  /** The value as it would be spoken: "21.5 °C" rather than 21.5. A range
      takes one for each end. */
  valueText?: V extends number ? string : readonly [string, string];
  /** The face turns like a knob: a drag anywhere on it moves the value by as
      far as the pointer goes round, rather than jumping to where it is. A
      range turns as a whole, keeping its width. A bar has no face, so on one
      every drag moves the value by as far as the pointer goes along it. */
  knob?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Makes the square gauge inside it a slider: drag round the ring to set it,
 * or use the arrow keys, Page Up and Down, Home and End. With an
 * `orientation` it makes a `LinearGauge` one instead, dragged along the bar. A drag past either
 * end of the sweep holds there rather than jumping to the other. A press in
 * the middle of the face, or Enter, is left for `onPress`, which a dimmer
 * uses to switch on and off, or, with `knob`, turns the face from where it
 * is. The domain and angles default to `Gauge`'s own.
 *
 * Given a `[from, to]` range it has two thumbs: a press on the ring takes
 * whichever is nearer, and each can be tabbed to and keyed on its own. On an
 * open domain they hold short of passing each other.
 */
export const GaugeControl = <V extends number | GaugeRange = number>({
  value,
  onChange,
  onPress,
  min = 0,
  max = 100,
  step = 1,
  startAngle = 40,
  endAngle = 320,
  orientation,
  length = 400,
  wrap = false,
  label,
  thumbLabels,
  valueText,
  knob = false,
  disabled = false,
  className,
  children,
}: GaugeControlProps<V>) => {
  const range = typeof value !== "number";
  /* Both kinds are worked on as a list of ends: one for a value, two for a
     range. */
  const ends: number[] = range ? [...(value as GaugeRange)] : [value as number];
  const emit = (next: number[]) =>
    (onChange as (value: number | [number, number]) => void)(
      range ? [next[0], next[1]] : next[0]
    );

  /* Whether the press that is down started in the middle of the face. */
  const pressed = useRef(false);
  /* The end a drag on the ring is moving. */
  const active = useRef(0);
  /* A knob turn under way: the spot last seen, the ends when it began, and
     how far it has moved them before rounding to a step. */
  const turn = useRef<{ at: number; base: number[]; by: number } | null>(null);
  const thumbs = useRef<(HTMLDivElement | null)[]>([]);

  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const snap = (v: number) => Math.round(v / step) * step;
  const settle = (v: number) => {
    const n = Number(v.toFixed(2));
    return wrap ? foldValue(n, lo, hi) : clamp(n, lo, hi);
  };

  /* Moves one end, holding it short of the other on an open domain. */
  const setEnd = (i: number, next: number) => {
    let v = settle(next);
    if (range && !wrap) {
      v = i === 0 ? Math.min(v, ends[1]) : Math.max(v, ends[0]);
    }
    emit(ends.map((e, j) => (j === i ? v : e)));
  };

  /* The scale is worked on in its own units, degrees round a ring or SVG
     units along a bar, as the gauge inside lays it out. */
  const linear = orientation !== undefined;
  const sweep = linear ? length : endAngle - startAngle;
  const positionOf = (v: number) =>
    linear
      ? valueToAngle(v, min, max, -length / 2, length / 2)
      : valueToAngle(v, min, max, startAngle, endAngle);

  /** Where a point falls on the scale, and for a ring how far out from the
      centre it is. A bar has no face, so all of it is the scale. */
  const locate = (el: HTMLElement, x: number, y: number) => {
    if (orientation) {
      return { at: positionAt(el, x, y, orientation), reach: Infinity };
    }
    const { angle, reach } = angleAt(el, x, y);
    return { at: angle, reach };
  };

  /* A press past either end of a bar holds there, as one in a ring's
     opening does. */
  const valueAt = (at: number) =>
    snap(
      linear
        ? min + clamp((at + length / 2) / length, 0, 1) * (max - min)
        : angleToValue(at, min, max, startAngle, endAngle)
    );

  /* The end nearer the pointer, by angle so a ring measures across its seam.
     Two ends on top of each other part the way the press lies. */
  const nearest = (at: number, under: number) => {
    if (!range) {
      return 0;
    }
    const [a, b] = ends.map((e) =>
      linear ? Math.abs(at - positionOf(e)) : turnBetween(at, positionOf(e))
    );
    if (a !== b) {
      return a < b ? 0 : 1;
    }
    return under > ends[1] ? 1 : 0;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    const el = e.currentTarget;
    const { at, reach } = locate(el, e.clientX, e.clientY);
    /* A whole bar turns as a knob does, there being no face to hold it. */
    const face = linear ? knob : reach < FACE;
    if (face && knob) {
      el.setPointerCapture(e.pointerId);
      turn.current = { at, base: ends, by: 0 };
      return;
    }
    if (face) {
      pressed.current = true;
      return;
    }
    el.setPointerCapture(e.pointerId);
    const under = valueAt(at);
    active.current = nearest(at, under);
    if (range) {
      /* Focus the thumb being dragged, as a native slider does, and keep
         the press from moving focus off it again. Browsers count focus from
         script as keyboard focus, so the thumb is marked as taken by the
         pointer until a key is pressed on it: the ring here and a
         GaugeTooltip both leave a marked thumb alone. */
      e.preventDefault();
      const thumb = thumbs.current[active.current];
      if (thumb) {
        thumb.dataset.pointer = "";
        thumb.focus({ preventScroll: true });
      }
    }
    setEnd(active.current, under);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
      return;
    }
    const t = turn.current;
    if (t) {
      const { at, reach } = locate(e.currentTarget, e.clientX, e.clientY);
      if (reach < HUB) {
        return;
      }
      /* Round a ring, the shortest way from the last angle, so crossing six o'clock
         is a small step and not a whole turn back. */
      const delta = linear ? at - t.at : ((at - t.at + 540) % 360) - 180;
      let by = t.by + (delta / sweep) * (max - min);
      /* Held so every end stays inside an open domain, which keeps a
         range's width as it turns. */
      if (!wrap) {
        by = clamp(by, lo - Math.min(...t.base), hi - Math.max(...t.base));
      }
      turn.current = { ...t, at, by };
      emit(t.base.map((v) => settle(v + snap(by))));
      return;
    }
    const { at } = locate(e.currentTarget, e.clientX, e.clientY);
    setEnd(active.current, valueAt(at));
  };

  const onPointerUp = () => {
    if (pressed.current) {
      onPress?.();
    }
    pressed.current = false;
    turn.current = null;
  };

  const keyDown = (i: number) => (e: KeyboardEvent<HTMLDivElement>) => {
    delete e.currentTarget.dataset.pointer;
    if (disabled) {
      return;
    }
    const v = ends[i];
    const big = (max - min) / 10;
    const moves: Record<string, number> = {
      ArrowDown: v - step,
      ArrowLeft: v - step,
      ArrowRight: v + step,
      ArrowUp: v + step,
      End: max,
      Home: min,
      PageDown: v - big,
      PageUp: v + big,
    };
    if (e.key in moves) {
      e.preventDefault();
      setEnd(i, moves[e.key]);
    } else if ((e.key === "Enter" || e.key === " ") && onPress) {
      e.preventDefault();
      onPress();
    }
  };

  /* The ARIA a thumb carries; a lone value's is the wrapper itself. */
  const slider = (i: number) => {
    const texts = valueText as string | readonly [string, string] | undefined;
    return {
      "aria-disabled": disabled,
      "aria-label": range
        ? (thumbLabels?.[i] ?? `${label} ${i === 0 ? "start" : "end"}`)
        : label,
      "aria-orientation": orientation,
      "aria-valuemax": range && !wrap && i === 0 ? ends[1] : max,
      "aria-valuemin": range && !wrap && i === 1 ? ends[0] : min,
      "aria-valuenow": ends[i],
      "aria-valuetext": typeof texts === "string" ? texts : texts?.[i],
      onKeyDown: keyDown(i),
      role: "slider",
      tabIndex: disabled ? -1 : 0,
    };
  };

  return (
    <div
      {...(range ? { "aria-label": label, role: "group" } : slider(0))}
      data-slot="gauge-control"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        pressed.current = false;
        turn.current = null;
      }}
      className={cn(
        "focus-visible:ring-ring has-[:focus-visible:not([data-pointer])]:ring-ring relative touch-none outline-none select-none focus-visible:ring-2 has-[:focus-visible:not([data-pointer])]:ring-2",
        linear ? "rounded-lg" : "aspect-square rounded-full",
        disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      {children}
      {/* A range's thumbs are drawn by the gauge; these only take focus and
          keys, one per end, and speak for it. */}
      {range &&
        ends.map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              thumbs.current[i] = el;
            }}
            {...slider(i)}
            onBlur={(e) => delete e.currentTarget.dataset.pointer}
            className="sr-only"
          />
        ))}
    </div>
  );
};
