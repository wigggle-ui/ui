"use client";

import { BadgePercentIcon } from "lucide-react";

import CopyButton from "@/components/copy-button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget design="damn">
    <WidgetHeader className="from-vercel-purple to-vercel-yellow flex h-20 items-center justify-center rounded-t-3xl bg-linear-to-b px-6">
      <WidgetTitle>
        <BadgePercentIcon className="size-10" strokeWidth="1.5" />
      </WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="mx-auto flex-col items-center justify-center gap-1.5">
      <div className="flex w-full flex-col items-center justify-center px-3 text-center text-wrap">
        <Label size="md">Your code for 20% discount</Label>
      </div>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <CopyButton
            variant="dashed"
            size="sm"
            text="Wigggly20"
            onCopyError={() => {
              console.log("Copy failed");
            }}
          >
            <span className="text-xs uppercase">Wigggly20</span>
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
