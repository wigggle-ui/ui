"use client";

import { animate, cubicBezier, useInView } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";

type Easing = "easeOut" | "linear" | "expo" | "spring";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  startWhen?: boolean;
  separator?: string;
  prefix?: string;
  suffix?: string;
  mode?: "count" | "roll";
  easing?: Easing;
  decimals?: number;
  format?: "standard" | "compact";
  trigger?: "view" | "load";
  replayOnHover?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

interface Column {
  slot: number;
  index: number;
  place: number;
  from: number;
  to: number;
  enter: boolean;
  leave: boolean;
  delta: number;
}

interface Mark {
  char: string;
  enter?: boolean;
  leave?: boolean;
  follow?: number;
}

type Slot = Column | Mark;

interface Roll {
  slots: Slot[];
  columns: Column[];
  label: string;
}

interface Play {
  id: number;
  from: number;
  to: number;
  spin: boolean;
  wait?: boolean;
}

interface Live {
  formatValue: (value: number) => string;
  onStart?: () => void;
  onEnd?: () => void;
  model: Roll | null;
  mode: "count" | "roll";
  easing: Easing;
  duration: number;
  delay: number;
}

interface RollViewProps {
  model: Roll;
  playId: number;
  prefix: string;
  suffix: string;
  finalText: string;
  uid: string;
  setSlotRef: (index: number, node: HTMLSpanElement | null) => void;
  setFilterRef: (index: number, node: SVGFEGaussianBlurElement | null) => void;
}

interface CountUpViewProps {
  className: string;
  style: CSSProperties | undefined;
  setRef: (node: HTMLSpanElement | null) => void;
  setTextRef: (node: HTMLSpanElement | null) => void;
  onPointerEnter: (() => void) | undefined;
  model: Roll | null;
  playId: number;
  prefix: string;
  suffix: string;
  finalText: string;
  uid: string;
  initialText: string;
  setSlotRef: (index: number, node: HTMLSpanElement | null) => void;
  setFilterRef: (index: number, node: SVGFEGaussianBlurElement | null) => void;
}

const CELL = 1.2;
const STAGGER = 0.07;
const UNITS: [number, string][] = [
  [1e12, "T"],
  [1e9, "B"],
  [1e6, "M"],
  [1e3, "K"],
];
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const mod10 = (value: number) => ((value % 10) + 10) % 10;

const fade = (
  node: HTMLSpanElement | null | undefined,
  width: number,
  presence: number,
  settled: boolean
) => {
  if (!node) {
    return;
  }
  node.style.width = settled ? "" : `${(presence * width).toFixed(2)}px`;
  node.style.opacity = settled ? "" : presence.toFixed(3);
};

const updateColumn = (
  column: {
    strip: HTMLSpanElement | null;
    box: HTMLSpanElement | null;
    blur: SVGFEGaussianBlurElement | null;
    cells: (ChildNode | null)[];
    width: number;
    ease: (t: number) => number;
    base: number;
    sigma: number;
    presence: number;
    from: number;
    delta: number;
    enter: boolean;
    leave: boolean;
  },
  index: number,
  t: number,
  stagger: number,
  span: number,
  cell: number,
  uid: string
) => {
  if (!column.strip) {
    return;
  }
  const u = clamp01((t - index * stagger) / span);
  const pos = column.from + column.delta * column.ease(u);
  const base = Math.floor(pos);
  if (base !== column.base) {
    column.base = base;
    for (const [offset, node] of column.cells.entries()) {
      if (node) {
        node.nodeValue = String(mod10(base + offset - 1));
      }
    }
  }
  column.strip.style.transform = `translateY(${(-(1 + pos - base) * CELL).toFixed(4)}em)`;

  const u0 = Math.max(0, u - 0.004);
  const u1 = Math.min(1, u + 0.004);
  const speed =
    u1 > u0
      ? (Math.abs(column.delta) * Math.abs(column.ease(u1) - column.ease(u0))) /
        (u1 - u0) /
        span
      : 0;
  const sigma =
    u > 0 && u < 1 ? Math.min(cell * 0.05, (speed * cell) / 600) : 0;
  if (
    Math.abs(sigma - column.sigma) > 0.05 ||
    (sigma === 0 && column.sigma !== 0)
  ) {
    column.sigma = sigma;
    if (sigma > 0.2 && column.blur) {
      column.blur.setAttribute("stdDeviation", `0 ${sigma.toFixed(2)}`);
      column.strip.style.filter = `url(#${uid}-${index})`;
    } else {
      column.strip.style.filter = "";
    }
  }

  if (column.enter || column.leave) {
    column.presence = column.enter
      ? smooth(0, 0.45, u)
      : 1 - smooth(0.55, 1, u);
    fade(column.box, column.width, column.presence, column.enter && u >= 1);
  }
};

