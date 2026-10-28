import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import type { RegistryItem } from "shadcn/schema";
import { twMerge } from "tailwind-merge";

import registry from "@/registry.json";

const widgets = registry.items as unknown as RegistryItem[];

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getWidgetsByNames = (names: string[]): RegistryItem[] => {
  const widgetsMap = new Map(widgets.map((widget) => [widget.name, widget]));

  return names
    .map((name) => widgetsMap.get(name))
    .filter((comp): comp is RegistryItem => comp !== undefined);
};

export const convertRegistryPaths = (content: string): string =>
  content
    .replaceAll("@/registry/default/ui", "@/components/ui")
    .replaceAll("@/registry/default/hooks", "@/hooks")
    .replaceAll("@/registry/default/lib", "@/lib");
