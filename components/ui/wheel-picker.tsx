import "@ncdai/react-wheel-picker/style.css";
import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";

import { cn } from "@/lib/utils";

type WheelPickerOption = WheelPickerPrimitive.WheelPickerOption;
type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames;

const WheelPickerWrapper = ({
  className,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPickerWrapper>) => (
  <WheelPickerPrimitive.WheelPickerWrapper
    className={cn(
      "w-full px-1",
      "*:data-rwp:first:*:data-rwp-highlight-wrapper:rounded-s-md",
      "*:data-rwp:last:*:data-rwp-highlight-wrapper:rounded-e-md",
      className
    )}
    {...props}
  />
);

const WheelPicker = ({
  classNames,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPicker>) => (
  <WheelPickerPrimitive.WheelPicker
    classNames={{
      highlightWrapper:
        "bg-border text-code-foreground dark:bg-muted dark:text-primary",
      optionItem: "text-ring dark:text-muted-foreground",
      ...classNames,
    }}
    {...props}
  />
);

export { WheelPicker, WheelPickerWrapper };
export type { WheelPickerClassNames, WheelPickerOption };
