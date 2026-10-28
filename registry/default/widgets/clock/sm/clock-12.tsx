"use client";

import { Play, Pause, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";

const padZero = (num: number) => String(num).padStart(2, "0");

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  return {
    milliseconds: padZero(milliseconds),
    seconds: padZero(seconds),
  };
};

const secondMarkers = Array.from({ length: 60 }, (_, index) => index);
const hourMarkers = Array.from({ length: 12 }, (_, index) => index);

const WidgetDemo = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const { seconds, milliseconds } = formatTime(time);

  const totalSeconds = Math.floor(time / 1000);
  const totalMilliseconds = time % 1000;

  const secondHandRotation =
    ((totalSeconds % 60) + totalMilliseconds / 1000) * 6;

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  return (
    <Widget design="mumbai">
      <WidgetContent className="border-foreground/50 relative mx-auto aspect-square size-full max-h-32 max-w-32 rounded-full border-2">
        {/* Clock center dot */}
        <div className="border-destructive absolute top-1/2 left-1/2 z-20 size-2 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2" />
        {secondMarkers.map((index) => (
          <div
            key={`tick-${index}`}
            className="absolute h-full w-full transform-[rotate(var(--rotation))]"
            style={{ "--rotation": `${index * 6}deg` } as CSSProperties}
          >
            {/* Small second tick */}
            <div className="bg-muted absolute top-0 left-1/2 h-1.5 w-0.5 -translate-x-1/2 transform" />
          </div>
        ))}
        {/* Hour markers and numbers */}
        {hourMarkers.map((index) => (
          <div
            key={index}
            className="absolute h-full w-full transform-[rotate(var(--rotation))]"
            style={{ "--rotation": `${index * 30}deg` } as CSSProperties}
          >
            {/* Hour tick */}
            <div className="bg-muted-foreground/50 absolute top-0 left-1/2 h-3 w-0.5 -translate-x-1/2 transform" />
          </div>
        ))}
        {/* Numbers 1-12 */}
        {hourMarkers.map((index) => {
          const angle = index * 30 * (Math.PI / 180);
          const x = (Math.sin(angle) * 50).toFixed(2);
          const y = (-Math.cos(angle) * 50).toFixed(2);
          const number = index === 0 ? 12 : index;
          return (
            <Label
              key={`num-${index}`}
              variant="muted-foreground"
              size="xs"
              weight="semibold"
              style={{ "--x": `${x}px`, "--y": `${y}px` } as CSSProperties}
              className="absolute top-[calc(50%+var(--y))] left-[calc(50%+var(--x))] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
              {number}
            </Label>
          );
        })}
        {/* Second hand (red) with dot at the end */}
        <div
          className="bg-destructive absolute top-1/2 left-1/2 z-10 h-16 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full rotate-(--rotation) rounded-full"
          style={{ "--rotation": `${secondHandRotation}deg` } as CSSProperties}
        />
        <Label
          variant="foreground"
          size="lg"
          className="absolute bottom-8 z-5 text-center"
        >
          {seconds}.{milliseconds}
        </Label>
      </WidgetContent>
      <WidgetFooter>
        {/* Reset Button */}
        <Button
          onClick={handleReset}
          size="icon-sm-circle"
          variant="outline"
          aria-label="Reset stopwatch"
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button
          onClick={handlePlayPause}
          size="icon-sm-circle"
          variant="outline"
          aria-label={isRunning ? "Pause stopwatch" : "Start stopwatch"}
        >
          {isRunning ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 fill-current" />
          )}
        </Button>
      </WidgetFooter>
    </Widget>
  );
};

export default WidgetDemo;
