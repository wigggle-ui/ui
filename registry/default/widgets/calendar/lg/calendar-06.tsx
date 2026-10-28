"use client";

import { cn } from "cn";
import { PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const now = new Date();

const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
const monthName = now.toLocaleDateString("en-US", { month: "long" });
const date = now.getDate();

const events = [
  {
    category: "home",
    color: "border-vercel-blue",
    time: "9:00 - 10:00 AM",
    title: "Apartment cleaning",
  },
  {
    category: "sport",
    color: "border-productive",
    time: "11:00 AM - 1:00 PM",
    title: "Pickleball",
  },
  {
    category: "work",
    color: "border-vercel-yellow",
    time: "1:45 - 3:45 PM",
    title: "Design New Widgets",
  },
];

const WidgetDemo = () => (
  <Widget size="lg" className="gap-3">
    <WidgetHeader className="items-center justify-between gap-4">
      <div className="flex space-x-4">
        <WidgetTitle className="text-6xl">{date}</WidgetTitle>
        <div className="flex h-full flex-col items-start justify-between py-1">
          <Label size="xl">{dayName}</Label>
          <Label variant="muted-foreground">{monthName}</Label>
        </div>
      </div>
      <Button variant="outline" size="sm">
        <PlusIcon />
        Add Event
      </Button>
    </WidgetHeader>

    <WidgetContent className="flex-col items-center justify-start gap-4">
      {events.map((event) => (
        <div
          key={event.title}
          className="flex w-full items-center justify-between"
        >
          <div className={cn(event.color, "space-y-0.5 border-l-4 ps-3")}>
            <Label>{event.title}</Label>
            <Label size="sm" variant="muted-foreground">
              {event.time}
            </Label>
          </div>
          <Badge variant="secondary">{event.category}</Badge>
        </div>
      ))}
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
