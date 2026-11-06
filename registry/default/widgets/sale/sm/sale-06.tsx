import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader className="flex items-center justify-center">
      <WidgetTitle>Wait before you go!</WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="flex-col gap-2">
      <Label size="sm" weight="semibold">
        15% OFF on next order
      </Label>
      <Field>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Your Email"
          required
        />
      </Field>
    </WidgetContent>
    <WidgetFooter>
      <Button variant="productive" className="w-full" size="sm">
        Claim 15%
      </Button>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
