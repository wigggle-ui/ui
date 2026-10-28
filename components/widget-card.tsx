import { cn } from "cn";
import type { RegistryItem } from "shadcn/schema";

const WidgetCard = ({
  children,
  widget,
  className,
}: {
  children: React.ReactNode;
  widget: RegistryItem;
  className?: string;
}) => (
  <div
    className={cn(
      "group group/item relative col-span-12 mx-auto flex w-full items-center justify-center sm:col-span-6 lg:col-span-4",
      className
    )}
    data-slot={widget.name}
  >
    {children}
  </div>
);

export default WidgetCard;
