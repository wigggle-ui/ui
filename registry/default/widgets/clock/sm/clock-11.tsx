"use client";

import {
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcw,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
} from "@/registry/default/ui/widget";

type TimeAction = "add" | "subtract";

const WidgetDemo = () => {
  const [isCountingDown, setIsCountingDown] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const updateTime = React.useCallback((action: TimeAction) => {
    setTimeLeft((prev) => {
      if (action === "add") {
        return prev + 60;
      }
      if (action === "subtract" && prev >= 60) {
        return prev - 60;
      }
      return prev;
    });
  }, []);

  const resetTimer = React.useCallback(() => {
    setIsCountingDown(false);
    setTimeLeft(60);
  }, []);

  const handleToggle = React.useCallback(() => {
    setIsCountingDown((prev) => !prev);
  }, []);

  React.useEffect(() => {
    if (isCountingDown && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    if (!isCountingDown && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCountingDown]);

  return (
    <Widget className="gap-3" design="mumbai">
      <WidgetHeader className="items-center">
        <Button
          aria-label="Subtract one minute"
          disabled={isCountingDown || timeLeft <= 60}
          onClick={() => updateTime("subtract")}
          variant="ghost"
          size="icon-sm"
          className="disabled:cursor-not-allowed"
        >
          <MinusIcon />
        </Button>

        <Label variant="muted-foreground">
          {minutes} Min{minutes === 1 ? "" : "s"}
        </Label>
        <Button
          aria-label="Add one minute"
          disabled={isCountingDown || timeLeft >= 600}
          onClick={() => updateTime("add")}
          variant="ghost"
          size="icon-sm"
          className="disabled:cursor-not-allowed"
        >
          <PlusIcon />
        </Button>
      </WidgetHeader>
      <WidgetContent>
        <div className="flex h-full w-full items-center justify-center">
          <Label size="xxxxl">
            {minutes}:{seconds}
          </Label>
        </div>
      </WidgetContent>
      <WidgetFooter>
        <Button
          aria-label="Reset timer"
          onClick={resetTimer}
          variant="outline"
          size="icon-sm-circle"
        >
          <RotateCcw />
        </Button>
        <Button
          aria-label={isCountingDown ? "Pause timer" : "Start timer"}
          onClick={handleToggle}
          variant="outline"
          size="icon-sm-circle"
        >
          {isCountingDown ? (
            <PauseIcon className="size-4 fill-current stroke-none" />
          ) : (
            <PlayIcon className="size-4 fill-current stroke-none" />
          )}
        </Button>
      </WidgetFooter>
    </Widget>
  );
};

export default WidgetDemo;
