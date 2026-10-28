import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const now = new Date();

const day = now.toLocaleDateString("en-US", { weekday: "long" });
const date = now.getDate().toString().padStart(2, "0");
const WidgetDemo = () => (
  <Widget className="p-0" design="mumbai">
    <WidgetContent className="flex-col items-center justify-between">
      <div className="bg-destructive w-full rounded-t-3xl">
        <div className="space-y-1 p-4">
          <Label>{day}</Label>
          <Label size="xxxxl">{date}</Label>
        </div>
      </div>
      <div className="w-full space-y-2 px-4 pb-4">
        <Label variant="muted-foreground">Up Next</Label>
        <div className="border-destructive space-y-0.5 border-l-2 ps-2">
          <Label size="sm">Cypress Hike</Label>
          <Label size="sm" variant="muted-foreground">
            7:30 AM
          </Label>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
