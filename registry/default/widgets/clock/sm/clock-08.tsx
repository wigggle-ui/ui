import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget>
    <WidgetContent className="flex-col justify-between">
      <div className="flex w-full items-center justify-between gap-2">
        <Text size="sm">Mumbai</Text>
        <WidgetTitle>8:15 AM</WidgetTitle>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <Text size="sm">London</Text>
        <WidgetTitle>6:45 PM</WidgetTitle>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <Text size="sm">Tokyo</Text>
        <WidgetTitle>8:15 AM</WidgetTitle>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <Text size="sm">Seoul</Text>
        <WidgetTitle>6:45 PM</WidgetTitle>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
