import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetContent>
      <div className="grid size-full grid-cols-2 items-center gap-x-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <Text size="sm">Mumbai</Text>
          <WidgetTitle>8:15 AM</WidgetTitle>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Text size="sm">London</Text>
          <WidgetTitle>6:45 PM</WidgetTitle>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Text size="sm">Tokyo</Text>
          <WidgetTitle>8:15 AM</WidgetTitle>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Text size="sm">Seoul</Text>
          <WidgetTitle>6:45 PM</WidgetTitle>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
