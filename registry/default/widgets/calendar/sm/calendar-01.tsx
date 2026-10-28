import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const now = new Date();

const day = now.toLocaleDateString("en-US", { weekday: "short" });
const month = now.toLocaleDateString("en-US", { month: "short" });
const date = now.getDate().toString().padStart(2, "0");

const WidgetDemo = () => (
  <Widget>
    <WidgetContent className="mx-auto flex-col items-start">
      <div className="flex w-full items-center justify-center gap-2">
        <Label size="xxl" variant="destructive">
          {day}
        </Label>
        <Label size="xxl">{month}</Label>
      </div>
      <div className="text-8xl">{date}</div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
