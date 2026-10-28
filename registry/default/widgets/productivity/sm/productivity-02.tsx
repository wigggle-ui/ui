import { cn } from "cn";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

interface StatusOption {
  value: string;
  color: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { color: "bg-productive", value: "1" },
  { color: "bg-blue-500", value: "2" },
  { color: "bg-yellow-500", value: "3" },
  { color: "bg-destructive", value: "4" },
];

const WidgetDemo = () => {
  const id = React.useId();

  return (
    <Widget design="mumbai" className="gap-3">
      <WidgetHeader className="justify-center">
        <WidgetTitle>Add Task</WidgetTitle>
      </WidgetHeader>
      <WidgetContent className="w-full flex-col items-start justify-start gap-2">
        <Textarea
          className="h-full max-h-20"
          placeholder="Put Claude to rest!"
        />
      </WidgetContent>
      <WidgetFooter className="flex w-full justify-between">
        <Select defaultValue="1">
          <SelectTrigger
            id={id}
            className="w-16 [&>span]:flex [&>span]:items-center [&>span_svg]:shrink-0"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="max-w-16 min-w-0">
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                <span className="flex items-center gap-2">
                  <div className={cn("size-3 rounded-full", s.color)} />
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-max" size="sm">
          Add Task
        </Button>
      </WidgetFooter>
    </Widget>
  );
};

export default WidgetDemo;
