"use client";

import CopyButton from "@/components/copy-button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetContent className="mx-auto flex-col items-start gap-3">
      <div className="flex w-full flex-col items-center justify-center">
        <Label size="lg">Your code for</Label>
        <Label size="xxxxl">20%</Label>
        <Label size="lg">discount</Label>
      </div>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <CopyButton
            variant="dashed"
            size="default"
            text="Wigggly20"
            onCopyError={() => {
              console.log("Copy failed");
            }}
          >
            <span className="uppercase">Wigggly20</span>
          </CopyButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to Copy</p>
        </TooltipContent>
      </Tooltip>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
