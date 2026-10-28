import { CodeIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { RegistryItem } from "shadcn/schema";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const WidgetInfo = ({
  widget,
  preview,
  code,
}: {
  widget: RegistryItem;
  preview: ReactNode;
  code: string;
}) => (
  <Sheet>
    <SheetTrigger
      className="invisible absolute top-2 right-2 z-10 group-hover:visible"
      asChild
    >
      <Button variant="ghost" size="icon-sm">
        <CodeIcon className="text-muted-foreground h-4 w-4" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="h-full min-w-[50vw] overflow-auto">
      <SheetHeader>
        <SheetTitle>{widget.name}</SheetTitle>
        <hr />
        <h2>Credits: shadcn/ui</h2>
        <hr />
        <h2>Preview</h2>
        <div className="mt-1 w-full space-y-3">
          <div className="flex w-full items-center justify-start gap-3">
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
          </div>
          <div className="border-border flex h-60 w-full items-center justify-center rounded-3xl border-2">
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

export default WidgetInfo;
