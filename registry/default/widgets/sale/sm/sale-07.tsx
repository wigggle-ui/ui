import { GiftIcon, VanIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetContent className="flex-col justify-between gap-2">
      <div className="flex items-center justify-center gap-3">
        <div className="bg-productive/20 flex size-10 items-center justify-center rounded-full">
          <VanIcon className="text-productive size-7" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-start justify-start">
          <Label weight="semibold">Free Shipping</Label>
          <Label size="xs" variant="muted-foreground">
            On orders over $50
          </Label>
        </div>
      </div>
      <div className="w-full space-y-1.5">
        <Progress value={64} className="h-1.5" />
        <div className="flex w-full items-center justify-between">
          <Label size="sm">$32 / 50</Label>
          <Label size="sm" variant="productive">
            $18 more
          </Label>
        </div>
      </div>
      <Button variant="outline" size="sm">
        <GiftIcon /> Browse Products
      </Button>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
