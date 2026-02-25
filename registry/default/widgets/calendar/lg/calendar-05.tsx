"use client";

import React from "react";
import {
  CheckIcon,
  Clock3Icon,
  MapPinIcon,
  NotebookPenIcon,
  SquarePenIcon,
} from "lucide-react";

import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";
import { Button } from "@/registry/default/ui/button";
import { Textarea } from "@/registry/default/ui/textarea";

const docNotes =
  "Have a light meal before your appointment and continue your regular medications unless advised otherwise.";

export default function WidgetDemo() {
  const now = new Date();

  const monthName = now.toLocaleDateString("en-US", { month: "long" });
  const date = now.getDate();

  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  return (
    <Widget size="lg" className="gap-4">
      <WidgetHeader className="items-center justify-between gap-4">
        <div className="flex space-x-4">
          <WidgetTitle className="text-destructive text-2xl">
            {date} {monthName}
          </WidgetTitle>
        </div>
        <Button
          variant={isEditing ? "productive" : "outline"}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <CheckIcon /> Save Event
            </>
          ) : (
            <>
              <SquarePenIcon /> Edit Event
            </>
          )}
        </Button>
      </WidgetHeader>
      <WidgetContent className="flex-col items-start justify-start gap-4">
        <Label className="text-xl">Henil's Dental Appointment</Label>
        <div className="flex w-full items-center justify-start gap-3">
          <Clock3Icon className="stroke-muted-foreground size-6" />
          <Label className="text-base">8:45 AM</Label>
        </div>
        <div className="flex w-full items-center justify-start gap-3">
          <MapPinIcon className="stroke-muted-foreground size-6" />
          <Label className="text-base">Apple Park, Cupertino</Label>
        </div>
        <div className="flex size-full flex-1 items-start justify-start gap-3">
          <NotebookPenIcon className="stroke-muted-foreground size-6 min-w-6" />
          {isEditing ? (
            <Textarea
              className="size-full flex-1"
              placeholder="Type your message here."
              autoFocus={isEditing}
              defaultValue={docNotes}
            />
          ) : (
            <Label className="bg-secondary border-muted-foreground/50 size-full items-start rounded-md border px-2 py-2 text-sm text-wrap">
              {docNotes}
            </Label>
          )}
        </div>
      </WidgetContent>
    </Widget>
  );
}
