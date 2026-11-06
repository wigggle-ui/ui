"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties, ReactNode, Ref } from "react";

import { motionTokens } from "../lib/motion-tokens";

import styles from "./countdown.module.css";

export type CountdownUnit = "days" | "hours" | "minutes" | "seconds";

/** Use a countdown for a fixed moment people wait for: a launch, a live event, or a deadline. */
export interface CountdownProps {
  /**
   * The moment to count down to. A number is epoch milliseconds, a Date is used as is, and an ISO string with `Z` or an offset
   * such as `2026-10-06T10:00:00-07:00` is exact. A string without an offset is wall time in `timeZone`, or UTC when no zone is given,
   * so the result never depends on the visitor's own time zone.
   */
  target: Date | number | string;
  /** IANA zone for a target string without an offset, such as "America/Los_Angeles". Daylight saving is resolved for the target date. */
  timeZone?: string;
  /** Units to show, largest first. The largest unit absorbs the rest, so hours can pass 24 when days are left out. */
  units?: CountdownUnit[];
  /** Large digits with unit labels, or one compact line for banners and table cells. */
  variant?: "large" | "compact";
  /** Shown once the target passes. The digits morph into it. */
  completeLabel?: ReactNode;
  /** Fires once, the moment the countdown reaches zero while mounted. It fires on time even when the tab is hidden. */
  onComplete?: () => void;
  /** Accessible name, such as "Keynote starts in". */
  label?: string;
  /** Clock source in epoch milliseconds. Pass a server-synced clock when the visitor's device time cannot be trusted. */
  clock?: () => number;
  ref?: Ref<HTMLDivElement>;
  className?: string;
}

const { spring, stagger } = motionTokens;
const DEFAULT_UNITS: CountdownUnit[] = ["days", "hours", "minutes", "seconds"];
const SECONDS: Record<CountdownUnit, number> = {
  days: 86_400,
  hours: 3600,
  minutes: 60,
  seconds: 1,
};
/** How far each unit counts before carrying into the next, when a larger unit is shown. */
const LIMIT: Record<CountdownUnit, number> = {
  days: Infinity,
  hours: 24,
  minutes: 60,
  seconds: 60,
};
const NAMES: Record<CountdownUnit, [string, string, string]> = {
  days: ["Days", "d", "day"],
  hours: ["Hours", "h", "hour"],
  minutes: ["Minutes", "m", "minute"],
  seconds: ["Seconds", "s", "second"],
};
const MAX_TIMEOUT = 2_147_483_647;
const systemClock = () => Date.now();

/** Offset of a zone from UTC at an instant, in milliseconds. */
const zoneOffset = (epoch: number, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(new Date(epoch));
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return (
    Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour"),
      get("minute"),
      get("second")
    ) -
    Math.floor(epoch / 1000) * 1000
  );
};

/** Resolves a countdown target to epoch milliseconds without ever reading the device's own time zone. */
export const toEpoch = (target: Date | number | string, timeZone?: string) => {
  if (typeof target === "number") {
    return target;
  }
  if (target instanceof Date) {
    return target.getTime();
  }
  const wall =
    /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?$/u.test(
      target.trim()
    );
  if (!wall) {
    return Date.parse(target);
  }
  const normalized = target.trim();
  const date = normalized.slice(0, 10);
  const time = normalized.length > 10 ? normalized.slice(11) : "";
  const utc = Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
    Number(time.slice(0, 2) || 0),
    Number(time.slice(3, 5) || 0),
    Number(time.slice(6, 8) || 0)
  );
  if (!timeZone) {
    return utc;
  }
  // Two passes settle the offset across a daylight saving change.
  const guess = utc - zoneOffset(utc, timeZone);
  return utc - zoneOffset(guess, timeZone);
};

/** Whole seconds left, split across the units on show. */
const partsFor = (seconds: number, units: CountdownUnit[]) =>
  units.map((unit, index) => ({
    unit,
    value:
      index === 0
        ? Math.floor(seconds / SECONDS[unit])
        : Math.floor(seconds / SECONDS[unit]) % LIMIT[unit],
  }));

/** Wheel sizes per column: a tens column that only ever shows 0 to 5 turns on a six-digit wheel, so 00 → 59 is a single step. */
const basesFor = (unit: CountdownUnit, largest: boolean, length: number) =>
  Array.from({ length }, (_, index) => {
    const tens = index === length - 2 && length === 2 && !largest;
    if (!tens) {
      return 10;
    }
    return unit === "hours" ? 3 : 6;
  });

