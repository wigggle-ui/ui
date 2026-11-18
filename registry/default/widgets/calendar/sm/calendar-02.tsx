import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const now = new Date();

const day = now.toLocaleDateString("en-US", { weekday: "long" });
const month = now.toLocaleDateString("en-US", { month: "long" });
const date = now.getDate();

const WidgetDemo = () => (
  <Widget>
    <WidgetContent className="flex flex-col gap-2">
      <Text variant="muted-foreground">{day}</Text>
      <Text weight="bold" size="xxxxl">
        {date}
      </Text>
      <Text variant="muted-foreground">{month}</Text>
      <Badge variant="outline">{now.getFullYear()}</Badge>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
