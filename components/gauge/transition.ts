export type GaugeEasing =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | [number, number, number, number]
  | ((t: number) => number);

export interface GaugeSpringTransition {
  type: "spring";
  /** Physics parameters. When any is given they take precedence over the
      perceptual `visualDuration` and `bounce` pair. */
  stiffness?: number;
  damping?: number;
  mass?: number;
  /** Seconds the spring visibly takes to reach the target. Default 0.5. */
  visualDuration?: number;
  /** 0 settles without overshoot, 1 rings freely. Default 0.1. */
  bounce?: number;
}

export interface GaugeTweenTransition {
  type: "tween";
  /** Seconds. Default 0.5. */
  duration?: number;
  /** Default "easeInOut". */
  ease?: GaugeEasing;
}

export type GaugeTransition = GaugeSpringTransition | GaugeTweenTransition;

export const DEFAULT_TRANSITION: GaugeSpringTransition = {
  bounce: 0.1,
  type: "spring",
  visualDuration: 0.5,
};

/** Turns the `transition` prop into a concrete config, or null when off. */
export const resolveTransition = (
  transition: GaugeTransition | boolean | undefined
): GaugeTransition | null => {
  if (!transition) {
    return null;
  }
  return transition === true ? DEFAULT_TRANSITION : transition;
};

/* ---------- spring ---------- */

export interface SpringPhysics {
  stiffness: number;
  damping: number;
  mass: number;
}

/**
 * Physics for a spring config. The perceptual pair maps onto stiffness and
 * damping the same way the motion library does, so a spring tuned against
 * that library feels the same here.
 */
export const springPhysics = (t: GaugeSpringTransition): SpringPhysics => {
  const hasPhysics =
    t.stiffness !== undefined ||
    t.damping !== undefined ||
    t.mass !== undefined;
  if (hasPhysics) {
    return {
      damping: t.damping ?? 10,
      mass: t.mass ?? 1,
      stiffness: t.stiffness ?? 100,
    };
  }
  const visualDuration = t.visualDuration ?? 0.5;
  const bounce = t.bounce ?? 0.1;
  const root = (2 * Math.PI) / (visualDuration * 1.2);
  const stiffness = root * root;
  const ratio = Math.min(1, Math.max(0.05, 1 - bounce));
  return { damping: 2 * ratio * Math.sqrt(stiffness), mass: 1, stiffness };
};

export interface SpringState {
  value: number;
  velocity: number;
}

const SUBSTEP = 1 / 240;

/**
 * Advances a spring by `dt` seconds towards `target` with semi-implicit
 * Euler in small substeps, which stays stable for stiff springs. Returns the
 * new state and whether it has come to rest within `precision`.
 */
export const stepSpring = (
  state: SpringState,
  target: number,
  physics: SpringPhysics,
  dt: number,
  precision: number
): { state: SpringState; done: boolean } => {
  let { value, velocity } = state;
  let remaining = Math.min(dt, 0.064);
  while (remaining > 0) {
    const h = Math.min(SUBSTEP, remaining);
    const force =
      -physics.stiffness * (value - target) - physics.damping * velocity;
    velocity += (force / physics.mass) * h;
    value += velocity * h;
    remaining -= h;
  }
  const done =
    Math.abs(value - target) < precision && Math.abs(velocity) < precision * 10;
  return done
    ? { done, state: { value: target, velocity: 0 } }
    : { done, state: { value, velocity } };
};

/* ---------- tween ---------- */

const namedCurves: Record<
  Exclude<
    GaugeEasing,
    [number, number, number, number] | ((t: number) => number)
  >,
  [number, number, number, number]
> = {
  easeIn: [0.42, 0, 1, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  easeOut: [0, 0, 0.58, 1],
  linear: [0, 0, 1, 1],
};

const bezier = (t: number, p1: number, p2: number) => {
  const u = 1 - t;
  return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
};
const slope = (t: number, p1: number, p2: number) => {
  const u = 1 - t;
  return 3 * u * u * p1 + 6 * u * t * (p2 - p1) + 3 * t * t * (1 - p2);
};

/** A CSS-compatible cubic-bezier easing function. */
export const cubicBezier =
  (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
    if (x <= 0) {
      return 0;
    }
    if (x >= 1) {
      return 1;
    }
    // Newton's method, falling back to bisection where the curve is flat.
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const dx = bezier(t, x1, x2) - x;
      const d = slope(t, x1, x2);
      if (Math.abs(dx) < 1e-6) {
        return bezier(t, y1, y2);
      }
      if (Math.abs(d) < 1e-6) {
        break;
      }
      t -= dx / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (hi - lo > 1e-6) {
      if (bezier(t, x1, x2) < x) {
        lo = t;
      } else {
        hi = t;
      }
      t = (lo + hi) / 2;
    }
    return bezier(t, y1, y2);
  };

/** Resolves any `GaugeEasing` into a function of progress. */
export const easingFunction = (ease: GaugeEasing = "easeInOut") => {
  if (typeof ease === "function") {
    return ease;
  }
  const [x1, y1, x2, y2] = Array.isArray(ease) ? ease : namedCurves[ease];
  return cubicBezier(x1, y1, x2, y2);
};
