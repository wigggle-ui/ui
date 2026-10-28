"use client";

import { LoaderCircleIcon } from "lucide-react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { RegistryItem } from "shadcn/schema";

interface WidgetLoaderProps {
  widget: RegistryItem;
}

const WidgetLoading = () => (
  <div
    data-comp-loading="true"
    className="peer flex min-h-20 items-center justify-center"
  >
    <span className="sr-only">Loading widget...</span>
    <LoaderCircleIcon
      className="text-input -ms-1 animate-spin"
      size={24}
      aria-hidden="true"
    />
  </div>
);

const MissingWidget = (): null => null;

const loadWidget = async (path: string) => {
  try {
    return await import(`@/registry/${path}`);
  } catch {
    return { default: MissingWidget };
  }
};

const widgetComponents = new Map<string, ComponentType<object>>();

const getWidgetComponent = (path: string): ComponentType<object> => {
  const cachedWidget = widgetComponents.get(path);
  if (cachedWidget) {
    return cachedWidget;
  }

  const Widget = dynamic(() => loadWidget(path), {
    loading: WidgetLoading,
    ssr: false,
  });
  widgetComponents.set(path, Widget);
  return Widget;
};

const WidgetLoader = <TProps extends object>({
  widget,
  ...props
}: WidgetLoaderProps & TProps) => {
  const [file] = widget.files ?? [];
  if (!file) {
    return null;
  }
  const widgetPath = file.path.replace("registry/", "");
  const Widget = getWidgetComponent(widgetPath) as ComponentType<TProps>;

  return <Widget {...(props as TProps)} currentPage={1} totalPages={10} />;
};

export default WidgetLoader;
