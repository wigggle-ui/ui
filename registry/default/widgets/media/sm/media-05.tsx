import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleIcon,
} from "lucide-react";

import { Widget, WidgetContent } from "@/registry/default/ui/widget";
import { Button } from "@/registry/default/ui/button";

export default function WidgetDemo() {
  return (
    <Widget className="justify-between">
      <WidgetContent className="inline-grid w-full grid-cols-3 gap-1">
        <Button
          aria-label="Pan camera up"
          className="col-start-2 mx-auto"
          size="icon"
          variant="outline"
        >
          <ChevronUpIcon aria-hidden="true" size={16} />
        </Button>
        <Button
          aria-label="Pan camera left"
          className="col-start-1 mx-auto"
          size="icon"
          variant="outline"
        >
          <ChevronLeftIcon aria-hidden="true" size={16} />
        </Button>
        <div aria-hidden="true" className="flex items-center justify-center">
          <CircleIcon className="opacity-60" size={20} />
        </div>
        <Button
          aria-label="Pan camera right"
          size="icon"
          variant="outline"
          className="mx-auto"
        >
          <ChevronRightIcon aria-hidden="true" size={16} />
        </Button>
        <Button
          aria-label="Pan camera down"
          className="col-start-2 mx-auto"
          size="icon"
          variant="outline"
        >
          <ChevronDownIcon aria-hidden="true" size={16} />
        </Button>
      </WidgetContent>
    </Widget>
  );
}
