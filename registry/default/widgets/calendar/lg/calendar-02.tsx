import { twJoin } from "tailwind-merge";

import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";
import { Separator } from "@/registry/default/ui/separator";

export default function WidgetDemo() {
  const now = new Date();

  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = now.toLocaleDateString("en-US", { month: "short" });
  const date = now.getDate();

  const events = [
    {
      title: "Apartment cleaning",
      startTime: "17:00 ",
      endTime: "17:30",
      color: "border-destructive",
      location: "Home",
    },
    {
      title: "Pickeball",
      startTime: "20:00",
      endTime: "21:00",
      color: "border-yellow-500",
      location: "Wankhede Stadium",
    },
    {
      title: "Bedtime Meditation",
      startTime: "11:30",
      endTime: "11:45",
      color: "border-green-500",
      location: "Home",
    },
  ];

  return (
    <Widget size="lg" className="gap-3">
      <WidgetHeader>
        <WidgetTitle className="font-normal text-blue-500 uppercase">
          {dayName} {date} {monthName}
        </WidgetTitle>
      </WidgetHeader>
      <Separator />
      <WidgetContent className="flex-col items-center justify-start gap-4">
        {events.map((el) => (
          <div
            key={el.title}
            className="flex w-full items-center justify-between"
          >
            <div className={twJoin(el.color, "border-l-4 ps-3")}>
              <Label className="text-sm">{el.title}</Label>
              <Label className="text-muted-foreground text-sm">
                {el.location}
              </Label>
            </div>
            <div className="flex flex-col items-end justify-end gap-1.5">
              <Label className="text-muted-foreground font-normal">
                {el.startTime}
              </Label>
              <Label className="text-muted-foreground font-normal">
                {el.endTime}
              </Label>
            </div>
          </div>
        ))}
      </WidgetContent>
      <WidgetHeader className="mt-2">
        <WidgetTitle className="font-normal text-blue-500 uppercase">
          Tomorrow
        </WidgetTitle>
      </WidgetHeader>
      <Separator />
      <WidgetContent className="flex-col items-center justify-start gap-4">
        <div className="flex w-full items-center justify-between">
          <div className="border-destructive border-l-4 ps-3">
            <Label className="text-sm">Design New Widgets</Label>
            <Label className="text-muted-foreground text-sm">
              Right Cerebral Ave
            </Label>
          </div>
          <div className="flex flex-col items-end justify-end gap-1.5">
            <Label className="text-muted-foreground font-normal">10:30</Label>
            <Label className="text-muted-foreground font-normal">12:30</Label>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
}
