"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const now = new Date();
const today = now.getDate();
const monthName = now.toLocaleDateString("en-US", { month: "long" });

const lowerLimit = today - 3;
const upperLimit = today + 3;

const allTasks = [
  {
    imageURL: "https://avatars.githubusercontent.com/u/6751787?v=4",
    time: "8:30 AM",
    title: "Teach Theo Elixir",
  },
  {
    imageURL: "https://avatars.githubusercontent.com/u/124599?v=4",
    time: "12:30 PM",
    title: "Meeting with ShadCN",
  },
  {
    imageURL: "https://owcdn.net/img/62bbebb185a7e.png",
    time: "3:30 PM",
    title: "PRX vs G2",
  },
  {
    imageURL: "https://avatars.githubusercontent.com/u/7549148?v=4",
    time: "7:30 PM",
    title: "Warcraft with Orc! ⚔️",
  },
  {
    imageURL: "https://avatars.githubusercontent.com/u/23276437?v=4",
    time: "10:00 AM",
    title: "Teaching Tailwind",
  },
  {
    imageURL: "https://avatars.githubusercontent.com/u/14985020?s=200&v=4",
    time: "4:30 PM",
    title: "Wigggle UI Vercel OSS",
  },
];

const getTasksForDay = (day: number) => {
  const shuffled = [...allTasks].toSorted(
    (a, b) =>
      (((a.title.codePointAt(0) ?? 0) * day) % 17) -
      (((b.title.codePointAt(0) ?? 0) * day) % 17)
  );

  const count = day % 2 === 0 ? 2 : 3;

  return shuffled.slice(0, count);
};

const WidgetDemo = () => {
  const [selectedDate, setSelectedDate] = React.useState(today);
  const tasks = React.useMemo(
    () => getTasksForDay(selectedDate),
    [selectedDate]
  );

  const weekDates = React.useMemo(
    () =>
      Array.from(
        { length: 7 },
        (_, i) =>
          new Date(now.getFullYear(), now.getMonth(), today - now.getDay() + i)
      ),
    []
  );

  const handlePreviousDay = () => {
    setSelectedDate((prev) => Math.max(lowerLimit, prev - 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => Math.min(upperLimit, prev + 1));
  };

  return (
    <Widget size="lg" className="p-0">
      <WidgetHeader className="bg-destructive rounded-t-3xl p-4">
        <WidgetTitle className="w-max text-center text-2xl">
          {selectedDate} {monthName}
        </WidgetTitle>

        <Button
          onClick={() => setSelectedDate(today)}
          variant="secondary"
          size="sm"
        >
          Today
        </Button>
      </WidgetHeader>

      <WidgetContent className="flex-col items-center justify-start gap-4 p-4">
        <div className="flex w-full items-center justify-between gap-2">
          <Button
            onClick={handlePreviousDay}
            variant="outline"
            size="icon-sm"
            disabled={selectedDate <= lowerLimit}
          >
            <ChevronLeftIcon />
          </Button>

          <div className="grid w-full grid-cols-7 items-center gap-x-4 px-3">
            {WEEKDAY_LABELS.map((day, i) => (
              <Label
                key={`weekday-${i}`}
                size="sm"
                variant="muted-foreground"
                className="mx-auto"
              >
                {day}
              </Label>
            ))}

            {weekDates.map((day) => {
              const dayNumber = day.getDate();
              const isSelected = dayNumber === selectedDate;

              return (
                <Label
                  key={day.toISOString()}
                  variant={isSelected ? "destructive" : "default"}
                  size="xl"
                  className="mx-auto"
                >
                  {dayNumber}
                </Label>
              );
            })}
          </div>

          <Button
            onClick={handleNextDay}
            variant="outline"
            size="icon-sm"
            disabled={selectedDate >= upperLimit}
          >
            <ChevronRightIcon />
          </Button>
        </div>

        {tasks.map((task) => (
          <div
            key={task.title}
            className="flex w-full items-center justify-start gap-x-4 pb-3 not-last:border-b-2"
          >
            <Avatar size="lg">
              <AvatarImage src={task.imageURL} alt={task.title} />
              <AvatarFallback>{task.title.slice(0, 1)}</AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <Label>{task.title}</Label>
              <Label variant="muted-foreground">{task.time}</Label>
            </div>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
