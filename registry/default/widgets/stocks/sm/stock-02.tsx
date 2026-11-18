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
      <WidgetTitle className="flex w-full flex-col items-start justify-start">
        <Text weight="medium" size="xxl">
          AAPL
        </Text>
        <Text variant="muted-foreground" size="lg">
          Apple Inc
        </Text>
      </WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="justify-between" />
    <WidgetFooter className="flex-col items-end">
      <Text variant="destructive" size="xxxxl">
        262.24
      </Text>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
