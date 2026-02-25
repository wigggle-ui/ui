import { Widget, WidgetContent } from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";

export default function WidgetDemo() {
  const now = new Date();

  const day = now.toLocaleDateString("en-US", { weekday: "short" });
  const month = now.toLocaleDateString("en-US", { month: "short" });
  const date = now.getDate().toString().padStart(2, "0");

  return (
    <Widget>
      <WidgetContent className="mx-auto flex-col items-start">
        <div className="flex w-full items-center justify-center gap-2">
          <Label className="text-destructive text-2xl">{day}</Label>
          <Label className="text-2xl">{month}</Label>
        </div>
        <Label className="text-8xl">{date}</Label>
      </WidgetContent>
    </Widget>
  );
}
