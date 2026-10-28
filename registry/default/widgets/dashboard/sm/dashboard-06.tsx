import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget className="gap-3" design="mumbai">
    <WidgetContent className="w-full flex-col items-start justify-start gap-2">
      <Textarea
        className="h-full max-h-28"
        placeholder="Type your message here."
      />
    </WidgetContent>
    <WidgetFooter>
      <Button className="w-full" size="sm">
        Send Feedback
      </Button>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
