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
import { Text } from "@/components/ui/text";
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
        <Text size="xl">Henil&apos;s Dental Appointment</Text>
        <div className="flex w-full items-center justify-start gap-3">
          <Clock3Icon className="stroke-muted-foreground size-6" />
          <Text>8:45 AM</Text>
        </div>
        <div className="flex w-full items-center justify-start gap-3">
          <MapPinIcon className="stroke-muted-foreground size-6" />
          <Text>Apple Park, Cupertino</Text>
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
              <Text className="items-start">{docNotes}</Text>
            </div>
          )}
        </div>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
