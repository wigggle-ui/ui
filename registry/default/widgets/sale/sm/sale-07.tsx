import { GiftIcon, VanIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetContent className="flex-col justify-between gap-2">
      <div className="flex items-center justify-center gap-3">
        <div className="bg-productive/20 flex size-10 items-center justify-center rounded-full">
          <VanIcon className="text-productive size-7" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-start justify-start">
          <Text weight="semibold">Free Shipping</Text>
          <Text size="xs" variant="muted-foreground">
            On orders over $50
          </Text>
        </div>
      </div>
      <div className="w-full space-y-1.5">
        <Progress value={64} className="h-1.5" />
        <div className="flex w-full items-center justify-between">
          <Text size="sm">$32 / 50</Text>
          <Text size="sm" variant="productive">
            $18 more
          </Text>
        </div>
      </div>
      <Button variant="outline" size="sm">
        <GiftIcon /> Browse Products
      </Button>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
