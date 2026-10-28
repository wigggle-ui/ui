import { cn } from "cn";
import type { CSSProperties } from "react";

import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Widget,
  WidgetHeader,
  WidgetContent,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const visitorsChartData = [
  { color: "bg-blue-500", percentage: "40" },
  { color: "bg-yellow-500", percentage: "23" },
  { color: "bg-red-500", percentage: "20" },
  { color: "bg-green-500", percentage: "17" },
];

const visitorsByDeviceChartData = [
  { color: "bg-blue-500", count: 1578, device: "MacOS" },
  { color: "bg-yellow-500", count: 908, device: "iOS" },
  { color: "bg-red-500", count: 789, device: "Windows" },
  { color: "bg-green-500", count: 671, device: "Android" },
];

const WidgetDemo = () => (
  <Widget className="gap-3" design="mumbai">
    <WidgetHeader>
      <WidgetTitle>Visitors</WidgetTitle>
      <WidgetTitle>3946</WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="flex-col justify-start gap-3">
      <div className="flex h-5 w-full">
        {visitorsChartData.map((el, i) => (
          <Tooltip key={i} delayDuration={300}>
            <TooltipTrigger asChild>
              <div
                style={{ "--width": `${el.percentage}%` } as CSSProperties}
                className={cn(
                  el.color,
                  "h-full w-(--width) transition-all duration-300 first:rounded-l-full last:rounded-r-full hover:scale-115 hover:cursor-pointer"
                )}
              />
            </TooltipTrigger>
            <TooltipContent className="">{el.percentage}%</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="w-full space-y-1.5">
        {visitorsByDeviceChartData.map((el) => (
          <div
            key={el.device}
            className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2.5"
          >
            <div className={cn("size-3 rounded-xs", `${el.color}`)} />
            <Label size="sm">{el.device}</Label>
            <Label size="sm">{el.count}</Label>
          </div>
        ))}
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
