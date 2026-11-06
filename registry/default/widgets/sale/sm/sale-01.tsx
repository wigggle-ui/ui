import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget design="mumbai" className="gap-2">
    <WidgetHeader className="items-center justify-between">
      <div className="flex items-center justify-start gap-2">
        <Icons.Vercel className="size-5" aria-hidden="true" />
        <Label weight="medium" size="lg">
          Vercel
        </Label>
      </div>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="bg-productive size-2.5 animate-pulse rounded-full" />
        </TooltipTrigger>
        <TooltipContent>
          <p>All Systems Operational</p>
        </TooltipContent>
      </Tooltip>
    </WidgetHeader>
    <WidgetContent className="flex-col items-start justify-start gap-1.5">
      <Label size="sm">Deploy your shadcn/ui apps with just one click.</Label>
      <Label size="xs" variant="muted-foreground">
        Trusted by OpenAI, Sonos, Adobe, and more.
      </Label>
    </WidgetContent>
    <WidgetFooter>
      <Button size="sm" className="w-full" variant="outline">
        Deploy Now
      </Button>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
