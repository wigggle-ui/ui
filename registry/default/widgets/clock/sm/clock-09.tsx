import { Label } from "@/components/ui/label";
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
          <Label size="sm">Mumbai</Label>
          <WidgetTitle>8:15 AM</WidgetTitle>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Label size="sm">London</Label>
          <WidgetTitle>6:45 PM</WidgetTitle>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Label size="sm">Tokyo</Label>
          <WidgetTitle>8:15 AM</WidgetTitle>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Label size="sm">Seoul</Label>
          <WidgetTitle>6:45 PM</WidgetTitle>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
