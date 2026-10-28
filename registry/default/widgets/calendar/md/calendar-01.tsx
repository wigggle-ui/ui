import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const now = new Date();

const dayName = now.toLocaleDateString("en-US", { weekday: "short" });
const monthName = now.toLocaleDateString("en-US", { month: "short" });
const date = now.getDate();
const paddedDate = date.toString().padStart(2, "0");

const year = now.getFullYear();
const month = now.getMonth();

const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = new Date(year, month, 1).getDay();

const calendarDays: (number | null)[] = [
  ...Array.from({ length: firstDayOfMonth }, () => null),
  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
];

const WidgetDemo = () => (
  <Widget size="md">
    <WidgetContent className="items-center justify-between gap-4">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full items-center justify-center gap-2">
          <Label variant="destructive" size="xxl">
            {dayName}
          </Label>
          <Label size="xxl">{monthName}</Label>
        </div>
        <div className="text-8xl">{paddedDate}</div>
      </div>

      <div className="grid size-full grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-xs">
            {d}
          </div>
        ))}

        {calendarDays.map((d, i) => (
          <div key={i} className="text-muted-foreground text-xs">
            {d === date ? (
              <Badge
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
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
