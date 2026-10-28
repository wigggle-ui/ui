"use client";

import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
} from "@/registry/default/ui/widget";

const TIMER_DURATION_SECONDS = 30 * 60;

interface TimerState {
  isCountingDown: boolean;
  timeLeft: number;
}

interface TimerAction {
  type: "reset" | "tick" | "toggle";
}

const initialTimerState: TimerState = {
  isCountingDown: false,
  timeLeft: TIMER_DURATION_SECONDS,
};

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case "reset": {
      return initialTimerState;
    }
    case "tick": {
      if (state.timeLeft <= 1) {
        return { isCountingDown: false, timeLeft: 0 };
      }

      return { ...state, timeLeft: state.timeLeft - 1 };
    }
    case "toggle": {
      return {
        ...state,
        isCountingDown: !state.isCountingDown && state.timeLeft > 0,
      };
    }
    default: {
      return state;
    }
  }
};

const WidgetDemo = () => {
  const [{ isCountingDown, timeLeft }, dispatch] = React.useReducer(
    timerReducer,
    initialTimerState
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  React.useEffect(() => {
    if (!isCountingDown) {
      return;
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isCountingDown]);

  return (
    <Widget design="mumbai">
      <WidgetHeader className="justify-center">
        <Label size="xxxl" variant="muted-foreground">
          🚀
        </Label>
      </WidgetHeader>
      <WidgetContent>
        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5">
          <Label size="xxxxl">
            {minutes}:{seconds}
          </Label>
          <Label size="xs" variant="muted-foreground">
            POMODORO
          </Label>
        </div>
      </WidgetContent>
      <WidgetFooter>
        <Button
          aria-label="Reset timer"
          onClick={() => dispatch({ type: "reset" })}
          variant="outline"
          size="icon-sm-circle"
        >
          <RotateCcwIcon />
        </Button>
        <Button
          aria-label={isCountingDown ? "Pause timer" : "Start timer"}
          onClick={() => dispatch({ type: "toggle" })}
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
