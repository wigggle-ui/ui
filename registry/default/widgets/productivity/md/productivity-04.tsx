import { Separator } from "@/components/ui/separator";
import { CircularProgress } from "@/registry/default/ui/circular-progress";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const taskChartInfo = [
  {
    color: "stroke-vercel-yellow",
    percentage: 62,
    task: "Focus",
  },
  {
    color: "stroke-vercel-purple",
    percentage: 22,
    task: "Meetings",
  },
  {
    color: "stroke-vercel-teal",
    percentage: 10,
    task: "Breaks",
  },
  {
    color: "stroke-vercel-pink",
    percentage: 6,
    task: "Others",
  },
];

const WidgetDemo = () => (
  <Widget size="md">
    <WidgetContent className="flex flex-col items-center justify-center gap-2">
      <div className="grid w-full grid-cols-3 items-center gap-4">
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-muted-foreground text-sm font-normal">Time</p>
          <p className="text-2xl">6h</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-muted-foreground text-sm font-normal">Tasks</p>
          <p className="text-2xl">55</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-muted-foreground text-sm font-normal">Work day</p>
          <p className="text-2xl">79%</p>
        </div>
      </div>
      <Separator />
      <div className="mt-1 grid w-full grid-cols-4 items-center gap-6 px-4">
        {taskChartInfo.map((el, i) => (
          <CircularProgress
            key={i}
            percentageComplete={el.percentage}
            taskType={el.task}
            ringColor={el.color}
          />
        ))}
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
