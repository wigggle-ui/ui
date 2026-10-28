import Image from "next/image";

import { Badge } from "@/components/ui/badge";
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
    <WidgetHeader>
      <WidgetTitle className="text-muted-foreground flex items-center gap-1 text-sm font-normal">
        <div className="bg-productive size-2 rounded-full" />
        Live
      </WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="me-auto flex flex-col items-center gap-2">
        <Image
          className="size-9"
          src="/assets/logos/bvb.png"
          alt="FC Barcelona"
          width={40}
          height={40}
        />
        <Label size="xxxl">4</Label>
      </div>
      <Badge variant="secondary">
        <div className="animate-pulse text-sm">34&apos;</div>
      </Badge>
      <div className="ms-auto flex flex-col items-center gap-2">
        <Image
          className="size-9"
          src="/assets/logos/mci.png"
          alt="FC Barcelona"
          width={40}
          height={40}
        />
        <Label size="xxxl">4</Label>
      </div>
    </WidgetContent>
    <WidgetFooter className="justify-center">
      <Label variant="muted-foreground">UCL Final</Label>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
