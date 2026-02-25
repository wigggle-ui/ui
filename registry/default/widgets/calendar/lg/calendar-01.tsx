"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";
import { Button } from "@/registry/default/ui/button";
import { Separator } from "@/registry/default/ui/separator";
import { Label } from "@/registry/default/ui/label";
import { cn } from "@/registry/default/lib/utils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MIN_PRICE = 80;
const MAX_PRICE = 250;

export default function WidgetDemo() {
  const [date, setDate] = React.useState(new Date());
  const year = date.getFullYear();
  const month = date.getMonth();

  const calendarDays = React.useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  }, [year, month]);

  const prices = React.useMemo(() => {
    const priceMap: Record<number, number> = {};
    calendarDays.forEach((day) => {
      if (day !== null) {
        priceMap[day] =
          Math.floor(Math.random() * (MAX_PRICE - MIN_PRICE + 1)) + MIN_PRICE;
      }
    });
    return priceMap;
  }, [calendarDays]);

  const handlePreviousMonth = () =>
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    new Date(year, month),
  );

  return (
    <Widget className="gap-3" size="lg">
      <WidgetHeader className="items-center justify-between">
        <Button variant="outline" size="icon-sm" onClick={handlePreviousMonth}>
          <ChevronLeftIcon className="size-4" />
        </Button>
        <WidgetTitle className="text-2xl">
          {monthName} {year}
        </WidgetTitle>
        <Button variant="outline" size="icon-sm" onClick={handleNextMonth}>
          <ChevronRightIcon className="size-4" />
        </Button>
      </WidgetHeader>
      <Separator />
      <WidgetContent className="flex-col! items-stretch! justify-start!">
        <div className="grid h-full w-full auto-rows-fr grid-cols-7 gap-2">
          {WEEKDAY_LABELS.map((day, i) => (
            <div
              key={`weekday-${i}`}
              className="text-muted-foreground m-auto text-center text-sm font-semibold"
            >
              {day}
            </div>
          ))}
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-0.5 rounded-lg text-center"
            >
              {day ? (
                <>
                  <Label className="text-sm leading-none font-semibold">
                    {day}
                  </Label>
                  <Label
                    className={cn(
                      prices[day] < 120
                        ? "text-productive"
                        : "text-muted-foreground",
                      "text-xs leading-tight",
                    )}
                  >
                    ${prices[day]}
                  </Label>
                </>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  );
}