const updateMarks = (
  marks: (Mark & { node: HTMLSpanElement; width: number })[],
  columns: {
    enter: boolean;
    leave: boolean;
    presence: number;
  }[],
  overall: number
) => {
  for (const mark of marks) {
    if (mark.follow === undefined) {
      const presence = mark.enter
        ? smooth(0, 0.3, overall)
        : 1 - smooth(0.7, 1, overall);
      fade(mark.node, mark.width, presence, !!mark.enter && overall >= 1);
      continue;
    }
    const column = columns[mark.follow];
    if (column && (column.enter || column.leave)) {
      fade(
        mark.node,
        mark.width,
        column.presence,
        column.enter && column.presence >= 1
      );
    }
  }
};

const createRollRenderer = (
  live: Live,
  play: Play,
  ref: HTMLSpanElement,
  slotRefs: (HTMLSpanElement | null)[],
  filterRefs: (SVGFEGaussianBlurElement | null)[],
  uid: string,
  total: number,
  progress: (t: number) => number,
  ease: (t: number) => number,
  valueRef: { current: number }
) => {
  const { columns: layout, slots } = live.model as Roll;
  const fontSize = Number(getComputedStyle(ref).fontSize) || 16;
  const cell = CELL * fontSize;
  const stagger =
    layout.length > 1
      ? Math.min(STAGGER, (total * 0.4) / (layout.length - 1))
      : 0;
  const span = Math.max(0.001, total - stagger * (layout.length - 1));
  const columns = layout.map((column) => {
    const box = slotRefs[column.slot];
    const strip = box?.firstChild as HTMLSpanElement | null;
    return {
      ...column,
      box,
      strip,
      blur: filterRefs[column.index],
      cells: strip
        ? Array.from(strip.childNodes, (node) => node.firstChild)
        : ([] as (ChildNode | null)[]),
      width: box ? box.scrollWidth : 0,
      ease:
        live.easing === "spring"
          ? makeSpring(
              Math.min(
                0.12,
                Math.max(0.01, 0.35 / Math.max(1, Math.abs(column.delta)))
              )
            )
          : ease,
      base: Math.floor(column.from),
      sigma: 0,
      presence: column.enter ? 0 : 1,
    };
  });
  const marks = slots
    .map((slot, index) => ({ ...slot, node: slotRefs[index] }))
    .filter(
      (slot): slot is Mark & { node: HTMLSpanElement } =>
        "char" in slot &&
        !!slot.node &&
        (!!slot.enter || !!slot.leave || slot.follow !== undefined)
    )
    .map((slot) => ({ ...slot, width: slot.node.scrollWidth }));

  return (t: number) => {
    for (const [index, column] of columns.entries()) {
      updateColumn(column, index, t, stagger, span, cell, uid);
    }
    const overall = progress(t);
    updateMarks(marks, columns, overall);
    valueRef.current = play.from + (play.to - play.from) * ease(overall);
  };
};

const createCountRenderer =
  (
    play: Play,
    ease: (t: number) => number,
    progress: (t: number) => number,
    valueRef: { current: number },
    textRef: { current: HTMLSpanElement | null },
    liveRef: { current: Live | null }
  ) =>
  (t: number) => {
    const value = play.from + (play.to - play.from) * ease(progress(t));
    valueRef.current = value;
    if (textRef.current) {
      textRef.current.textContent = liveRef.current?.formatValue(value) ?? "";
    }
  };