const subscribeVisibility = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
const subscribeNothing = subscribeVisibility;

/** One digit on a wheel. Its offset from the wheel position decides where it sits and how clearly it shows. */
const Glyph = ({
  position,
  digit,
  base,
}: {
  position: MotionValue<number>;
  digit: number;
  base: number;
}) => {
  const offset = useTransform(
    position,
    (current) => ((((digit - current) % base) + base * 1.5) % base) - base / 2
  );
  const y = useTransform(offset, (current) => `${current}em`);
  const opacity = useTransform(offset, (current) =>
    Math.max(0, 1 - Math.abs(current))
  );
  const visibility = useTransform(offset, (current) =>
    Math.abs(current) >= 1 ? "hidden" : "visible"
  );
  const filter = useTransform(offset, (current) =>
    Math.abs(current) < 0.02 || Math.abs(current) >= 1
      ? "none"
      : `blur(${(Math.abs(current) * motionTokens.blur.subtle).toFixed(2)}px)`
  );
  return (
    <motion.span
      className={styles.glyph}
      style={
        {
          "--glyph-filter": filter,
          "--glyph-opacity": opacity,
          "--glyph-visibility": visibility,
          "--glyph-y": y,
        } as CSSProperties
      }
    >
      {digit}
    </motion.span>
  );
};

/** A digit wheel that takes the short way round, so a countdown ticks downward and a wrap such as 00 → 59 is one step. */
const Wheel = ({
  digit,
  base,
  delay,
  reduced,
}: {
  digit: number;
  base: number;
  delay: number;
  reduced: boolean;
}) => {
  const position = useMotionValue(0);
  const wheel = useRef({ digit: 0, revealed: false, target: 0 });
  useEffect(() => {
    const state = wheel.current;
    if (state.digit === digit) {
      state.revealed = true;
      return;
    }
    const up = (digit - state.digit + base) % base;
    const down = base - up;
    state.target += down <= up ? -down : up;
    state.digit = digit;
    const first = !state.revealed;
    state.revealed = true;
    // A new animation on the same value takes over from the one in flight, keeping its velocity; no cleanup, so a re-run never strands a wheel mid-turn.
    if (reduced) {
      position.jump(state.target);
    } else {
      animate(
        position,
        state.target,
        first ? { ...spring.smooth, delay } : spring.snappy
      );
    }
  }, [base, delay, digit, position, reduced]);
  return (
    <motion.span
      className={styles.wheel}
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "auto" }}
      exit={{ opacity: 0, width: 0 }}
      transition={reduced ? { duration: 0 } : spring.morph}
    >
      <span className={styles.sizer}>0</span>
      {Array.from({ length: base }, (_, value) => (
        <Glyph key={value} position={position} digit={value} base={base} />
      ))}
    </motion.span>
  );
};

