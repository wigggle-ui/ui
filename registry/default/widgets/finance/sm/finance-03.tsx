"use client";

import { TriangleIcon } from "lucide-react";
import * as React from "react";

import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const TREND = [
  62_100, 64_300, 63_400, 67_200, 70_100, 69_300, 73_000, 76_400, 75_200,
  80_100, 82_250, 84_230,
];
const CHART_WIDTH = 160;
const CHART_HEIGHT = 36;
const LAST_INDEX = TREND.length - 1;

const min = Math.min(...TREND);
const max = Math.max(...TREND);
const coords = TREND.map((value, index) => ({
  x: (index / LAST_INDEX) * CHART_WIDTH,
  y: CHART_HEIGHT - ((value - min) / (max - min)) * (CHART_HEIGHT - 8) - 4,
}));
const line = coords
  .map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`)
  .join(" ");
const area = `0,${CHART_HEIGHT} ${line} ${CHART_WIDTH},${CHART_HEIGHT}`;
const format = (value: number) => `$${value.toLocaleString("en-US")}`;

const WidgetDemo = () => {
  const [drawn, setDrawn] = React.useState(false);
  const [active, setActive] = React.useState(LAST_INDEX);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    setActive(
      Math.min(LAST_INDEX, Math.max(0, Math.round(ratio * LAST_INDEX)))
    );
  };

  const previous = TREND[Math.max(0, active - 1)];
  const current = TREND[active];
  const change = active === 0 ? 0 : ((current - previous) / previous) * 100;
  const isUp = change >= 0;
  const point = coords[active];

  return (
    <Widget
      className="group transition-all duration-300 hover:shadow-lg motion-safe:hover:-translate-y-1"
      design="mumbai"
    >
      <WidgetHeader>
        <WidgetTitle>
          <Text variant="muted-foreground">
            Net worth{active === LAST_INDEX ? "" : ` · ${MONTHS[active]}`}
          </Text>
        </WidgetTitle>
      </WidgetHeader>
      <WidgetContent className="flex-col items-start justify-center gap-2">
        <span className="tabular-nums">
          <Text size="xxxl" weight="semibold">
            {format(current)}
          </Text>
        </span>
        <div className="flex items-center gap-1.5">
          <TriangleIcon
            className={`size-3 stroke-none transition-transform duration-300 ${isUp ? "fill-productive" : "fill-destructive rotate-180"}`}
          />
          <Text size="sm" variant={isUp ? "productive" : "destructive"}>
            {Math.abs(change).toFixed(1)}% this month
          </Text>
        </div>
      </WidgetContent>
      <WidgetFooter>
        <svg
          aria-label="Net worth over the last 12 months. Move the pointer to inspect a month."
          className="h-9 w-full touch-none"
          onPointerLeave={() => setActive(LAST_INDEX)}
          onPointerMove={handleMove}
          role="img"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        >
          <polygon
            className={`fill-productive/15 transition-opacity duration-1000 ${drawn ? "opacity-100" : "opacity-0"}`}
            points={area}
          />
          <polyline
            className="stroke-productive transition-all duration-1000 ease-out motion-reduce:transition-none"
            fill="none"
            pathLength={1}
            points={line}
            strokeDasharray={1}
            strokeDashoffset={drawn ? 0 : 1}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <line
            className="stroke-productive/40"
            x1={point.x}
            x2={point.x}
            y1="0"
            y2={CHART_HEIGHT}
          />
          <circle
            className="fill-productive stroke-background"
            cx={point.x}
            cy={point.y}
            r="3.5"
            strokeWidth="2"
          />
        </svg>
      </WidgetFooter>
    </Widget>
  );
};

export default WidgetDemo;