const startAnimation = (
  live: Live,
  play: Play,
  uid: string,
  ref: HTMLSpanElement | null,
  slotRefs: (HTMLSpanElement | null)[],
  filterRefs: (SVGFEGaussianBlurElement | null)[],
  valueRef: { current: number },
  textRef: { current: HTMLSpanElement | null },
  liveRef: { current: Live | null },
  runningRef: { current: boolean }
) => {
  const ease = EASINGS[live.easing] || EASINGS.easeOut;
  const total = live.duration;
  const progress = (t: number) => (total > 0 ? clamp01(t / total) : 1);
  const renderer =
    live.mode === "roll" && live.model && ref
      ? createRollRenderer(
          live,
          play,
          ref,
          slotRefs,
          filterRefs,
          uid,
          total,
          progress,
          ease,
          valueRef
        )
      : createCountRenderer(play, ease, progress, valueRef, textRef, liveRef);

  runningRef.current = true;
  live.onStart?.();

  const finish = () => {
    renderer(Infinity);
    valueRef.current = play.to;
    runningRef.current = false;
    liveRef.current?.onEnd?.();
  };

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    finish();
    return null;
  }

  const controls = animate(0, total, {
    duration: total,
    delay: play.wait ? live.delay : 0,
    ease: "linear",
    onUpdate: renderer,
    onComplete: finish,
  });

  return () => {
    controls.stop();
    runningRef.current = false;
  };
};

const buildCountModel = (
  mode: "count" | "roll",
  play: Play | null,
  startValue: number,
  endValue: number,
  compact: boolean,
  decimals: number | undefined,
  places: number,
  separator: string
) => {
  if (mode !== "roll") {
    return null;
  }
  const a = play ? play.from : startValue;
  const b = play ? play.to : endValue;
  return buildRoll(a, b, !!play?.spin, {
    compact,
    decimals,
    places,
    separator,
  });
};

const getReplayState = (
  previous: Play | null,
  mode: "count" | "roll",
  value: number,
  startValue: number,
  endValue: number
): Play => {
  const id = (previous?.id || 0) + 1;
  if (mode === "roll") {
    return { id, from: value, to: value, spin: true };
  }
  return { id, from: startValue, to: endValue, spin: false };
};

const useStartCount = (
  active: boolean,
  startWhen: boolean,
  startedRef: { current: boolean },
  valueRef: { current: number },
  endValue: number,
  setPlay: (updater: (previous: Play | null) => Play) => void
) => {
  useEffect(() => {
    if (!active || !startWhen) {
      return;
    }
    startedRef.current = true;
    setPlay((previous) => ({
      id: (previous?.id || 0) + 1,
      from: valueRef.current,
      to: endValue,
      spin: false,
      wait: true,
    }));
  }, [active, startWhen, endValue, startedRef, valueRef, setPlay]);
};

const useCountFormat = (
  compact: boolean,
  decimals: number | undefined,
  places: number,
  separator: string,
  prefix: string,
  suffix: string
) =>
  useCallback(
    (latest: number) => {
      const { size, label, digits } = scaleFor(
        latest,
        compact,
        decimals,
        places
      );
      const parts = splitNumber(latest, digits, size);
      const body = `${parts.negative ? "-" : ""}${group(parts.int, separator)}${parts.frac ? `.${parts.frac}` : ""}`;
      return `${prefix}${body}${label}${suffix}`;
    },
    [compact, decimals, places, separator, prefix, suffix]
  );

const useCountDerived = (
  to: number,
  from: number,
  direction: "up" | "down",
  trigger: "view" | "load",
  isInView: boolean,
  decimals: number | undefined,
  format: "standard" | "compact"
) => {
  const startValue = direction === "down" ? to : from;
  const endValue = direction === "down" ? from : to;
  const active = trigger === "load" || isInView;
  const compact = format === "compact";
  const places =
    decimals ?? Math.max(getDecimalPlaces(from), getDecimalPlaces(to));
  return { startValue, endValue, active, compact, places };
};

