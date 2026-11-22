"use client";

import * as React from "react";

import { Text } from "@/components/ui/text";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const CATEGORIES = [
  { amount: 640, color: "stroke-chart-3", dot: "bg-chart-3", name: "Rent" },
  {
    amount: 410,
    color: "stroke-productive",
    dot: "bg-productive",
    name: "Food",
  },
  {
    amount: 260,
    color: "stroke-vercel-yellow",
    dot: "bg-vercel-yellow",
    name: "Transport",
  },
  {
    amount: 180,
    color: "stroke-destructive",
    dot: "bg-destructive",
    name: "Fun",
  },
] as const;
const LAST_MONTH_TOTAL = 1620;
const GAP = 1.5;

const total = CATEGORIES.reduce((sum, item) => sum + item.amount, 0);
const change = Math.round(
  ((total - LAST_MONTH_TOTAL) / LAST_MONTH_TOTAL) * 100
);
const format = (value: number) => `$${value.toLocaleString("en-US")}`;

const slices = CATEGORIES.map((item, index) => {
  const offset = CATEGORIES.slice(0, index).reduce(
    (sum, previous) => sum + (previous.amount / total) * 100,
    0
  );
  return { ...item, length: (item.amount / total) * 100, offset };
});

const WidgetDemo = () => {
  const [active, setActive] = React.useState<number | null>(null);
  const [drawn, setDrawn] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const focused = active === null ? null : slices[active];
  const sliceState = (index: number) => {
    if (active === null) {
      return "opacity-100";
    }
    return active === index ? "opacity-100 [stroke-width:6.5]" : "opacity-30";
  };

  return (
    <Widget
      className="transition-all duration-300 hover:shadow-lg motion-safe:hover:-translate-y-1"
      design="mumbai"
      onPointerLeave={() => setActive(null)}
      size="md"
    >
      <WidgetContent className="gap-6">
        <div className="relative size-32 shrink-0">
          <svg
            aria-label="Spending by category"
            className={`size-full transition-all duration-700 ease-out motion-reduce:transition-none ${drawn ? "scale-100 -rotate-90 opacity-100" : "scale-90 -rotate-[200deg] opacity-0"}`}
            role="img"
            viewBox="0 0 42 42"
          >
            {slices.map((slice, index) => (
              <circle
                className={`${slice.color} transition-all duration-300 ${sliceState(index)}`}
                cx="21"
                cy="21"
                fill="none"
                key={slice.name}
                onPointerEnter={() => setActive(index)}
                pathLength={100}
                r="15.9155"
                strokeDasharray={`${slice.length - GAP} ${100 - slice.length + GAP}`}
                strokeDashoffset={-slice.offset}
                strokeWidth="5"
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="tabular-nums">
              <Text size="xl" weight="semibold">
                {format(focused?.amount ?? total)}
              </Text>
            </span>
            {focused ? (
              <Text size="xs" variant="muted-foreground">
                {Math.round((focused.amount / total) * 100)}% of spend
              </Text>
            ) : (
              <Text
                size="xs"
                variant={change > 0 ? "destructive" : "productive"}
              >
                {change > 0 ? "+" : ""}
                {change}% vs last
              </Text>
            )}
          </div>
        </div>
        <ul className="flex flex-1 flex-col gap-1">
          {CATEGORIES.map((item, index) => (
            <li key={item.name}>
              <button
                aria-label={`${item.name}, ${format(item.amount)}`}
                className={`hover:bg-secondary flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-200 motion-safe:hover:translate-x-1 ${active === null || active === index ? "opacity-100" : "opacity-40"}`}
                onBlur={() => setActive(null)}
                onFocus={() => setActive(index)}
                onPointerEnter={() => setActive(index)}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`size-2.5 rounded-full transition-transform duration-200 ${item.dot} ${active === index ? "scale-125" : ""}`}
                  />
                  <Text size="sm">{item.name}</Text>
                </span>
                <span className="tabular-nums">
                  <Text size="sm" variant="muted-foreground">
                    {format(item.amount)}
                  </Text>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
