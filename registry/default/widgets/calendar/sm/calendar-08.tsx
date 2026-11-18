import { Text } from "@/components/ui/text";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const now = new Date();

const day = now.toLocaleDateString("en-US", { weekday: "long" });
const date = now.getDate().toString().padStart(2, "0");

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetContent className="flex-col items-center justify-between gap-4">
      <div className="w-full space-y-1">
        <Text>{day}</Text>
        <Text size="xxxxl">{date}</Text>
      </div>
      <div className="w-full space-y-2">
        <Text variant="muted-foreground">Up Next</Text>
        <div className="border-destructive space-y-0.5 border-l-2 ps-2">
          <Text size="sm">Cypress Hike</Text>
          <Text size="sm" variant="muted-foreground">
            7:30 AM
          </Text>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
