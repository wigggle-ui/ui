import { AlarmClockIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const alarms = ["7:00 AM", "12:30 PM", "5:30 PM", "10:00 PM"];

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader>
      <WidgetTitle>Alarms</WidgetTitle>
      <AlarmClockIcon className="size-5" />
    </WidgetHeader>
    <WidgetContent className="mt-3 flex-col gap-3">
      {alarms.map((alarm) => (
        <div
          key={alarm}
          className="flex w-full items-center justify-between space-x-2"
        >
          <Label htmlFor={alarm} weight="semibold">
            {alarm}
          </Label>
          <Switch id={alarm} />
        </div>
      ))}
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