const getPointerHandler = (replayOnHover: boolean, replay: () => void) =>
  replayOnHover ? replay : undefined;

const useCountState = (
  startValue: number,
  mode: "count" | "roll",
  formatValue: (value: number) => string,
  valueRef: { current: number },
  startedRef: { current: boolean },
  runningRef: { current: boolean },
  textRef: { current: HTMLSpanElement | null }
) => {
  const [initialText, setInitialText] = useState(() => formatValue(startValue));

  useIsoLayoutEffect(() => {
    if (!startedRef.current) {
      valueRef.current = startValue;
      setInitialText(formatValue(startValue));
    }
    if (mode === "count" && !runningRef.current && textRef.current) {
      textRef.current.textContent = formatValue(valueRef.current);
    }
  }, [
    mode,
    startValue,
    formatValue,
    startedRef,
    runningRef,
    textRef,
    valueRef,
  ]);

  return initialText;
};

const useReplay = (
  replayOnHover: boolean,
  runningRef: { current: boolean },
  startedRef: { current: boolean },
  mode: "count" | "roll",
  valueRef: { current: number },
  startValue: number,
  endValue: number,
  setPlay: (updater: (previous: Play | null) => Play) => void
) =>
  useCallback(() => {
    if (!replayOnHover || runningRef.current || !startedRef.current) {
      return;
    }
    setPlay((previous) =>
      getReplayState(previous, mode, valueRef.current, startValue, endValue)
    );
  }, [
    replayOnHover,
    runningRef,
    startedRef,
    mode,
    valueRef,
    startValue,
    endValue,
    setPlay,
  ]);

const makeSpring = (overshoot: number) => {
  const log = Math.log(Math.min(0.5, Math.max(0.001, overshoot)));
  const zeta = -log / Math.hypot(Math.PI * Math.PI + log * log);
  const damped = Math.PI / 0.52;
  const natural = damped / Math.sqrt(1 - zeta * zeta);
  const raw = (t: number) =>
    1 -
    Math.exp(-zeta * natural * t) *
      (Math.cos(damped * t) +
        ((zeta * natural) / damped) * Math.sin(damped * t));
  const residual = 1 - raw(1);
  return (t: number) => (t >= 1 ? 1 : raw(t) + residual * t * t * t);
};

const EASINGS: Record<Easing, (t: number) => number> = {
  linear: (t) => t,
  easeOut: cubicBezier(0.33, 1, 0.68, 1),
  expo: (t) => (t >= 1 ? 1 : (1 - 2 ** (-10 * t)) / (1 - 2 ** -10)),
  spring: makeSpring(0.06),
};

const getDecimalPlaces = (num: number): number => {
  const str = num.toString();

  if (str.includes(".")) {
    const [, decimals] = str.split(".");

    const decimalValue = Math.trunc(Number(decimals));
    if (decimalValue !== 0) {
      return decimals.length;
    }
  }

  return 0;
};

const unitFor = (value: number): [number, string] =>
  UNITS.find(([size]) => Math.abs(value) >= size * 0.9995) || [1, ""];

const scaleFor = (
  value: number,
  compact: boolean,
  decimals: number | undefined,
  places: number
) => {
  if (!compact) {
    return { size: 1, label: "", digits: places };
  }
  const [size, label] = unitFor(value);
  let digits = places;
  if (decimals !== undefined) {
    digits = decimals;
  } else if (label) {
    digits = Math.abs(value) / size < 100 ? 1 : 0;
  }
  return { size, label, digits };
};

const splitNumber = (value: number, digits: number, size: number) => {
  const fixed = (Math.abs(value) / size).toFixed(digits);
  const [int, frac = ""] = fixed.split(".");
  return { negative: value < 0 && Number(fixed) !== 0, int, frac };
};

const group = (int: string, separator: string) =>
  separator ? int.replaceAll(/\B(?:\d{3})+(?!\d)/gu, separator) : int;

