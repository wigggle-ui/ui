"use client";

import * as React from "react";

import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const GOAL_NAME = "New Laptop";
const SAVED = 4800;
const TARGET = 8000;
const FINISH = "Mar 2027";

const percent = Math.round((SAVED / TARGET) * 100);
const format = (value: number) => `$${value.toLocaleString("en-US")}`;

const WidgetDemo = () => {
  const [filled, setFilled] = React.useState(false);
  const [showRemaining, setShowRemaining] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Widget
      className="group transition-all duration-300 hover:shadow-lg motion-safe:hover:-translate-y-1"
      design="mumbai"
    >
      <WidgetHeader>
        <WidgetTitle>
          <Text variant="muted-foreground">{GOAL_NAME}</Text>
        </WidgetTitle>
      </WidgetHeader>
      <WidgetContent className="flex-col items-start justify-center gap-3">
        <Text size="xxxxl" weight="semibold">
          {percent}%
        </Text>
        <progress
          aria-label={`${GOAL_NAME} savings progress`}
          className="sr-only"
          max={100}
          value={percent}
        />
        <div
          aria-hidden="true"
          className="bg-secondary relative h-2.5 w-full overflow-hidden rounded-full"
        >
          <div
            className="bg-productive h-full w-(--progress) rounded-full transition-all duration-1000 ease-out group-hover:brightness-125 motion-reduce:transition-none"
            style={
              {
                "--progress": filled ? `${percent}%` : "0%",
              } as React.CSSProperties
            }
          />
        </div>
        <button
          aria-label="Toggle between saved and remaining amount"
          className="cursor-pointer text-left transition-opacity hover:opacity-70 active:scale-95"
          onClick={() => setShowRemaining((value) => !value)}
          type="button"
        >
          <Text size="xs" variant="muted-foreground">
            {showRemaining
              ? `${format(TARGET - SAVED)} to go`
              : `${format(SAVED)} of ${format(TARGET)}`}
          </Text>
        </button>
      </WidgetContent>
      <WidgetFooter>
        <span className="flex items-center gap-1.5">
          <span className="bg-productive size-1.5 rounded-full motion-safe:animate-pulse" />
          <Text size="xs" variant="productive" weight="semibold">
            On track
          </Text>
        </span>
        <Text size="xs" variant="muted-foreground">
          {FINISH}
        </Text>
      </WidgetFooter>
    </Widget>
  );
};

export default WidgetDemo;
