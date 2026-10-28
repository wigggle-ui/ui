"use client";

import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import { useGauge } from "./context";
import type { GaugeContextValue } from "./context";
import { foldValue } from "./math";

/**
 * What the tooltip is pinned to. `pointer` follows the cursor round the
 * gauge, `value` sits on the scale at the value, and the rest are fixed
 * points of the gauge: its centre, or the middle of an edge or a corner of
 * the box its scale fills.
 */
export type GaugeTooltipPosition =
  | "pointer"
  | "value"
  | "center"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

/**
 * Which way the bubble stands off its point. `auto` picks for the position:
 * outward from the scale at the value, so the bubble swings round a dial with it,
 * above the pointer, centred on the centre, and away from the dial at an
 * edge or corner.
 */
export type GaugeTooltipSide =
  | "auto"
  | "center"
  | "top"
  | "right"
  | "bottom"
  | "left";

export interface GaugeTooltipProps {
  position?: GaugeTooltipPosition;
  side?: GaugeTooltipSide;
  /**
   * Domain value a `value` tooltip points at and shows. Defaults to the
   * current value, or for a range the middle of it, showing both ends; a
   * fixed one marks a target or a cutoff.
   */
  at?: number;
  /**
   * How far out from the scale's reference line the point sits, in SVG
   * units: the spot on the scale for `value`, and the box round the scale
   * for the edges and corners.
   */
  offset?: number;
  /** Room between the point and the bubble, in CSS pixels. */
  gap?: number;
  /**
   * Keep the bubble on screen: flip it to the far side of its point when
   * that side has more room, then slide it sideways in from the left or
   * right edge while it still overlaps its point. On by default.
   */
  avoidCollisions?: boolean;
  /** Room kept clear between the bubble and the viewport edge, in CSS pixels. */
  collisionPadding?: number;
  /**
   * Hold the tooltip open, or shut, instead of showing it on hover, while
   * a press that started on the gauge is held, and on keyboard focus.
   */
  open?: boolean;
  /** Small line above the value. Leave out for the value on its own. */
  label?: ReactNode;
  /** Printed after the value, a size down. */
  unit?: ReactNode;
  decimals?: number;
  /** Formats each number shown; a range formats its two ends apart. */
  format?: (value: number) => string;
  /** Placed between the two ends of a range. */
  separator?: string;
  /** Classes for the bubble, merged over its defaults. */
  className?: string;
  style?: CSSProperties;
  /**
   * Replaces the default label, value and unit with any HTML, or a function
   * of the value being shown for content that has to follow it. On a range
   * the function gets its start as well.
   */
  children?: ReactNode | ((value: number, from?: number) => ReactNode);
}

interface Point {
  x: number;
  y: number;
}
interface Size {
  width: number;
  height: number;
}
type Axis = "x" | "y";

const extent = { x: "width", y: "height" } as const;
const noCleanup = (): undefined => undefined;
const subscribe = () => noCleanup;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * The bubble's top left corner for a direction off the point: centred on the
 * point, moved `gap` along the direction, then pushed half its own size the
 * same way, so a side tooltip touches the point with that edge.
 */
const corner = (p: Point, d: Point, size: Size, gap: number): Point => {
  const len = Math.hypot(d.x, d.y) || 1;
  return {
    x: p.x + (d.x / len) * gap + ((d.x - 1) / 2) * size.width,
    y: p.y + (d.y / len) * gap + ((d.y - 1) / 2) * size.height,
  };
};

const spill = (
  point: Point,
  axis: Axis,
  size: Size,
  view: Size,
  padding: number
): number => {
  const span = size[extent[axis]];
  const room = view[extent[axis]] - padding;
  const overflow =
    Math.max(0, padding - point[axis]) + Math.max(0, point[axis] + span - room);
  return Math.min(span, overflow);
};

