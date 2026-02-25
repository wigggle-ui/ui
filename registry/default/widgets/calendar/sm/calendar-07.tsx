import { CalendarPlusIcon } from "lucide-react";

import { Widget, WidgetContent } from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/registry/default/ui/tabs";
import { Button } from "@/registry/default/ui/button";

export default function WidgetDemo() {
  const now = new Date();

  const month = now.toLocaleDateString("en-US", { month: "short" });
  const date = now.getDate().toString().padStart(2, "0");
  const year = now.getFullYear();
  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, now.getMonth(), 1).getDay();

  const weekDates = Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + i,
      ),
  );

  const fillerDays = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Widget className="p-0">
      <Tabs className="size-full" defaultValue="week">
        <TabsList className="size-full border-b-2" variant="line">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
        <TabsContent className="flex size-full px-3" value="week">
          <WidgetContent className="flex-col items-center justify-between gap-3 py-3">
            <div className="flex w-full flex-col items-center justify-center space-y-2">
              <Label className="text-destructive -mt-2 space-x-2 text-3xl font-semibold">
                <span>{date}</span>
                <span>{month}</span>
              </Label>
              <div className="w-full space-y-0.5">
                <div className="grid w-full grid-cols-7 items-center gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <Label
                      key={`weekday-${i}-${day}`}
                      className="text-muted-foreground mx-auto text-xs"
                    >
                      {day}
                    </Label>
                  ))}
                </div>
                <div className="grid w-full grid-cols-7 gap-1 text-center">
                  {weekDates.map((d, i) => {
                    const isToday = d.toDateString() === now.toDateString();
                    return (
                      <Label
                        key={i}
                        className={`mx-auto text-xs ${isToday ? "text-destructive" : ""}`}
                      >
                        {d.getDate()}
                      </Label>
                    );
                  })}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <CalendarPlusIcon /> New Event
            </Button>
          </WidgetContent>
        </TabsContent>
        <TabsContent className="flex size-full px-3" value="month">
          <div className="grid size-full grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={`weekday-${i}-${day}`} className="text-xs">
                {day}
              </div>
            ))}
            {fillerDays.map((_, i) => (
              <div key={`filler-${i}`} className="text-xs">
                &nbsp;
              </div>
            ))}
            {days.map((day) => (
              <div key={day} className="text-muted-foreground text-xs">
                {day === parseInt(date) ? (
                  <Label className="text-destructive flex justify-center text-xs font-semibold">
                    {day}
                  </Label>
                ) : (
                  day
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Widget>
  );
}
