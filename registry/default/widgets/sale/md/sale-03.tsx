import { DitheredLogo } from "@/components/dithercn/dithered-logo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget
    size="md"
    className="from-muted-foreground/10 to-foreground/15 dark:to-muted-foreground/5 dark:from-foreground/10 border-0 bg-linear-to-r"
  >
    <WidgetContent className="grid grid-cols-2 items-center">
      <div className="flex size-full flex-col items-start justify-between">
        <Label size="xl" weight="semibold">
          Black Friday Sale
        </Label>
        <Label size="sm" weight="medium" variant="muted-foreground">
          Get 40% off on new domains.
        </Label>
        <Button>Deploy Now</Button>
      </div>
      <DitheredLogo
        src="/assets/logos/vercel.svg"
        alt="Acme"
        effect="scan"
        className="h-full"
      />
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
