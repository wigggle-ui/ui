import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";
import { Button } from "@/registry/default/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";

export default function WidgetDemo() {
  const now = new Date();

  const monthName = now.toLocaleDateString("en-US", { month: "long" });
  const date = now.getDate();

  const [selectedDate, setSelectedDate] = React.useState<number>(now.getDate());

  const weekDates = Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + i,
      ),
  );

  const lowerLimit = now.getDate() - 3;
  const upperLimit = now.getDate() + 3;

  const allTasks = [
    {
      imageURL: "https://avatars.githubusercontent.com/u/6751787?v=4",
      title: "Teach Theo Elixir",
      time: "8:30 AM",
    },
    {
      imageURL: "https://avatars.githubusercontent.com/u/124599?v=4",
      title: "Meeting with ShadCN",
      time: "12:30 PM",
    },
    {
      imageURL: "https://owcdn.net/img/62bbebb185a7e.png",
      title: "PRX vs G2",
      time: "3:30 PM",
    },
    {
      imageURL: "https://avatars.githubusercontent.com/u/7549148?v=4",
      title: "Warcraft with Orc! ⚔️",
      time: "7:30 PM",
    },
    {
      imageURL: "https://avatars.githubusercontent.com/u/23276437?v=4",
      title: "Teaching Tailwind",
      time: "10:00 AM",
    },
    {
      imageURL: "https://avatars.githubusercontent.com/u/14985020?s=200&v=4",
      title: "Wigggle UI Vercel OSS",
      time: "4:30 PM",
    },
  ];

  const getRandomTasks = () => {
    const count = Math.random() > 0.5 ? 2 : 3;
    const indices = new Set<number>();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * allTasks.length));
    }
    return Array.from(indices).map((i) => allTasks[i]);
  };

  const tasks = getRandomTasks();

  return (
    <Widget size="lg" className="p-0">
      <WidgetHeader className="bg-destructive rounded-t-3xl p-4">
        <WidgetTitle className="w-max text-center text-2xl text-white">
          {date} {monthName}
        </WidgetTitle>
        <Button
          onClick={() => {
            setSelectedDate(now.getDate());
          }}
          variant="secondary"
          size="sm"
        >
          Today
        </Button>
      </WidgetHeader>
      <WidgetContent className="flex-col items-center justify-start gap-4 p-4">
        <div className="flex w-full items-center justify-between gap-2">
          <Button
            onClick={() => {
              selectedDate > lowerLimit
                ? setSelectedDate(selectedDate - 1)
                : setSelectedDate(lowerLimit);
            }}
            variant="outline"
            size="icon-sm"
          >
            <ChevronLeftIcon />
          </Button>
          <div className="grid w-full grid-cols-7 items-center gap-x-4 px-3">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <Label
                key={`weekday-${i}-${day}`}
                className="text-muted-foreground mx-auto text-sm"
              >
                {day}
              </Label>
            ))}
            {weekDates.map((d, i) => {
              const isToday = d.getDate() === selectedDate;
              return (
                <Label
                  key={i}
                  className={`mx-auto text-xl ${isToday ? "text-destructive" : ""}`}
                >
                  {d.getDate()}
                </Label>
              );
            })}
          </div>
          <Button
            onClick={() => {
              selectedDate < upperLimit
                ? setSelectedDate(selectedDate + 1)
                : setSelectedDate(upperLimit);
            }}
            variant="outline"
            size="icon-sm"
          >
            <ChevronRightIcon />
          </Button>
        </div>
        {tasks.map((el) => (
          <div
            key={el.title}
            className="flex w-full items-center justify-start gap-x-4 pb-3 not-last:border-b-2"
          >
            <Avatar size="lg">
              <AvatarImage src={el.imageURL} alt={el.title} />
              <AvatarFallback>{el.title.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Label className="text-base">{el.title}</Label>
              <Label className="text-muted-foreground font-normal">
                {el.time}
              </Label>
            </div>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
}
