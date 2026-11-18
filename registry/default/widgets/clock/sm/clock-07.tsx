import { MoonIcon, SunIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget>
    <WidgetContent className="flex-col justify-between gap-3">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <Text>Mumbai</Text>
          <SunIcon className="size-5" />
        </div>
        <WidgetTitle className="text-xl">8:15 AM</WidgetTitle>
      </div>
      <Separator />
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <Text>Vancouver</Text>
          <MoonIcon className="size-5" />
        </div>
        <WidgetTitle className="text-xl">6:45 PM</WidgetTitle>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
