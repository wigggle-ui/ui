"use client";

import { useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
  VolumeXIcon,
  type LucideIcon,
} from "lucide-react";

import { Widget, WidgetContent } from "@/registry/default/ui/widget";
import { Button } from "@/registry/default/ui/button";

const SIZE = 192;
const CENTER = SIZE / 2;
const OUTER_R = 96;
const INNER_R = 40;

const toRad = (deg: number) => (deg * Math.PI) / 180;

const arcPath = (start: number, end: number) => {
  const [s, e] = [toRad(start), toRad(end)];
  const [ox, oy] = [
    CENTER + OUTER_R * Math.cos(s),
    CENTER + OUTER_R * Math.sin(s),
  ];
  const [ex, ey] = [
    CENTER + OUTER_R * Math.cos(e),
    CENTER + OUTER_R * Math.sin(e),
  ];
  const [ix, iy] = [
    CENTER + INNER_R * Math.cos(s),
    CENTER + INNER_R * Math.sin(s),
  ];
  const [iex, iey] = [
    CENTER + INNER_R * Math.cos(e),
    CENTER + INNER_R * Math.sin(e),
  ];
  return `M${ox},${oy} A${OUTER_R},${OUTER_R} 0 0 1 ${ex},${ey} L${iex},${iey} A${INNER_R},${INNER_R} 0 0 0 ${ix},${iy}Z`;
};

const iconPos = (start: number, end: number) => {
  const mid = toRad((start + end) / 2);
  const r = (OUTER_R + INNER_R) / 2;
  return {
    x: CENTER + r * Math.cos(mid) - 10,
    y: CENTER + r * Math.sin(mid) - 10,
  };
};

const SEGMENTS: {
  angles: [number, number];
  icon: LucideIcon;
  label: string;
}[] = [
  { angles: [-135, -45], icon: Volume2Icon, label: "Volume up" },
  { angles: [45, 135], icon: VolumeXIcon, label: "Volume down" },
  { angles: [135, 225], icon: SkipBackIcon, label: "Previous" },
  { angles: [-45, 45], icon: SkipForwardIcon, label: "Next" },
];

export default function WidgetDemo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Widget>
      <WidgetContent>
        <div className="relative size-full">
          <button>
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="absolute inset-0 size-full"
            >
              {SEGMENTS.map(({ angles: [s, e], icon: Icon, label }) => {
                const pos = iconPos(s, e);
                return (
                  <g key={label}>
                    <path
                      d={arcPath(s, e)}
                      className="fill-secondary hover:fill-muted-foreground/30 cursor-pointer transition-colors focus:outline-none"
                      strokeWidth={1}
                      role="button"
                      aria-label={label}
                      tabIndex={0}
                    />
                    <foreignObject
                      x={pos.x}
                      y={pos.y}
                      width={20}
                      height={20}
                      className="pointer-events-none"
                    >
                      <Icon className="size-5" />
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </button>
          <Button
            variant="ghost"
            onClick={() => setIsPlaying((p) => !p)}
            className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <PauseIcon className="size-6" />
            ) : (
              <PlayIcon className="ml-0.5 size-6" />
            )}
          </Button>
        </div>
      </WidgetContent>
    </Widget>
  );
}
