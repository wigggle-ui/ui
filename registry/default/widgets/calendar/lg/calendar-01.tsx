"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MIN_PRICE = 80;
const MAX_PRICE = 250;
const INITIAL_DATE = new Date();

const WidgetDemo = () => {
  const [date, setDate] = React.useState(INITIAL_DATE);

  const year = date.getFullYear();
  const month = date.getMonth();

  const calendarDays: (number | null)[] = React.useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstDay })
        .fill(0)
        .map(() => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  }, [year, month]);

  const prices = React.useMemo(() => {
    const priceMap: Record<number, number> = {};

    for (const day of calendarDays) {
      if (day === null) {
        continue;
      }

      priceMap[day] =
        MIN_PRICE +
        ((day * 37 + month * 17 + year * 13) % (MAX_PRICE - MIN_PRICE + 1));
    }

    return priceMap;
  }, [calendarDays, month, year]);

  const handlePreviousMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(new Date(year, month, 1));

  return (
    <Widget className="gap-2" size="lg">
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
      <WidgetContent className="flex-col items-stretch justify-start gap-2">
        <div className="grid h-max w-full auto-rows-fr grid-cols-7 gap-1.5">
          {WEEKDAY_LABELS.map((day) => (
            <Label
              size="sm"
              weight="semibold"
              variant="muted-foreground"
              key={day}
              className="mx-auto mb-auto text-center"
            >
              {day}
            </Label>
          ))}
        </div>
        <div className="grid h-full w-full auto-rows-fr grid-cols-7 gap-2">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-0.5 rounded-lg text-center"
            >
              {day !== null && (
                <>
                  <Label size="sm">{day}</Label>

                  <Label
                    size="xs"
                    weight="light"
                    variant={
                      prices[day] < 120 ? "productive" : "muted-foreground"
                    }
                  >
                    ${prices[day]}
                  </Label>
                </>
              )}
            </div>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
