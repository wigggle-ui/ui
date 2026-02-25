import { VideoIcon } from "lucide-react";

import {
  Widget,
  WidgetContent,
  WidgetTitle,
} from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";

export default function WidgetDemo() {
  const now = new Date();

  const monthName = now.toLocaleDateString("en-US", { month: "long" });
  const date = now.getDate();

  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Widget size="md">
      <WidgetContent className="items-center justify-between gap-4">
        <div className="flex size-full flex-col items-center justify-between">
          <div className="flex size-full flex-col items-start justify-start gap-1">
            <Label className="text-muted-foreground text-sm font-normal">
              Google Meet
            </Label>
            <Label className="text-xl">Meet in 7 mins</Label>
            <Label className="border-l-productive border-l-4 px-4 text-base font-normal">
              Daily Scrum
            </Label>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <VideoIcon /> Join Call
          </Button>
        </div>
        <div className="flex size-full flex-col items-center justify-between gap-3">
          <WidgetTitle className="text-center">{monthName}</WidgetTitle>
          <div className="flex flex-col items-center justify-between gap-4">
            <div className="grid size-full grid-cols-7 gap-2 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-xs">
                  {d}
                </div>
              ))}
              {calendarDays.map((d, i) => (
                <div key={i} className="text-muted-foreground text-xs">
                  {d === date ? (
                    <Badge className="bg-productive flex size-4 items-center justify-center p-2">
                      {d}
                    </Badge>
                  ) : (
                    (d ?? <>&nbsp;</>)
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
}
