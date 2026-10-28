import * as React from "react";

import { cn } from "@/lib/utils";

export interface TypeTableProp {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description?: React.ReactNode;
}

interface TypeTableProps {
  props: TypeTableProp[];
  className?: string;
}

const TypeTable = ({ props, className }: TypeTableProps) => (
  <div
    className={cn("my-6 w-full overflow-y-auto rounded-lg border", className)}
  >
    <table className="w-full text-left">
      <thead className="bg-secondary text-muted-foreground">
        <tr className="border-b">
          <th className="h-10 px-4 py-2 font-medium">Prop</th>
          <th className="h-10 px-4 py-2 font-medium">Type</th>
          <th className="h-10 px-4 py-2 font-medium">Default</th>
          <th className="hidden h-10 px-4 py-2 font-medium lg:block">
            Description
          </th>
        </tr>
      </thead>
      <tbody className="divide-y text-sm lg:text-base">
        {props.map((prop, index) => (
          <tr
            key={prop.name + index}
            className="hover:bg-muted bg-background transition-colors"
          >
            {/* Prop Name */}
            <td className="px-4 py-3 align-top">
              <div className="text-primary flex items-center gap-1 font-semibold">
                <code>{prop.name}</code>
                {prop.required && (
                  <span className="text-destructive" title="Required">
                    *
                  </span>
                )}
              </div>
            </td>

            {/* Type Definition */}
            <td className="px-4 py-3 align-top">
              <code className="bg-background border-border text-secondary-foreground rounded border px-1.5 py-0.5 break-all">
                {prop.type}
              </code>
            </td>

            {/* Default Value */}
            <td className="px-4 py-3 align-top">
              {prop.default ? (
                <code className="text-muted-foreground">{prop.default}</code>
              ) : (
                <span className="text-muted-foreground/50 italic">—</span>
              )}
            </td>

            {/* Description */}
            <td className="text-foreground hidden px-4 py-3 align-top lg:block">
              {prop.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TypeTable;