const getTooltipPlacement = (
  pinnedPoint: Point,
  initialDirection: Point,
  size: Size,
  gap: number,
  avoidCollisions: boolean,
  collisionPadding: number
): Point => {
  let direction = initialDirection;
  let placement = corner(pinnedPoint, direction, size, gap);
  if (!avoidCollisions) {
    return placement;
  }

  const view = {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth,
  };
  for (const axis of ["x", "y"] as const) {
    const overflow = spill(placement, axis, size, view, collisionPadding);
    if (overflow === 0 || direction[axis] === 0) {
      continue;
    }
    const flippedDirection = { ...direction, [axis]: -direction[axis] };
    const flippedPlacement = corner(pinnedPoint, flippedDirection, size, gap);
    if (
      spill(flippedPlacement, axis, size, view, collisionPadding) < overflow
    ) {
      direction = flippedDirection;
      placement = flippedPlacement;
    }
  }

  const { x } = pinnedPoint;
  const { width } = size;
  if (x >= placement.x && x <= placement.x + width) {
    const inside = Math.max(
      collisionPadding,
      Math.min(placement.x, view.width - collisionPadding - width)
    );
    placement = {
      ...placement,
      x: Math.max(x - width, Math.min(inside, x)),
    };
  }
  return placement;
};

const DefaultContent = ({
  text,
  label,
  unit,
}: {
  text: string;
  label?: ReactNode;
  unit?: ReactNode;
}) => (
  <div className="flex flex-col items-center leading-tight">
    {label && <span className="opacity-70">{label}</span>}
    <span className="text-sm font-semibold tabular-nums">
      {text}
      {unit && (
        <span className="ml-0.5 text-xs font-medium opacity-70">{unit}</span>
      )}
    </span>
  </div>
);

const getTooltipContent = ({
  children,
  spread,
  value,
  from,
  format,
  decimals,
  separator,
  label,
  unit,
}: {
  children: GaugeTooltipProps["children"];
  spread: boolean;
  value: number;
  from: number;
  format: GaugeTooltipProps["format"];
  decimals: number;
  separator: string;
  label: ReactNode;
  unit: ReactNode;
}): ReactNode => {
  if (typeof children === "function") {
    if (spread) {
      return children(value, from);
    }
    return children(value);
  }
  if (children !== undefined) {
    return children;
  }

  const formatValue = (number: number) =>
    format ? format(number) : number.toFixed(decimals);
  const text = spread
    ? `${formatValue(from)}${separator}${formatValue(value)}`
    : formatValue(value);

  return <DefaultContent text={text} label={label} unit={unit} />;
};

