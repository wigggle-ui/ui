import { VideoIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const now = new Date();

const monthName = now.toLocaleDateString("en-US", { month: "long" });
const date = now.getDate();

const year = now.getFullYear();
const month = now.getMonth();

const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = new Date(year, month, 1).getDay();

const calendarDays: (number | null)[] = [
  ...Array.from({ length: firstDayOfMonth }, () => null),
  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
];

const WidgetDemo = () => (
  <Widget size="md" design="mumbai">
    <WidgetContent className="items-center justify-between gap-4">
      <div className="flex size-full flex-col items-center justify-between pb-2">
        <div className="flex size-full flex-col items-start justify-start gap-1">
          <Label variant="muted-foreground" size="sm">
            Google Meet
          </Label>
          <Label size="xl">Meet in 7 mins</Label>
          <Label>Daily Scrum</Label>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <VideoIcon /> Join Call
        </Button>
      </div>
      <div className="flex size-full flex-col items-center justify-between gap-3">
        <WidgetTitle className="text-center">{monthName}</WidgetTitle>
        <div className="flex flex-col items-center justify-between gap-4">
          <div className="grid size-full grid-cols-7 gap-2 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-xs">
                {d}
              </div>
            ))}
            {calendarDays.map((d, i) => (
              <div key={i} className="text-muted-foreground text-xs">
                {d === date ? (
                  <Badge
                    variant="success"
                    className="flex size-4 items-center justify-center"
                    radius="xs"
                  >
                    {d}
                  </Badge>
                ) : (
                  (d ?? <>&nbsp;</>)
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
