"use client";

import { CheckIcon, CopyIcon, TicketIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import ScratchCard from "@/components/spectrumui/scratch-card";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const ScratchCardDemo = () => {
  const [isCopied, setIsCopied] = useState(false);
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("WIGGGLE20");
      setIsCopied(true);

      if (resetCopyStateTimeoutRef.current !== null) {
        clearTimeout(resetCopyStateTimeoutRef.current);
      }
      resetCopyStateTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        resetCopyStateTimeoutRef.current = null;
      }, 2000);
    } catch {
      setIsCopied(false);
      if (resetCopyStateTimeoutRef.current !== null) {
        clearTimeout(resetCopyStateTimeoutRef.current);
        resetCopyStateTimeoutRef.current = null;
      }
      toast.error("Unable to copy coupon code.");
    }
  };

  return (
    <Widget design="damn">
      <WidgetContent>
        <ScratchCard
          className="size-full"
          ariaLabel="Scratch to reveal your coupon code. Press Enter to reveal."
          revealAnnouncement="Coupon revealed: WIGGGLE20 for 20% off"
        >
          <div className="flex w-full flex-col items-center gap-2 px-6 py-3 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full">
              <TicketIcon
                className="size-8"
                aria-hidden="true"
                strokeWidth={1.5}
              />
            </span>
            <span className="text-ring dark:text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Coupon unlocked
            </span>
            <span className="text-3xl font-semibold tracking-tight">
              20% off
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="border-border text-muted-foreground hover:bg-muted focus-visible:ring-ring dark:border-muted-foreground/50 dark:text-muted-foreground dark:hover:bg-secondary dark:focus-visible:ring-primary mt-1 flex items-center gap-2 rounded-xl border border-dashed px-4 py-2 font-mono text-sm transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
            >
              WIGGGLE20
              {isCopied ? (
                <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span className="sr-only">
                {isCopied ? "Copied to clipboard" : "Copy coupon code"}
              </span>
            </button>
          </div>
        </ScratchCard>
      </WidgetContent>
    </Widget>
  );
};

export default ScratchCardDemo;
