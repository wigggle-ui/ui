"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import CopyButton from "@/components/copy-button";
import ScratchCard from "@/components/spectrumui/scratch-card";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const WidgetDemo = () => {
  const resetCopyStateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(
    () => () => {
      if (resetCopyStateTimeoutRef.current !== null) {
        clearTimeout(resetCopyStateTimeoutRef.current);
      }
    },
    []
  );

  return (
    <Widget size="md" design="damn">
      <WidgetContent className="grid grid-cols-5 items-center">
        <div className="col-span-2 flex size-full items-center justify-center rounded-l-3xl bg-white">
          <Image
            className="bg-transparent"
            width={300}
            height={300}
            src="/assets/other/black-friday-sale.png"
            alt="Black Friday Sale"
          />
        </div>
        <div className="col-span-3 flex h-full w-full flex-col items-center justify-center gap-3 px-3">
          <Label className="text-center">
            Scratch to reveal your coupon code.
          </Label>
          <ScratchCard
            className="h-14 w-full"
            overlayLabel="Scratch"
            ariaLabel="Scratch to reveal your coupon code. Press Enter to reveal."
            revealAnnouncement="Coupon revealed: BFS123"
          >
            <div className="flex h-full w-full flex-col items-center text-center">
              <span className="mt-2 text-3xl font-semibold tracking-tight">
                20% off
              </span>
            </div>
          </ScratchCard>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <CopyButton
                className="w-full"
                variant="dashed"
                size="default"
                text="BFS123"
                onCopyError={() => {
                  console.log("Copy failed");
                }}
              >
                <span className="uppercase">BFS123</span>
              </CopyButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to Copy</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
