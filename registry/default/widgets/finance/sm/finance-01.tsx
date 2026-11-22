"use client";

import * as React from "react";

import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";

const BUDGET = 3000;
const SPENT = 1760;
const DAYS_LEFT = 20;
const RING_RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const remaining = BUDGET - SPENT;
const usedRatio = SPENT / BUDGET;
const perDay = Math.floor(remaining / DAYS_LEFT);
const format = (value: number) => `$${value.toLocaleString("en-US")}`;

const WidgetDemo = () => {
  const [drawn, setDrawn] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Widget
      className="group transition-all duration-300 hover:shadow-lg motion-safe:hover:-translate-y-1"
      design="mumbai"
    >
      <WidgetContent>
        <div className="relative size-28">
          <svg
            aria-label={`${Math.round(usedRatio * 100)}% of monthly budget used`}
            className="size-full -rotate-90"
            role="img"
            viewBox="0 0 100 100"
          >
            <circle
              className="stroke-secondary"
              cx="50"
              cy="50"
              fill="none"
              r={RING_RADIUS}
              strokeWidth="9"
            />
            <circle
              className="stroke-productive transition-all duration-1000 ease-out group-hover:[stroke-width:12] motion-reduce:transition-none"
              cx="50"
              cy="50"
              fill="none"
              r={RING_RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={
                drawn ? CIRCUMFERENCE * (1 - usedRatio) : CIRCUMFERENCE
              }
              strokeLinecap="round"
              strokeWidth="9"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <Text size="xl" weight="semibold">
              {format(remaining)}
            </Text>
            <span className="relative flex h-3 w-full justify-center">
              <span className="absolute transition-opacity duration-300 group-hover:opacity-0">
                <Text size="xs" variant="muted-foreground">
                  left
                </Text>
              </span>
              <span className="absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Text size="xs" variant="muted-foreground">
                  of {format(BUDGET)}
                </Text>
              </span>
            </span>
          </div>
        </div>
      </WidgetContent>
      <WidgetFooter>
        <Text size="xs" variant="muted-foreground">
          {DAYS_LEFT} days left
        </Text>
        <span className="origin-right transition-transform duration-300 group-hover:scale-110">
          <Text size="xs" variant="productive" weight="semibold">
            {format(perDay)}/day
          </Text>
        </span>
      </WidgetFooter>
    </Widget>
  );
};

export default WidgetDemo;
