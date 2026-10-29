import { CodeIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { RegistryItem } from "shadcn/schema";

import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import convertNpmCommand from "@/lib/convert-npm-command";

import CodeBlock from "./code-block";
import { CodeBlockCommand } from "./code-block-command";

interface WidgetCredit {
  name: string;
  homepage?: string;
  url?: string;
}

const isWidgetCredit = (credit: unknown): credit is WidgetCredit => {
  if (
    typeof credit !== "object" ||
    credit === null ||
    !("name" in credit) ||
    typeof credit.name !== "string"
  ) {
    return false;
  }

  return (
    (!("homepage" in credit) || typeof credit.homepage === "string") &&
    (!("url" in credit) || typeof credit.url === "string")
  );
};

const getWidgetCredits = (widget: RegistryItem): WidgetCredit[] => {
  const credits: unknown = widget.meta?.credits;

  return Array.isArray(credits) ? credits.filter(isWidgetCredit) : [];
};

const WidgetInfo = ({
  widget,
  preview,
  code,
}: {
  widget: RegistryItem;
  preview: ReactNode;
  code: string;
}) => {
  const credits = getWidgetCredits(widget);

  return (
    <Sheet>
      <SheetTrigger
        className="absolute top-2 right-2 z-10 group-hover:visible md:invisible"
        asChild
      >
        <Button variant="ghost" size="icon-sm">
          <CodeIcon className="text-muted-foreground h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="h-full min-w-full overflow-auto md:min-w-[50vw]"
      >
        <SheetHeader>
          <SheetTitle>{widget.name}</SheetTitle>
          <hr />
          {credits.length > 0 && (
            <>
              <div className="flex gap-1">
                <h2>Credits: </h2>
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {credits.map((credit) => (
                    <Link
                      key={credit.name}
                      href={credit.url || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      {credit.name}
                    </Link>
                  ))}
                </ul>
              </div>
              <hr />
            </>
          )}
          <h2>Preview</h2>
          <div className="mt-1 w-full space-y-3">
            {/* <div className="flex w-full items-center justify-start gap-3">
            {["Size", "Variant", "Typeface", "Icons"].map((el, i) => (
              <Select key={i}>
                <SelectTrigger className="w-full max-w-28">
                  <SelectValue placeholder={el} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{el}</SelectLabel>
                    <SelectItem value="sm">sm</SelectItem>
                    <SelectItem value="md">md</SelectItem>
                    <SelectItem value="lg">lg</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            ))}
          </div> */}
            <div className="md:border-border flex min-h-60 w-full min-w-0 items-center justify-center overflow-auto rounded-3xl sm:justify-center md:border-2 md:p-6">
              {preview}
            </div>
            <h2>Installation</h2>
            <div className="w-full">
              <CodeBlockCommand
                {...convertNpmCommand(
                  `npx shadcn@latest add @wigggle-ui/${widget.name}`
                )}
              />
            </div>
            <h2>Code</h2>
            <div className="w-full">
              <CodeBlock
                code={code}
                lang="tsx"
                preHighlighted={null}
                isFile={`components/${widget.name}`}
              />
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default WidgetInfo;
