"use client";

import { useOpenPanel } from "@openpanel/nextjs";

import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

import { Icons } from "@/components/icons";

const CopyButton = ({
  widgetName,
  componentSource,
  className,
}: {
  widgetName: string;
  componentSource: string | null;
  className?: string;
}) => {
  const op = useOpenPanel();
  const { copied, copy } = useCopy();

  const handleCopyCode = () => {
    () => op.track(widgetName, { location: "copy_code" });
    copy(componentSource || "");
  };

  return (
    <div className={cn("dark absolute top-2 right-2", className)}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground transition-none hover:bg-transparent disabled:opacity-100"
              onClick={handleCopyCode}
              aria-label={copied ? "Copied" : "Copy component source"}
              disabled={copied}
            >
              <div
                className={cn(
                  "transition-all",
                  copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
                )}
              >
                <Icons.check />
              </div>
              <div
                className={cn(
                  "absolute transition-all",
                  copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                )}
              >
                <Icons.copy />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-muted-foreground px-2 py-1 text-xs">
            Copy
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CopyButton;