/** Directions in screen space, y down, scaled so the longer axis is 1. */
const sides: Record<Exclude<GaugeTooltipSide, "auto">, Point> = {
  bottom: { x: 0, y: 1 },
  center: { x: 0, y: 0 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
};

/** Where each fixed position sits in the sweep's box, 0 to 1 across. */
const boxPoints: Record<string, Point> = {
  bottom: { x: 0.5, y: 1 },
  "bottom-left": { x: 0, y: 1 },
  "bottom-right": { x: 1, y: 1 },
  left: { x: 0, y: 0.5 },
  right: { x: 1, y: 0.5 },
  top: { x: 0.5, y: 0 },
  "top-left": { x: 0, y: 0 },
  "top-right": { x: 1, y: 0 },
};

/** What can take keyboard focus, to find the element that owns the gauge's.
    A range control is not focusable itself but holds the thumbs that are. */
const FOCUSABLE =
  '[tabindex]:not([tabindex="-1"]), a[href], button, input, select, textarea, [data-slot="gauge-control"]';

const useIsClient = () =>
  useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

const getMiddleValue = (
  at: number | undefined,
  gauge: GaugeContextValue
): number => {
  const value = at ?? gauge.value;
  if (at !== undefined || !gauge.range) {
    return value;
  }
  if (!gauge.wrap) {
    return (gauge.from + gauge.value) / 2;
  }
  const distance = foldValue(
    gauge.value - gauge.from,
    0,
    gauge.max - gauge.min
  );
  return foldValue(gauge.from + distance / 2, gauge.min, gauge.max);
};

const getPinnedPoint = (
  position: GaugeTooltipPosition,
  pointer: Point | null,
  anchor: SVGGElement | null,
  gauge: GaugeContextValue,
  along: number,
  offset: number
): Point | null => {
  if (position === "pointer") {
    return pointer;
  }
  const transform = anchor?.getScreenCTM();
  if (!transform) {
    return null;
  }
  let point: Point = { x: 0, y: 0 };
  if (position === "value") {
    point = gauge.scale.point(along, offset);
  } else if (position !== "center") {
    const box = gauge.scale.box(offset);
    const spot = boxPoints[position];
    point = {
      x: box.x + box.width * spot.x,
      y: box.y + box.height * spot.y,
    };
  }
  return new DOMPoint(point.x, point.y).matrixTransform(transform);
};

const getDirection = (
  side: GaugeTooltipSide,
  position: GaugeTooltipPosition,
  gauge: GaugeContextValue,
  along: number
): Point => {
  if (side !== "auto") {
    return sides[side];
  }
  if (position === "pointer") {
    return sides.top;
  }
  if (position === "center") {
    return sides.center;
  }
  if (position !== "value") {
    const spot = boxPoints[position];
    return { x: spot.x * 2 - 1, y: spot.y * 2 - 1 };
  }
  const normal = gauge.scale.normal(along);
  const magnitude = Math.max(Math.abs(normal.x), Math.abs(normal.y)) || 1;
  return { x: normal.x / magnitude, y: normal.y / magnitude };
};

/**
 * An HTML tooltip for the gauge, shown while the pointer is over it. It reads
 * the value with an optional label and unit by default, or renders whatever
 * its children are, and can be pinned to the value on the arc, follow the
 * pointer, or hold a fixed spot on the dial.
 *
 * The bubble is portalled to the body and placed through the SVG's screen
 * transform, so it is never clipped by the gauge and keeps its own CSS size
 * however the gauge, or an inset it sits in, is scaled.
 */
export const GaugeTooltip = ({
  position = "value",
  side = "auto",
  at,
  offset = 24,
  gap = 8,
  avoidCollisions = true,
  collisionPadding = 8,
  open,
  label,
  unit,
  decimals = 0,
  format,
  separator = "–",
  className,
  style,
  children,
}: GaugeTooltipProps) => {
  const gauge = useGauge();
  const isClient = useIsClient();
  const anchor = useRef<SVGGElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const pointer = useRef<Point | null>(null);
  const [hovered, setHovered] = useState(false);
  /* A press that starts on the gauge, held until it is let go anywhere. */
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);
  const shown = open ?? (hovered || pressed || focused);

  const value = at ?? gauge.value;
  /* A range is pointed at in its middle, measured forward round a ring. */
  const spread = at === undefined && gauge.range;
  const middle = getMiddleValue(at, gauge);
  /* Where the value sits on the scale. */
  const along = gauge.positionOf(middle);

  /* Written straight to the element rather than through state, so a bubble
     following the pointer moves without a render per pixel. */
  const place = useEffectEvent(() => {
    const el = box.current;
    if (!el) {
      return;
    }
    const pinnedPoint = getPinnedPoint(
      position,
      pointer.current,
      anchor.current,
      gauge,
      along,
      offset
    );
    if (!pinnedPoint) {
      el.style.visibility = "hidden";
      return;
    }
    const size = { height: el.offsetHeight, width: el.offsetWidth };
    const placement = getTooltipPlacement(
      pinnedPoint,
      getDirection(side, position, gauge, along),
      size,
      gap,
      avoidCollisions,
      collisionPadding
    );

    /* In page coordinates, so the bubble rides a page scroll natively
       instead of trailing a frame behind it the way a fixed one would. */
    el.style.visibility = "";
    el.style.left = `${placement.x + window.scrollX}px`;
    el.style.top = `${placement.y + window.scrollY}px`;
  });

  /* Hover is taken over the whole gauge, from the SVG the anchor sits in. */
  useEffect(() => {
    const svg = anchor.current?.ownerSVGElement;
    if (!svg) {
      return;
    }
    const track = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    const enter = (e: PointerEvent) => {
      track(e);
      setHovered(true);
    };
    const move = (e: PointerEvent) => {
      track(e);
      place();
    };
    const leave = () => setHovered(false);
    const down = (e: PointerEvent) => {
      track(e);
      setPressed(true);
    };
    svg.addEventListener("pointerenter", enter);
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerleave", leave);
    svg.addEventListener("pointerdown", down);
    return () => {
      svg.removeEventListener("pointerenter", enter);
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerleave", leave);
      svg.removeEventListener("pointerdown", down);
    };
  }, []);

  /* Keyboard focus on the gauge, or on the nearest focusable element round
     it such as a GaugeControl, brings the tooltip up too. Only focus that
     shows a ring counts, so clicking a control does not; a key pressed
     after the click does, as that is when the browser starts showing it. */
  useEffect(() => {
    const owner = anchor.current?.ownerSVGElement?.closest(FOCUSABLE);
    if (!owner) {
      return;
    }
    /* Focus on the owner or anything in it, such as a range's thumbs. */
    const within = () => owner.contains(document.activeElement);
    const check = () =>
      setFocused(
        within() &&
          /* Not a range thumb a GaugeControl focused for a drag. */
          Boolean(
            document.activeElement?.matches(
              ":focus-visible:not([data-pointer])"
            )
          )
      );
    /* A key pressed while it has focus is keyboard use, whether or not the
       browser has switched its ring on yet. */
    const key = () => setFocused(within());
    /* Moving between two thumbs leaves one only to land on the other. */
    const blur = (e: Event) => {
      const next = (e as FocusEvent).relatedTarget as Node | null;
      if (!owner.contains(next)) {
        setFocused(false);
      }
    };
    check();
    owner.addEventListener("focusin", check);
    owner.addEventListener("keydown", key);
    owner.addEventListener("focusout", blur);
    return () => {
      owner.removeEventListener("focusin", check);
      owner.removeEventListener("keydown", key);
      owner.removeEventListener("focusout", blur);
    };
  }, []);

  /* A drag holds the tooltip up until it ends. A GaugeControl captures the
     pointer on its wrapper, which counts as leaving the SVG and stops its
     moves reaching it, so the press is followed on the window instead. It
     also brings the tooltip up on touch, which has no hover. */
  useEffect(() => {
    if (!pressed) {
      return;
    }
    const move = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      place();
    };
    const release = () => setPressed(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [pressed]);

  /* A scroll can bring an edge up against the bubble, and a scrolling box
     the gauge sits in moves the point out from under it. */
  useEffect(() => {
    if (!shown) {
      return;
    }
    const update = () => place();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [shown]);

  /* Every render, since an animated value moves the point frame by frame. */
  useLayoutEffect(() => {
    if (shown) {
      place();
    }
  });

  const content = getTooltipContent({
    children,
    decimals,
    format,
    from: gauge.from,
    label,
    separator,
    spread,
    unit,
    value,
  });

  return (
    <>
      <g ref={anchor} />
      {shown &&
        isClient &&
        createPortal(
          /* The wrapper holds the position so the bubble's own transform is
             free for its entrance animation. */
          <div
            ref={box}
            className="pointer-events-none absolute top-0 left-0 z-50"
          >
            <div
              role="tooltip"
              data-slot="gauge-tooltip"
              style={style}
              className={cn(
                "animate-in bg-foreground text-background fade-in-0 zoom-in-95 w-max max-w-xs rounded-lg px-3 py-1.5 text-xs shadow-md",
                className
              )}
            >
              {content}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
