import React from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}
const PageHeader = ({ title, className, children }: PageHeaderProps) => (
  <div className={cn("relative mt-6 space-y-2 text-center", className)}>
    <h1 className="text-foreground text-4xl/[1.1] font-semibold md:text-5xl/[1.1]">
      {title}
    </h1>
    <p className="text-muted-foreground w-full text-lg">{children}</p>
  </div>
);

export default PageHeader;
