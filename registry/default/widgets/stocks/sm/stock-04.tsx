"use client";

import { TriangleIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const chartData = [
  { desktop: 36.49, month: "November 2024" },
  { desktop: 49.53, month: "December 2024" },
  { desktop: 35.16, month: "January 2025" },
  { desktop: 41.25, month: "February 2025" },
  { desktop: 21.59, month: "March 2025" },
  { desktop: 11.98, month: "April 2025" },
  { desktop: 21.62, month: "May 2025" },
  { desktop: 24.94, month: "June 2025" },
  { desktop: 47.34, month: "July 2025" },
  { desktop: 27.14, month: "August 2025" },
  { desktop: 24.63, month: "September 2025" },
  { desktop: 25.45, month: "October 2025" },
];

const chartConfig = {
  desktop: {
    color: "var(--destructive)",
    label: "Desktop",
  },
} satisfies ChartConfig;

const WidgetDemo = () => (
  <Widget design="mumbai" className="gap-1">
    <WidgetHeader className="items-center">
      <div className="flex items-center justify-start gap-1">
        <TriangleIcon className="fill-destructive size-4 rotate-180 stroke-none" />
        <WidgetTitle className="text-base font-normal">AAPL</WidgetTitle>
      </div>
      <Label variant="destructive">-4.26</Label>
    </WidgetHeader>
    <WidgetContent>
      <ChartContainer className="h-20 w-full" config={chartConfig}>
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="desktop"
            type="natural"
            fill="url(#fillDesktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </WidgetContent>
    <WidgetFooter className="justify-end">
      <Label size="xxxl" weight="medium">
        262.24
      </Label>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
