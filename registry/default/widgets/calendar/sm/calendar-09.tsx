import { Widget, WidgetContent } from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";

export default function WidgetDemo() {
  const now = new Date();

  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.getDate().toString().padStart(2, "0");

  return (
    <Widget design="mumbai">
      <WidgetContent className="flex-col items-center justify-between gap-4">
        <div className="w-full space-y-1">
          <Label className="font-normal">{day}</Label>
          <Label className="text-5xl font-normal">{date}</Label>
        </div>
        <div className="w-full space-y-2">
          <Label className="text-muted-foreground text-base font-normal uppercase">
            Up Next
          </Label>
          <div className="border-destructive space-y-0.5 border-l-2 ps-2">
            <Label className="truncate text-sm font-normal">
              45 mins Yoga with Henil Shah
            </Label>
            <Label className="text-muted-foreground text-sm">7:30 AM</Label>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
}
