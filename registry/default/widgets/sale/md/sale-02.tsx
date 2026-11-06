"use client";

import CopyButton from "@/components/copy-button";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget size="md" design="damn">
    <WidgetContent className="grid grid-cols-5 items-center">
      <div className="col-span-2 flex size-full items-center justify-center">
        <Icons.ClaudeAI className="fill-claude-ai text-background size-28" />
      </div>
      <div className="col-span-3 flex h-full w-full flex-col items-start justify-between py-3 pe-3">
        <div className="space-y-0">
          <Label size="lg" weight="semibold">
            35% MORE TOKENS!
          </Label>
          <Label size="sm" variant="muted-foreground">
            Avaialble on all plans.
          </Label>
        </div>
        <div className="border-muted-foreground w-full rounded-lg border border-dashed px-3 py-2 text-center">
          <span className="w-full text-center text-lg font-semibold tracking-widest">
            GET35OFF
          </span>
        </div>
        <div className="w-full">
          <CopyButton
            className="w-full"
            variant="secondary"
            size="default"
            text="GET35OFF"
            onCopyError={() => {
              console.log("Copy failed");
            }}
          >
            <span className="text-xs uppercase">Get Coupon</span>
          </CopyButton>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
