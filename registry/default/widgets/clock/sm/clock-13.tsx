import { CheckIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { WheelPickerOption } from "@/components/wheel-picker";
import { WheelPicker, WheelPickerWrapper } from "@/components/wheel-picker";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";

const createArray = (length: number, add = 0): WheelPickerOption[] =>
  Array.from({ length }, (_, i) => {
    const value = i + add;
    return {
      label: value.toString().padStart(2, "0"),
      value: value.toString(),
    };
  });

const hourOptions = createArray(12, 1);
const minuteOptions = createArray(60);
const meridiemOptions: WheelPickerOption[] = [
  { label: "AM", value: "AM" },
  { label: "PM", value: "PM" },
];

const WidgetDemo = () => (
  <Widget className="gap-3" design="mumbai">
    <WidgetContent>
      <WheelPickerWrapper className="rounded-lg border-2">
        <WheelPicker
          visibleCount={12}
          options={hourOptions}
          defaultValue="9"
          infinite
        />
        <WheelPicker
          visibleCount={12}
          options={minuteOptions}
          defaultValue="41"
          infinite
        />
        <WheelPicker
          visibleCount={12}
          options={meridiemOptions}
          defaultValue="AM"
        />
      </WheelPickerWrapper>
    </WidgetContent>
    <WidgetFooter>
      <Button
        size="icon-sm-circle"
        variant="outline"
        aria-label="Reset stopwatch"
      >
        <XIcon className="stroke-destructive size-4 stroke-3" />
      </Button>
      <Button
        size="icon-sm-circle"
        variant="outline"
        aria-label="Start stopwatch"
      >
        <CheckIcon className="stroke-productive size-4 stroke-3" />
      </Button>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
