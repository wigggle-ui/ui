import { VideoIcon } from "lucide-react";

import { Widget, WidgetContent } from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";
import { Button } from "@/registry/default/ui/button";
import { cn } from "@/registry/default/lib/utils";

export default function WidgetDemo() {
  const meetings = [
    {
      title: "Daily Scrum",
      time: "7:00 - 8:30 AM",
      room: "Online",
      borderColor: "border-destructive",
    },
    {
      title: "Design Roundup",
      time: "11:15 - 12:00 PM",
      room: "Figma Room",
      borderColor: "border-blue-500",
    },
    {
      title: "UAT Testing",
      time: "1:00 - 2:00 PM",
      room: "Jest Room",
      borderColor: "border-yellow-500",
    },
    {
      title: "PROD Launch",
      time: "6:00 PM",
      room: "SpaceX Room",
      borderColor: "border-productive",
    },
  ];

  return (
    <Widget design="mumbai" size="md">
      <WidgetContent className="grid grid-cols-2 items-center gap-5">
        {meetings.map((el) => (
          <div
            key={el.title}
            className={cn(
              el.borderColor,
              "flex w-full items-center justify-between border-l-4 ps-3",
            )}
          >
            <div className="space-y-1">
              <Label className="text-sm font-normal">{el.title}</Label>
              <Label className="text-muted-foreground text-xs font-normal">
                {el.room}
              </Label>
              <Label className="text-xs font-light">{el.time}</Label>
            </div>
            {el.room === "Online" && (
              <Button variant="outline" size="icon-sm">
                <VideoIcon />
              </Button>
            )}
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
}
