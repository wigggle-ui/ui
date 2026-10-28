"use client";

import React from "react";

interface Props {
  percentageComplete: number;
  taskType: string;
  ringColor?: string;
}

const CircularProgress = ({
  percentageComplete,
  taskType,
  ringColor = "stroke-blue-600",
  ...props
}: React.ComponentProps<"div"> & Props) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  // Start animation from 0
  const [offset, setOffset] = React.useState(circumference);

  React.useEffect(() => {
    const finalOffset =
      circumference - (percentageComplete / 100) * circumference;

    // small delay so the transition triggers
    requestAnimationFrame(() => setOffset(finalOffset));
  }, [circumference, percentageComplete]);

  return (
    <div
      className="flex size-full flex-col items-center justify-center gap-1"
      {...props}
    >
      <div className="relative">
        <svg className="size-full scale-y-[-1] -rotate-90" viewBox="0 0 36 36">
          {/* Background */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth="2"
            className="stroke-secondary"
          />

          {/* Animated Progress */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${ringColor} transition-all duration-700 ease-out`}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold">{percentageComplete}%</p>
        </div>
      </div>
      <p className="text-xs">{taskType}</p>
    </div>
  );
};

export { CircularProgress };
