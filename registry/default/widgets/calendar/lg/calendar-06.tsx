import { PlusIcon } from "lucide-react";

import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import { cn } from "@/registry/default/lib/utils";

export default function WidgetDemo() {
  const now = new Date();

  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = now.toLocaleDateString("en-US", { month: "long" });
  const date = now.getDate();

  const events = [
    {
      title: "Apartment cleaning",
      time: "9:00 - 10:00 AM",
      color: "border-blue-500",
      category: "home",
    },
    {
      title: "Pickeball",
      time: "11:00 - 1:00 PM",
      color: "border-yellow-500",
      category: "sport",
    },
    {
      title: "Design New Widgets",
      time: "1:45 - 3:45 PM",
      color: "border-green-500",
      category: "work",
    },
  ];

  return (
    <Widget size="lg" className="gap-3">
      <WidgetHeader className="items-center justify-between gap-4">
        <div className="flex space-x-4">
          <WidgetTitle className="text-6xl">{date}</WidgetTitle>
          <div className="flex h-full flex-col items-start justify-between py-1">
            <Label className="text-xl">{dayName}</Label>
            <Label className="text-muted-foreground text-base">
              {monthName}
            </Label>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <PlusIcon /> Add Event
        </Button>
      </WidgetHeader>
      <WidgetContent className="flex-col items-center justify-start gap-4">
        {events.map((el) => (
          <div
            key={el.title}
            className="flex w-full items-center justify-between"
          >
            <div className={cn(el.color, "space-y-0.5 border-l-4 ps-3")}>
              <Label className="text-base">{el.title}</Label>
              <Label className="text-muted-foreground text-sm">{el.time}</Label>
            </div>
            <Badge variant="secondary" className="text-sm">
              {el.category}
            </Badge>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
}
