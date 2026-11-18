"use client";

import { cn } from "cn";
import { BookOpenIcon, CheckIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";

const streak = 8;

const WidgetDemo = () => {
  const [status, setStatus] = React.useState<boolean>(false);

  return (
    <Widget className="gap-3">
      <WidgetContent className="flex-col items-end justify-start gap-4">
        <div className="flex w-full flex-col">
          <Text size="xl">Read 10 Mins</Text>
          <Text size="sm" variant="muted-foreground">
            Streak: {status ? streak + 1 : streak} days
          </Text>
        </div>
      </WidgetContent>
      <WidgetFooter className="flex w-full items-center justify-between">
        <BookOpenIcon
          className={cn(
            "size-14",
            status ? "stroke-productive" : "stroke-destructive"
          )}
          strokeWidth={1.5}
        />
        <Button
          disabled={status}
          onClick={() => setStatus(true)}
          className="hover:cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed"
          variant="outline"
          size="icon-sm"
        >
          <CheckIcon />
        </Button>
      </WidgetFooter>
    </Widget>
  );
};

export default WidgetDemo;
