import { GlassWaterIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Widget,
  WidgetHeader,
  WidgetTitle,
  WidgetContent,
} from "@/registry/default/ui/widget";

const now = new Date();
const year = now.getFullYear();
const date = now.getDate();

const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
const firstDay = new Date(year, now.getMonth(), 1).getDay();

const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

const skippedDays = new Set<number>(
  Array.from({ length: 3 }, () => Math.floor(Math.random() * 30) + 1)
);

const renderDay = (day: number) => {
  if (!skippedDays.has(day) && day < date) {
    return (
      <Badge
        variant="success"
        className="flex size-4 items-center justify-center"
      >
        <span className="text-xs">{day}</span>
      </Badge>
    );
  }
  if (day === date) {
    return (
      <Badge className="flex size-4 items-center justify-center">
        <span className="text-xs">{day}</span>
      </Badge>
    );
  }
  return day;
};
const WidgetDemo = () => (
  <Widget className="gap-2 p-3" design="mumbai">
    <WidgetHeader className="justify-start gap-1 px-1">
      <GlassWaterIcon className="size-4" />
      <WidgetTitle className="font-normal">Water Streak</WidgetTitle>
    </WidgetHeader>
    <Separator className="h-0.5" />
    <WidgetContent>
      <div className="grid size-full grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`f-${i}`} className="text-xs">
            &nbsp;
          </div>
        ))}
        {days.map((day) => (
          <div key={day} className="text-muted-foreground text-xs">
            {renderDay(day)}
          </div>
        ))}
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
