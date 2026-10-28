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
  const offset = circumference - (percentageComplete / 100) * circumference;

  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-1"
      {...props}
    >
      <div className="relative flex size-full items-center justify-center">
        <svg
          className="size-full scale-y-[-1] -rotate-90"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth="2"
            className="stroke-secondary"
          />

          {/* Progress Ring */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={ringColor}
          />
        </svg>

        {/* Center Text */}
        <p className="absolute text-sm font-semibold">{percentageComplete}%</p>
      </div>
      <p className="text-xs">{taskType}</p>
    </div>
  );
};

export { CircularProgress };
