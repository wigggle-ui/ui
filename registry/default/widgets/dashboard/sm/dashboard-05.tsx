import {
  GitBranchIcon,
  GitCommitHorizontalIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget className="gap-2.5" design="mumbai">
    <WidgetHeader className="items-center">
      <div className="flex items-center justify-start gap-2">
        <Avatar className="size-6">
          <AvatarImage
            src="https://github.com/wigggle-ui.png"
            alt="@wigggle-ui"
          />
          <AvatarFallback>WUI</AvatarFallback>
        </Avatar>
        <WidgetTitle className="text-sm font-medium">wigggle-ui</WidgetTitle>
      </div>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="bg-productive size-2.5 animate-pulse rounded-full" />
        </TooltipTrigger>
        <TooltipContent>Running</TooltipContent>
      </Tooltip>
    </WidgetHeader>
    <WidgetContent className="w-full flex-col items-start justify-start gap-2">
      <div className="flex w-max items-center justify-center gap-2">
        <GitCommitHorizontalIcon className="stroke-muted-foreground size-5" />
        <Label size="sm">chore: nextjs v16</Label>
      </div>
      <div className="flex w-max items-center justify-center gap-2">
        <GitBranchIcon className="stroke-muted-foreground size-5" />
        <Label className="-mt-1.5" size="sm">
          prod
        </Label>
      </div>
      <div className="flex w-max items-center justify-center gap-2">
        <ShieldCheckIcon className="stroke-productive size-5" />
        <Label size="sm">Firewall Active</Label>
      </div>
    </WidgetContent>
    <WidgetFooter>
      <Button className="w-full" variant="outline" size="sm" asChild>
        <Link href="https://github.com/wigggle-ui/ui">Visit</Link>
      </Button>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
