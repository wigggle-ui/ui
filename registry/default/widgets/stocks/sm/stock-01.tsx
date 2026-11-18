import { TriangleIcon } from "lucide-react";

import { Text } from "@/components/ui/text";
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
        <Text size="xxxxl">732.17</Text>
        <TriangleIcon className="fill-productive size-6 stroke-none" />
      </WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="justify-between">
      <Text variant="productive">+2.76</Text>
      <Text variant="productive">+0.47%</Text>
    </WidgetContent>
    <WidgetFooter className="flex-col items-start">
      <Text size="xxl" weight="medium">
        META
      </Text>
      <Text variant="muted-foreground">Meta Platforms Inc</Text>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
