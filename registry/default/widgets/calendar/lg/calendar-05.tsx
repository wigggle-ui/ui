"use client";

import {
  CheckIcon,
  Clock3Icon,
  MapPinIcon,
  NotebookPenIcon,
  SquarePenIcon,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const docNotes =
  "Have a light meal before your appointment and continue your regular medications unless advised otherwise.";

const now = new Date();

const monthName = now.toLocaleDateString("en-US", { month: "long" });
const date = now.getDate();
const WidgetDemo = () => {
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
        <Label size="xl">Henil&apos;s Dental Appointment</Label>
        <div className="flex w-full items-center justify-start gap-3">
          <Clock3Icon className="stroke-muted-foreground size-6" />
          <Label>8:45 AM</Label>
        </div>
        <div className="flex w-full items-center justify-start gap-3">
          <MapPinIcon className="stroke-muted-foreground size-6" />
          <Label>Apple Park, Cupertino</Label>
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
            <div className="w-full text-wrap">
              <Label className="items-start">{docNotes}</Label>
            </div>
          )}
        </div>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
