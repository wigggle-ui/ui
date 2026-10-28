import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const now = new Date();

const day = now.toLocaleDateString("en-US", { weekday: "long" });
const month = now.toLocaleDateString("en-US", { month: "long" });
const date = now.getDate();

const WidgetDemo = () => (
  <Widget>
    <WidgetContent className="flex flex-col gap-2">
      <Label variant="muted-foreground">{day}</Label>
      <Label weight="bold" size="xxxxl">
        {date}
      </Label>
      <Label variant="muted-foreground">{month}</Label>
      <Badge variant="outline">{now.getFullYear()}</Badge>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
