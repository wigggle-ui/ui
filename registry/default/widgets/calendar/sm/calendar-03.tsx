import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Widget,
  WidgetHeader,
  WidgetTitle,
  WidgetContent,
} from "@/registry/default/ui/widget";

const now = new Date();

const month = now.toLocaleString("en-US", { month: "long" });
const year = now.getFullYear();
const date = now.getDate();

const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
const firstDayOfMonth = new Date(year, now.getMonth(), 1).getDay();

const fillerDays = Array.from({ length: firstDayOfMonth }).fill(null);
const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

const WidgetDemo = () => (
  <Widget className="gap-2" design="mumbai">
    <WidgetHeader className="justify-center">
      <WidgetTitle>
        {month} {year}
      </WidgetTitle>
    </WidgetHeader>
    <Separator className="h-0.5" />
    <WidgetContent>
      <div className="grid size-full grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={`weekday-${i}-${day}`} className="text-xs">
            {day}
          </div>
        ))}

        {fillerDays.map((_, i) => (
          <div key={`filler-${i}`} className="text-xs">
            &nbsp;
          </div>
        ))}

        {days.map((day) => (
          <div key={day} className="text-muted-foreground text-xs">
            {day === date ? (
              <Badge
                className="flex size-4 items-center justify-center"
                radius="xs"
              >
                {day}
              </Badge>
            ) : (
              day
            )}
          </div>
        ))}
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
