"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const today = new Date();

const WEEKDAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"] as const;

const EVENTS = [
  { time: "9 AM", title: "Scrum" },
  { time: "11 AM", title: "Design Roundup" },
  { time: "7 PM", title: "Launch" },
] as const;

type CalendarDay = number | null;

const getCalendarDays = (year: number, month: number): CalendarDay[] => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
};

const isSameDay = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const WidgetDemo = () => {
  const [date, setDate] = React.useState(() => new Date());

  const year = date.getFullYear();
  const month = date.getMonth();

  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });

  const calendarDays = getCalendarDays(year, month);

  const changeMonth = (step: number) => {
    setDate((current) => {
      const next = new Date(
        current.getFullYear(),
        current.getMonth() + step,
        1
      );

      return next;
    });
  };

  return (
    <Widget design="mumbai" size="md">
      <WidgetContent className="items-center justify-between gap-4">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <div className="flex w-full items-center justify-between">
            <Button
              aria-label="Previous month"
              variant="ghost"
              size="icon-xs"
              onClick={() => changeMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <WidgetTitle>
              {monthName} {year}
            </WidgetTitle>
            <Button
              aria-label="Next month"
              variant="ghost"
              size="icon-xs"
              onClick={() => changeMonth(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid size-full grid-cols-7 gap-1 text-center">
            {WEEKDAY_NAMES.map((day, index) => (
              <div key={`${day}-${index}`} className="text-xs">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              const isCurrentDay =
                day !== null && isSameDay(new Date(year, month, day), today);

              return (
                <div
                  key={`${year}-${month}-${index}`}
                  className="text-muted-foreground text-xs"
                >
                  {isCurrentDay ? (
                    <Badge className="flex size-4 items-center justify-center">
                      {day}
                    </Badge>
                  ) : (
                    (day ?? <>&nbsp;</>)
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-start">
          <WidgetHeader className="text-destructive text-base">
            {today.toLocaleDateString("en-US", {
              weekday: "long",
            })}
          </WidgetHeader>
          <div className="w-full">
            <Label size="xxxl" className="mx-auto w-max">
              {today.getDate().toString().padStart(2, "0")}
            </Label>
            <div className="mt-2 space-y-2">
              {EVENTS.map((event) => (
                <Badge
                  key={event.title}
                  variant="secondary"
                  className="flex w-full items-center justify-between"
                >
                  {event.title}
                  <span className="text-muted-foreground">{event.time}</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
