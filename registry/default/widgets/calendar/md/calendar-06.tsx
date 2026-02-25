import { PlusIcon } from "lucide-react";

import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";
import { Button } from "@/registry/default/ui/button";

export default function WidgetDemo() {
  const now = new Date();

  const monthName = now.toLocaleDateString("en-US", { month: "long" });
  const year = now.getFullYear();

  const weekDates = Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + i,
      ),
  );

  return (
    <Widget size="md" className="gap-2" design="mumbai">
      <WidgetHeader>
        <WidgetTitle className="text-xl">
          {monthName} {year}
        </WidgetTitle>
        <Button variant="outline" size="sm">
          <PlusIcon /> Add Event
        </Button>
      </WidgetHeader>
      <WidgetContent className="flex-col gap-4">
        <div className="w-full space-y-0.5">
          <div className="grid w-full grid-cols-7 items-center gap-x-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
              <Label
                key={`weekday-${i}-${day}`}
                className="text-muted-foreground mx-auto text-sm"
              >
                {day}
              </Label>
            ))}
            {weekDates.map((d, i) => {
              const isToday = d.toDateString() === now.toDateString();
              return (
                <Label
                  key={i}
                  className={`mx-auto text-lg ${isToday ? "text-destructive" : ""}`}
                >
                  {d.getDate()}
                </Label>
              );
            })}
          </div>
        </div>
        <div className="w-full">
          <div className="border-destructive flex w-full items-center justify-between border-l-4 ps-3">
            <div className="space-y-0.5">
              <Label className="text-base font-normal">PRX vs RRQ</Label>
              <Label className="text-muted-foreground text-sm font-normal">
                VCT Pacific Kickoff Lower Final (BO5)
              </Label>
            </div>
            <Label className="text-lg">3:30 PM</Label>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
}
