import type { ComponentType } from "react";
import type { RegistryItem } from "shadcn/schema";

import WidgetLoaderClient from "@/components/widget-loader-client";
import { widgetMap } from "@/registry/default/widget-map";

interface WidgetLoaderProps {
  widget: RegistryItem;
}

const WidgetLoader = async ({ widget }: WidgetLoaderProps) => {
  const file = widget.files?.[0];

  if (!file) {
    return null;
  }

  const widgetPath = file.path.replaceAll("\\", "/");

  if (widgetPath.includes("/widgets/weather/")) {
    return <WidgetLoaderClient widget={widget} />;
  }

  const loadWidget = widgetMap.get(widgetPath);

  if (!loadWidget) {
    console.error(`Widget not found in generated map: ${widgetPath}`);
    return null;
  }

  const widgetModule = await loadWidget();
  const Widget = widgetModule.default as ComponentType<{
    currentPage?: number;
    totalPages?: number;
  }>;

  return <Widget currentPage={1} totalPages={10} />;
};

export default WidgetLoader;
