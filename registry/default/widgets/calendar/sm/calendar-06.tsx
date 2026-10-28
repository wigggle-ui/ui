import { cn } from "cn";
import { PlusIcon, VideoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const now = new Date();

const day = now.toLocaleDateString("en-US", { weekday: "long" });
const month = now.toLocaleDateString("en-US", { month: "long" });
const date = now.getDate().toString().padStart(2, "0");

const events = [
  {
    action: null,
    borderColor: "bg-yellow-500",
    time: "7:00 - 8:30 AM",
    title: "GYM",
  },
  {
    action: null,
    borderColor: "bg-blue-500",
    time: "11:00 - 1:00 PM",
    title: "Doc Review",
  },
  {
    action: VideoIcon,
    borderColor: "bg-green-500",
    time: "6:00 PM",
    title: "Wigggle Launch",
  },
];

const WidgetDemo = () => (
  <Widget design="mumbai" className="gap-2">
    <WidgetHeader className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <WidgetTitle className="text-3xl">{date}</WidgetTitle>
        <div className="flex flex-col">
          <Label size="xs" variant="muted-foreground">
            {month}
          </Label>
          <Label size="xs" variant="muted-foreground">
            {day}
          </Label>
        </div>
      </div>
      <Button variant="outline" size="icon-sm">
        <PlusIcon />
      </Button>
    </WidgetHeader>

    <WidgetContent className="flex flex-col items-start gap-2">
      {events.map(({ title, time, borderColor, action: Action }) => (
        <div key={title} className="flex w-full items-center justify-between">
          <div className="flex h-full">
            <div className={cn("h-full w-1 rounded-md", borderColor)} />
            <div className="flex flex-col px-2">
              <Label size="xs" variant="muted-foreground">
                {time}
              </Label>
              <Label size="xs">{title}</Label>
            </div>
          </div>

          {Action && (
            <Button variant="outline" size="icon-sm">
              <Action />
            </Button>
          )}
        </div>
      ))}
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