const digitAt = (parts: { int: string; frac: string }, place: number) => {
  if (place < 0) {
    return Number(parts.frac[-place - 1]);
  }
  const index = parts.int.length - 1 - place;
  return index >= 0 ? Number(parts.int[index]) : null;
};

const buildRoll = (
  a: number,
  b: number,
  spin: boolean,
  {
    compact,
    decimals,
    places,
    separator,
  }: {
    compact: boolean;
    decimals: number | undefined;
    places: number;
    separator: string;
  }
): Roll => {
  const { size, label, digits } = scaleFor(b, compact, decimals, places);
  const pa = splitNumber(a, digits, size);
  const pb = splitNumber(b, digits, size);
  const length = Math.max(pa.int.length, pb.int.length);
  const slots: Slot[] = [];
  const columns: Column[] = [];
  if (pa.negative || pb.negative) {
    slots.push({ char: "-", enter: !pa.negative, leave: !pb.negative });
  }

  for (let place = length - 1; place >= -digits; place -= 1) {
    if (place === -1) {
      slots.push({ char: "." });
    }
    const start = digitAt(pa, place);
    const end = digitAt(pb, place);
    const column: Column = {
      slot: slots.length,
      index: columns.length,
      place,
      from: start ?? 0,
      to: end ?? 0,
      enter: start === null,
      leave: end === null,
      delta: 0,
    };
    slots.push(column);
    columns.push(column);
    if (separator && place > 0 && place % 3 === 0) {
      slots.push({ char: separator, follow: column.index });
    }
  }
  const up = spin || b >= a;
  for (const [index, column] of columns.entries()) {
    const rank = columns.length - 1 - index;
    const base = up
      ? mod10(column.to - column.from)
      : -mod10(column.from - column.to);
    const turns = spin
      ? Math.max(1, 3 - rank)
      : Math.min(
          Math.floor(Math.abs(b - a) / (size * 10 ** (column.place + 1))),
          Math.max(0, 3 - rank)
        );
    column.delta = base + (up ? 10 : -10) * turns;
  }
  return { slots, columns, label };
};

const RollView = ({
  model,
  playId,
  prefix,
  suffix,
  finalText,
  uid,
  setSlotRef,
  setFilterRef,
}: RollViewProps) => (
  <>
    <span
      key={`roll-${playId}`}
      aria-hidden="true"
      className="inline-flex whitespace-pre select-none"
    >
      {prefix && (
        <span className="inline-block h-[1.2em] leading-none">{prefix}</span>
      )}
      {model.slots.map((slot, index) => {
        const hidden =
          "char" in slot
            ? slot.enter ||
              (slot.follow !== undefined && model.columns[slot.follow].enter)
            : slot.enter;
        const collapsed = hidden
          ? ({
              "--count-width": "0",
              "--count-opacity": "0",
            } as CSSProperties)
          : undefined;
        if ("char" in slot) {
          return (
            <span
              key={index}
              ref={(node) => {
                setSlotRef(index, node);
              }}
              className="inline-block h-[1.2em] w-(--count-width) overflow-hidden leading-none opacity-(--count-opacity)"
              style={collapsed}
            >
              {slot.char}
            </span>
          );
        }
        return (
          <span
            key={index}
            ref={(node) => {
              setSlotRef(index, node);
            }}
            className="relative inline-block h-[1.2em] w-(--count-width) overflow-hidden leading-none opacity-(--count-opacity)"
            style={collapsed}
          >
            <span
              className="flex translate-y-(--count-y) flex-col"
              style={
                {
                  "--count-y": `${-CELL}em`,
                } as CSSProperties
              }
            >
              {[-1, 0, 1, 2].map((offset) => (
                <span key={offset} className="h-[1.2em]">
                  {mod10(slot.from + offset)}
                </span>
              ))}
            </span>
          </span>
        );
      })}
      {model.label && (
        <span className="inline-block h-[1.2em] leading-none">
          {model.label}
        </span>
      )}
      {suffix && (
        <span className="inline-block h-[1.2em] leading-none">{suffix}</span>
      )}
    </span>
    <span className="sr-only">{finalText}</span>
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {model.columns.map((column) => (
          <filter
            key={column.index}
            id={`${uid}-${column.index}`}
            x="-20%"
            y="-50%"
            width="140%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              ref={(node) => {
                setFilterRef(column.index, node);
              }}
              stdDeviation="0 0"
            />
          </filter>
        ))}
      </defs>
    </svg>
  </>
);

