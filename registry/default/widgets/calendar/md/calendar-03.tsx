"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Widget,
  WidgetContent,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WEEKDAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"] as const;

type CalendarDay = number | null;

interface CalendarProps {
  days: CalendarDay[];
  month: number;
  today: Date;
  year: number;
}

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);

const getCalendarDays = (year: number, month: number): CalendarDay[] => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
};

const isToday = (
  day: CalendarDay,
  month: number,
  year: number,
  today: Date
): boolean =>
  day !== null &&
  today.getFullYear() === year &&
  today.getMonth() === month &&
  today.getDate() === day;

const WeekdayRow = () => (
  <>
    {WEEKDAY_NAMES.map((day, index) => (
      <div key={`${day}-${index}`} className="text-xs">
        {day}
      </div>
    ))}
  </>
);

const Calendar = ({ days, month, today, year }: CalendarProps) => (
  <div className="grid size-full grid-cols-7 gap-1 text-center">
    <WeekdayRow />
    {days.map((day, index) => (
      <div
        key={`${year}-${month}-${index}`}
        className="text-muted-foreground text-xs"
      >
        {isToday(day, month, year, today) ? (
          <Badge
            className="flex size-4 items-center justify-center"
            radius="xs"
          >
            {day}
          </Badge>
        ) : (
          (day ?? <>&nbsp;</>)
        )}
      </div>
    ))}
  </div>
);

const WidgetDemo = () => {
  const [calendarState, setCalendarState] = React.useState(() => {
    const today = new Date();

    return { date: today, today };
  });
  const { today, date } = calendarState;
  const year = date.getFullYear();
  const month = date.getMonth();
  const next = new Date(year, month + 1, 1);
  const calendarDays = getCalendarDays(year, month);
  const nextCalendarDays = getCalendarDays(next.getFullYear(), next.getMonth());
  const changeMonth = (step: number) => {
    setCalendarState((current) => ({
      ...current,
      date: new Date(
        current.date.getFullYear(),
        current.date.getMonth() + step,
        1
      ),
    }));
  };

  return (
    <Widget design="mumbai" size="md" className="p-3 pt-2.5">
      <WidgetContent className="flex flex-col gap-2">
        <div className="grid w-full grid-cols-2 items-center border-b-2 pb-1">
          <div className="flex w-full items-center gap-2">
            <Button
              aria-label="Previous month"
              variant="ghost"
              size="icon-xs"
              onClick={() => changeMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <WidgetTitle className="ms-8 text-sm font-normal">
              {formatMonth(date)} {year}
            </WidgetTitle>
          </div>
          <div className="flex w-full items-center justify-end gap-2">
            <WidgetTitle className="me-8 text-sm font-normal">
              {formatMonth(next)} {next.getFullYear()}
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
        </div>
        <div className="flex w-full flex-1 items-center justify-between gap-2">
          <Calendar
            days={calendarDays}
            month={month}
            today={today}
            year={year}
          />
          <div className="bg-secondary h-full w-1" />
          <Calendar
            days={nextCalendarDays}
            month={next.getMonth()}
            today={today}
            year={next.getFullYear()}
          />
        </div>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
