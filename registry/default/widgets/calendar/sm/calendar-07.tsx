"use client";

import { BikeIcon, BookOpenIcon, DumbbellIcon } from "lucide-react";
import React from "react";

import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const activities = [
  {
    date: "prev",
    icon: BookOpenIcon,
    task: "30 m",
  },
  {
    date: "today",
    icon: BikeIcon,
    task: "5 km",
  },
  {
    date: "next",
    icon: DumbbellIcon,
    task: "1 hr",
  },
];

const now = new Date();

const day = now.toLocaleDateString("en-US", { weekday: "short" });
const date = now.getDate().toString().padStart(2, "0");

const format = (offset: number) => {
  const d = new Date();
  d.setDate(now.getDate() + offset);
  return {
    date: d.getDate().toString().padStart(2, "0"),
    day: d.toLocaleDateString("en-US", { weekday: "short" }),
  };
};

const prev = format(-1);
const next = format(1);

const dateButtons = [
  { formattedDate: prev, isCurrent: false, label: "prev", offset: -1 },
  {
    formattedDate: { date, day },
    isCurrent: true,
    label: "today",
    offset: 0,
  },
  { formattedDate: next, isCurrent: false, label: "next", offset: 1 },
];

const WidgetDemo = () => {
  const [selectedDate, setSelectedDate] = React.useState<string>("today");

  return (
    <Widget>
      <WidgetContent className="flex-col items-center justify-between gap-4">
        <div className="grid w-full grid-cols-3 items-center gap-2 rounded-sm">
          {dateButtons.map((btn) => (
            <button
              type="button"
              key={btn.label}
              onClick={() => {
                setSelectedDate(btn.label);
              }}
              className={`flex flex-col items-center justify-center space-y-1 rounded-sm p-1 hover:cursor-pointer ${
                selectedDate === btn.label
                  ? "bg-white text-black"
                  : "bg-secondary hover:opacity-75"
              }`}
            >
              <span className="text-xs">{btn.formattedDate.day}</span>
              <span className="text-2xl">{btn.formattedDate.date}</span>
            </button>
          ))}
        </div>
        <div className="bg-secondary grid w-full flex-1 grid-cols-2 items-center gap-x-2 rounded-sm px-2 py-1">
          {activities
            .filter((activity) => activity.date === selectedDate)
            .map((activity) => {
              const IconComponent = activity.icon;
              return (
                <React.Fragment key={activity.date}>
                  <IconComponent className="stroke-destructive mx-auto size-10" />
                  <Label size="xl" weight="semibold" className="mx-auto">
                    {activity.task}
                  </Label>
                </React.Fragment>
              );
            })}
        </div>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