const CountUpView = ({
  className,
  style,
  setRef,
  setTextRef,
  onPointerEnter,
  model,
  playId,
  prefix,
  suffix,
  finalText,
  uid,
  initialText,
  setSlotRef,
  setFilterRef,
}: CountUpViewProps) => (
  <span
    className={`tabular-nums ${className}`}
    ref={setRef}
    style={style}
    onPointerEnter={onPointerEnter}
  >
    {model ? (
      <RollView
        model={model}
        playId={playId}
        prefix={prefix}
        suffix={suffix}
        finalText={finalText}
        uid={uid}
        setSlotRef={setSlotRef}
        setFilterRef={setFilterRef}
      />
    ) : (
      <span key="count" ref={setTextRef}>
        {initialText}
      </span>
    )}
  </span>
);

const CountUp = ({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  style,
  startWhen = true,
  separator = "",
  prefix = "",
  suffix = "",
  mode = "count",
  easing = "easeOut",
  decimals,
  format = "standard",
  trigger = "view",
  replayOnHover = false,
  onStart,
  onEnd,
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const filterRefs = useRef<(SVGFEGaussianBlurElement | null)[]>([]);
  const uid = useId().replaceAll(/[^\w-]/gu, "");
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const { startValue, endValue, active, compact, places } = useCountDerived(
    to,
    from,
    direction,
    trigger,
    isInView,
    decimals,
    format
  );
  const valueRef = useRef(startValue);
  const startedRef = useRef(false);
  const runningRef = useRef(false);
  const [play, setPlay] = useState<Play | null>(null);

  const formatValue = useCountFormat(
    compact,
    decimals,
    places,
    separator,
    prefix,
    suffix
  );

  const model = useMemo(
    () =>
      buildCountModel(
        mode,
        play,
        startValue,
        endValue,
        compact,
        decimals,
        places,
        separator
      ),
    [mode, play, startValue, endValue, compact, decimals, places, separator]
  );

  const initialText = useCountState(
    startValue,
    mode,
    formatValue,
    valueRef,
    startedRef,
    runningRef,
    textRef
  );
  const latestRef = useRef<Live | null>(null);

  useIsoLayoutEffect(() => {
    latestRef.current = {
      formatValue,
      onStart,
      onEnd,
      model,
      mode,
      easing,
      duration: Math.max(0, duration),
      delay,
    };
  });

  useStartCount(active, startWhen, startedRef, valueRef, endValue, setPlay);

  useEffect(() => {
    const live = latestRef.current;
    if (!play || !live) {
      return;
    }
    const element = ref.current;
    const slots = slotRefs.current;
    const filters = filterRefs.current;
    return (
      startAnimation(
        live,
        play,
        uid,
        element,
        slots,
        filters,
        valueRef,
        textRef,
        latestRef,
        runningRef
      ) ?? undefined
    );
  }, [play, uid]);

  const replay = useReplay(
    replayOnHover,
    runningRef,
    startedRef,
    mode,
    valueRef,
    startValue,
    endValue,
    setPlay
  );

  const finalText = formatValue(play ? play.to : endValue);

  return (
    <CountUpView
      className={className}
      style={style}
      setRef={(node) => {
        ref.current = node;
      }}
      setTextRef={(node) => {
        textRef.current = node;
      }}
      onPointerEnter={getPointerHandler(replayOnHover, replay)}
      model={model}
      playId={play?.id || 0}
      prefix={prefix}
      suffix={suffix}
      finalText={finalText}
      uid={uid}
      initialText={initialText}
      setSlotRef={(index, node) => {
        slotRefs.current[index] = node;
      }}
      setFilterRef={(index, node) => {
        filterRefs.current[index] = node;
      }}
    />
  );
};

export default CountUp;
