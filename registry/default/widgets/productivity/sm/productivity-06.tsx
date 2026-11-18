import { DumbbellIcon, SunIcon } from "lucide-react";

import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget className="gap-3">
    <WidgetHeader className="justify-center">
      <WidgetTitle>Streaks</WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="flex-col items-center justify-center gap-2">
      <div className="flex w-full items-center justify-start rounded-lg border p-1">
        <div className="flex items-center justify-center gap-2 px-1">
          <SunIcon className="stroke-vercel-yellow size-6" />
          <div className="flex flex-col items-start justify-start gap-0">
            <Text size="sm">Wake up early</Text>
            <Text size="sm" variant="muted-foreground">
              13 days
            </Text>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-start rounded-lg border p-1">
        <div className="flex items-center justify-center gap-2 px-1">
          <DumbbellIcon className="stroke-destructive size-6" />
          <div className="flex flex-col items-start justify-start gap-0">
            <Text size="sm">Workout</Text>
            <Text size="sm" variant="muted-foreground">
              6 days
            </Text>
          </div>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
