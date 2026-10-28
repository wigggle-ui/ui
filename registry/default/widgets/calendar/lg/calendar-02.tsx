import { twJoin } from "tailwind-merge";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const events = [
  {
    color: "border-destructive",
    endTime: "17:30",
    location: "Home",
    startTime: "17:00",
    title: "Apartment cleaning",
  },
  {
    color: "border-yellow-500",
    endTime: "21:00",
    location: "Wankhede Stadium",
    startTime: "20:00",
    title: "Pickleball",
  },
  {
    color: "border-green-500",
    endTime: "11:45",
    location: "Home",
    startTime: "11:30",
    title: "Bedtime Meditation",
  },
];

const now = new Date();

const dayName = now.toLocaleDateString("en-US", {
  weekday: "long",
});
const monthName = now.toLocaleDateString("en-US", {
  month: "short",
});
const date = now.getDate();

const WidgetDemo = () => (
  <Widget size="lg" className="gap-3">
    <WidgetHeader>
      <WidgetTitle className="text-vercel-blue font-normal uppercase">
        {dayName} {date} {monthName}
      </WidgetTitle>
    </WidgetHeader>

    <Separator />

    <WidgetContent className="flex-col items-center justify-start gap-4">
      {events.map((event) => (
        <div
          key={event.title}
          className="flex w-full items-center justify-between"
        >
          <div className={twJoin(event.color, "border-l-4 ps-3")}>
            <Label size="sm">{event.title}</Label>
            <Label size="sm" variant="muted-foreground">
              {event.location}
            </Label>
          </div>

          <div className="flex flex-col items-end justify-end gap-1.5">
            <Label size="sm" variant="muted-foreground">
              {event.startTime}
            </Label>
            <Label size="sm" variant="muted-foreground">
              {event.endTime}
            </Label>
          </div>
        </div>
      ))}
    </WidgetContent>

    <WidgetHeader className="mt-2">
      <WidgetTitle className="text-vercel-blue font-normal uppercase">
        Tomorrow
      </WidgetTitle>
    </WidgetHeader>

    <Separator />

    <WidgetContent className="flex-col items-center justify-start gap-4">
      <div className="flex w-full items-center justify-between">
        <div className="border-destructive border-l-4 ps-3">
          <Label size="sm">Design New Widgets</Label>
          <Label size="sm" variant="muted-foreground">
            Right Cerebral Ave
          </Label>
        </div>

        <div className="flex flex-col items-end justify-end gap-1.5">
          <Label variant="muted-foreground">10:30</Label>
          <Label variant="muted-foreground">12:30</Label>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
