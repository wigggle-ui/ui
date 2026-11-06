"use client";

import { Countdown } from "@/components/arc/countdown/countdown";
import CopyButton from "@/components/copy-button";
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

const now = new Date();

const WidgetDemo = () => (
  <Widget>
    <WidgetHeader>
      <WidgetTitle>Flash Deal - 40% Off</WidgetTitle>
    </WidgetHeader>
    <WidgetContent>
      <Countdown
        target={new Date(
          now.getTime() + 2 * 60 * 60 * 1000 - 1000
        ).toISOString()}
        timeZone="America/Los_Angeles"
        label="Keynote starts in"
        units={["hours", "minutes", "seconds"]}
      />
    </WidgetContent>
    <WidgetFooter>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <CopyButton
            className="w-full"
            iconPosition="end"
            variant="secondary"
            size="lg"
            text="Summer40"
            onCopyError={() => {
              console.log("Copy failed");
            }}
          >
            <span className="text-xs tracking-widest uppercase">Summer40</span>
          </CopyButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to Copy</p>
        </TooltipContent>
      </Tooltip>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