export const Countdown = ({
  target,
  timeZone,
  units = DEFAULT_UNITS,
  variant = "large",
  completeLabel = "Live now",
  onComplete,
  label = "Time remaining",
  clock = systemClock,
  ref,
  className,
}: CountdownProps) => {
  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => root.current as HTMLDivElement);
  const hydrated = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  );
  const reduced = !!useReducedMotion() && hydrated;
  const end = toEpoch(target, timeZone);
  const valid = Number.isFinite(end);
  const shownUnits = units.length
    ? units.toSorted((a, b) => SECONDS[b] - SECONDS[a])
    : DEFAULT_UNITS;

  // The clock only ticks while the countdown is on screen and the tab is visible; coming back reads the clock again, so nothing drifts.
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true
  );
  const inView = useInView(root, { amount: 0 });
  const running = pageVisible && inView && valid;
  const [now, setNow] = useState<number | null>(null);
  const clockRef = useRef(clock);
  useLayoutEffect(() => {
    clockRef.current = clock;
  });
  useEffect(() => {
    if (!running) {
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const time = clockRef.current();
      setNow(time);
      const left = end - time;
      // Wake just after the next whole second, aligned to the target rather than to when the page loaded.
      if (left > 0) {
        timer = setTimeout(tick, (left % 1000 || 1000) + 8);
      }
    };
    timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
  }, [end, running]);

  // Completion is armed separately, so it lands on time even while ticking is paused.
  useEffect(() => {
    if (!valid) {
      return;
    }
    const left = end - clockRef.current();
    if (left <= 0) {
      return;
    }
    const timer = setTimeout(
      () => setNow(clockRef.current()),
      Math.min(MAX_TIMEOUT, left + 8)
    );
    return () => clearTimeout(timer);
  }, [end, valid]);

  const left = now === null || !valid ? null : Math.max(0, end - now);
  const complete = left === 0;
  const onCompleteRef = useRef(onComplete);
  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  });
  const wasRunning = useRef<number | null>(null);
  useEffect(() => {
    if (left === null) {
      return;
    }
    if (left > 0) {
      wasRunning.current = end;
      return;
    }
    if (wasRunning.current === end) {
      wasRunning.current = null;
      onCompleteRef.current?.();
    }
  }, [end, left]);

  const seconds = left === null ? 0 : Math.ceil(left / 1000);
  const parts = partsFor(seconds, shownUnits);
  const pending = left === null;
  const compact = variant === "compact";

  // The shell springs to the size of whatever it holds, so the digits can morph into the finished label without a jump.
  const content = useRef<HTMLDivElement>(null);
  const width = useMotionValue("auto");
  const height = useMotionValue("auto");
  useLayoutEffect(() => {
    const node = content.current;
    if (!node || typeof ResizeObserver === "undefined") {
      return;
    }
    let first = true;
    const observer = new ResizeObserver(() => {
      const w = node.offsetWidth;
      const h = node.offsetHeight;
      if (first || reduced) {
        width.jump(`${w}px`);
        height.jump(`${h}px`);
        first = false;
        return;
      }
      animate(width, `${w}px`, spring.morph);
      animate(height, `${h}px`, spring.smooth);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [height, reduced, width]);

  let spoken = "";
  if (complete) {
    spoken = typeof completeLabel === "string" ? completeLabel : "Complete";
  } else if (!pending) {
    spoken = parts
      .filter((part, index) => part.value > 0 || index === parts.length - 1)
      .filter((part) => seconds < 60 || part.unit !== "seconds")
      .map(
        (part) =>
          `${part.value} ${part.value === 1 ? NAMES[part.unit][2] : `${NAMES[part.unit][2]}s`}`
      )
      .join(", ");
  }
  const swap = reduced
    ? {
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        initial: { opacity: 0 },
        transition: { duration: motionTokens.duration.fast },
      }
    : {
        animate: { filter: "blur(0px)", opacity: 1, scale: 1 },
        exit: {
          filter: `blur(${motionTokens.blur.soft}px)`,
          opacity: 0,
          scale: 0.92,
          transition: { duration: motionTokens.duration.fast },
        },
        initial: {
          filter: `blur(${motionTokens.blur.soft}px)`,
          opacity: 0,
          scale: 0.92,
        },
        transition: spring.morph,
      };

  return (
    <div
      ref={root}
      className={[styles.countdown, className].filter(Boolean).join(" ")}
      data-variant={variant}
      data-complete={complete || undefined}
      data-pending={pending || undefined}
      role="timer"
      aria-label={label}
    >
      <motion.div
        className={styles.shell}
        style={
          {
            "--countdown-height": height,
            "--countdown-width": width,
          } as CSSProperties
        }
      >
        <div ref={content} className={styles.content} aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            {complete ? (
              <motion.span key="done" className={styles.done} {...swap}>
                <span className={styles.pulse} />
                {completeLabel}
              </motion.span>
            ) : (
              <motion.span key="running" className={styles.units} {...swap}>
                {parts.map((part, group) => {
                  const text = String(part.value).padStart(2, "0");
                  const bases = basesFor(part.unit, group === 0, text.length);
                  return (
                    <span key={part.unit} className={styles.unit}>
                      {!compact && group > 0 && (
                        <span className={styles.colon}>:</span>
                      )}
                      <span className={styles.group}>
                        <span className={styles.number}>
                          <AnimatePresence initial={false}>
                            {[...text].map((char, index) => (
                              <Wheel
                                key={`${part.unit}${text.length - index}`}
                                digit={Number(char)}
                                base={bases[index] ?? 10}
                                delay={Math.min(
                                  (group * 2 + index) * stagger.item,
                                  0.3
                                )}
                                reduced={reduced}
                              />
                            ))}
                          </AnimatePresence>
                        </span>
                        <span className={styles.name}>
                          {NAMES[part.unit][compact ? 1 : 0]}
                        </span>
                      </span>
                    </span>
                  );
                })}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <span className={styles.srOnly}>{spoken}</span>
    </div>
  );
};

export default Countdown;
