"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useMemo, useState, startTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => {
  const [calendar, setCalendar] = useState(() => {
    const initialDate = new Date(2025, 0, 1);
    return { date: initialDate, today: initialDate };
  });
  const { date, today } = calendar;

  useEffect(() => {
    const currentDate = new Date();
    startTransition(() => {
      setCalendar({ date: currentDate, today: currentDate });
    });
  }, []);

  const year = date.getFullYear();
  const month = date.getMonth();

  const calendarDays = useMemo<(number | null)[]>(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  }, [year, month]);

  const changeMonth = (step: number) =>
    setCalendar((currentCalendar) => ({
      ...currentCalendar,
      date: new Date(
        currentCalendar.date.getFullYear(),
        currentCalendar.date.getMonth() + step,
        1
      ),
    }));

  const isToday = (day: number | null) =>
    day !== null &&
    new Date(year, month, day).toDateString() === today.toDateString();

  const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    new Date(year, month)
  );
  const days = Array.from(
    { length: 7 },
    (_, i) =>
      new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
        new Date(2025, 0, i + 5)
      )[0]
  );

  return (
    <Widget className="gap-1" design="mumbai">
      <WidgetHeader>
        <Button variant="ghost" size="icon-xs" onClick={() => changeMonth(-1)}>
          <ChevronLeftIcon className="size-4" />
        </Button>
        <WidgetTitle>
          {monthName} {year}
        </WidgetTitle>
        <Button variant="ghost" size="icon-xs" onClick={() => changeMonth(1)}>
          <ChevronRightIcon className="size-4" />
        </Button>
      </WidgetHeader>
      <Separator className="h-0.5" />
      <WidgetContent>
        <div className="grid size-full grid-cols-7 gap-1 text-center">
          {days.map((day, i) => (
            <div key={`weekday-${i}-${day}`} className="text-xs">
              {day}
            </div>
          ))}
          {calendarDays.map((day, i) => (
            <div
              key={day === null ? `empty-${i}` : `day-${day}`}
              className="text-muted-foreground text-xs"
            >
              {day && isToday(day) ? (
                <Badge
                  radius="xs"
                  className="flex size-4 items-center justify-center"
                >
                  {day}
                </Badge>
              ) : (
                day
              )}
            </div>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
