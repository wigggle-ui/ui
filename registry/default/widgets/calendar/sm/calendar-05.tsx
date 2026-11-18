import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetHeader,
  WidgetContent,
} from "@/registry/default/ui/widget";

const now = new Date();

const day = now.toLocaleDateString("en-US", { weekday: "long" });
const date = now.getDate().toString().padStart(2, "0");

const events = [
  { time: "9 AM", title: "Scrum" },
  { time: "11 AM", title: "Design Roundup" },
];

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader className="text-destructive text-base">{day}</WidgetHeader>
    <WidgetContent className="flex-col items-start justify-start gap-2">
      <Text size="xxxxl">{date}</Text>
      {events.map((event, i) => (
        <div
          key={i}
          className="flex w-full items-center justify-between border-t-2 pt-1.5"
        >
          <Text size="sm">{event.title}</Text>
          <Text size="sm" variant="muted-foreground">
            {event.time}
          </Text>
        </div>
      ))}
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
