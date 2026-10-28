import { TriangleIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetHeader,
  WidgetTitle,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader>
      <WidgetTitle className="flex w-full items-center justify-between">
        <Label size="xxxxl">732.17</Label>
        <TriangleIcon className="fill-productive size-6 stroke-none" />
      </WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="justify-between">
      <Label variant="productive">+2.76</Label>
      <Label variant="productive">+0.47%</Label>
    </WidgetContent>
    <WidgetFooter className="flex-col items-start">
      <Label size="xxl" weight="medium">
        META
      </Label>
      <Label variant="muted-foreground">Meta Platforms Inc</Label>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
