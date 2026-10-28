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
      <WidgetTitle className="flex w-full flex-col items-start justify-start">
        <Label weight="medium" size="xxl">
          AAPL
        </Label>
        <Label variant="muted-foreground" size="lg">
          Apple Inc
        </Label>
      </WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="justify-between" />
    <WidgetFooter className="flex-col items-end">
      <Label variant="destructive" size="xxxxl">
        262.24
      </Label>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
