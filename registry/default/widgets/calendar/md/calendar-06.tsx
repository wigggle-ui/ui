import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const now = new Date();

const monthName = now.toLocaleDateString("en-US", { month: "long" });
const year = now.getFullYear();

const weekDates = Array.from(
  { length: 7 },
  (_, i) =>
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + i
    )
);

const WidgetDemo = () => (
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
            <Text
              key={`weekday-${i}-${day}`}
              size="sm"
              variant="muted-foreground"
              className="mx-auto"
            >
              {day}
            </Text>
          ))}
          {weekDates.map((d, i) => {
            const isToday = d.toDateString() === now.toDateString();
            return (
              <Text
                key={i}
                size="lg"
                variant={isToday ? "destructive" : "default"}
                className="mx-auto"
              >
                {d.getDate()}
              </Text>
            );
          })}
        </div>
      </div>
      <div className="w-full">
        <div className="border-destructive flex w-full items-center justify-between border-l-4 ps-3">
          <div className="space-y-0.5">
            <Text>PRX vs RRQ</Text>
            <Text size="sm" variant="muted-foreground">
              VCT Pacific Kickoff Lower Final (BO5)
            </Text>
          </div>
          <Text size="lg">3:30 PM</Text>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
