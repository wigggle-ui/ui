import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ReactNode } from "react";
import type { RegistryItem } from "shadcn/schema";

import WidgetLoader from "@/components/widget-loader-server";

interface WidgetDetails {
  name: string;
  preview: ReactNode;
  code: string;
}

export const getWidgetInfo = async (
  widget: RegistryItem
): Promise<WidgetDetails | null> => {
  const widgetFile = widget.files?.[0];

  if (!widgetFile) {
    return null;
  }

  const sourcePath = path.join(
    process.cwd(),
    "registry",
    path.relative("registry", widgetFile.path)
  );
  const code = await readFile(sourcePath, "utf-8");

  return {
    code,
    name: widget.name,
    preview: <WidgetLoader widget={widget} />,
  };
};
