"use client";

import { JSX, useEffect, useState } from "react";
import { ArrowUpRight, CodeIcon } from "lucide-react";
import type { RegistryItem } from "shadcn/registry";

import { convertRegistryPaths } from "@/lib/utils";
import { WidgetCreditType } from "@/types";
import WidgetCli from "@/components/cli-commands";
import CodeBlock, { highlight } from "@/components/code-block";
import CopyButton from "@/components/copy-button";
import { Button } from "@/registry/default/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/default/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/registry/default/ui/item";

export default function WidgetDetails({ widget }: { widget: RegistryItem }) {
  const [code, setCode] = useState<string | null>(null);
  const [highlightedCode, setHighlightedCode] = useState<JSX.Element | null>(
    null,
  );

  useEffect(() => {
    const handleEmptyCode = () => {
      setCode("");
      setHighlightedCode(null);
    };

    const loadCode = async () => {
      try {
        const response = await fetch(`/r/${widget.name}.json`, {
          cache: "force-cache",
          next: { revalidate: 3600 },
        });
        if (!response.ok) {
          handleEmptyCode();
          return;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          handleEmptyCode();
          return;
        }

        const data = await response.json();
        const codeContent = convertRegistryPaths(data.files[0].content) || "";
        setCode(codeContent);

        // Pre-highlight the code
        const highlighted = await highlight(codeContent, "tsx");
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error("Failed to load code:", error);
        handleEmptyCode();
      }
    };

    loadCode();
  }, [widget.name]);

  return (
    <div className="absolute top-1 right-2 flex gap-1 peer-data-comp-loading:hidden lg:top-2">
      <Dialog>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-foreground transition-none disabled:opacity-100"
                  >
                    <CodeIcon size={16} aria-hidden={true} />
                  </Button>
                </DialogTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-muted-foreground px-2 py-1 text-xs">
              View code
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-3xl">
          <DialogTitle className="text-center text-2xl">
            {widget.name}
          </DialogTitle>
          {widget?.meta?.credits && (
            <DialogHeader>
              <p className="text-lg font-semibold tracking-tight">Credits</p>
              <DialogDescription className="sr-only">
                Special thanks to the authors of the components used here.
              </DialogDescription>
              <div className="flex flex-col gap-2">
                {widget.meta?.credits.map((el: WidgetCreditType) => (
                  <Item key={el.name} variant="outline">
                    <ItemMedia
                      variant="image"
                      dangerouslySetInnerHTML={{ __html: el.logo }}
                      className="*:[svg]:fill-foreground grayscale *:[svg]:size-8"
                    />
                    <ItemContent>
                      <ItemTitle className="text-base">{el.name}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={el.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View <ArrowUpRight />
                        </a>
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
              </div>
            </DialogHeader>
          )}
          <p className="text-lg font-semibold tracking-tight">Installation</p>
          <div className="min-w-0 space-y-4">
            <WidgetCli name={widget.name} />
            <div className="space-y-2">
              <p className="text-lg font-semibold tracking-tight">Code</p>
              <div className="relative">
                {code === "" ? (
                  <p className="text-muted-foreground text-sm">
                    No code available. If you think this is an error, please{" "}
                    <a
                      href="https://github.com/wigggle-ui/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
                    >
                      open an issue
                    </a>
                    .
                  </p>
                ) : (
                  <>
                    <CodeBlock
                      code={code}
                      lang="tsx"
                      preHighlighted={highlightedCode}
                    />
                    <CopyButton
                      widgetName={widget.name}
                      componentSource={code}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
