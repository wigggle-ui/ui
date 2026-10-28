"use client";

import { Pie, PieChart } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const chartData = [
  { device: "desktop", fill: "var(--color-desktop)", visitors: 275 },
  { device: "mobile", fill: "var(--color-mobile)", visitors: 187 },
];

const chartConfig = {
  desktop: {
    color: "var(--muted-foreground)",
    label: "Chrome",
  },
  devices: {
    label: "Devices",
  },
  mobile: {
    color: "var(--secondary-foreground)",
    label: "Firefox",
  },
} satisfies ChartConfig;

const WidgetDemo = () => (
  <Widget className="gap-0" design="mumbai">
    <WidgetHeader className="items-center">
      <WidgetTitle className="text-lg font-normal">Visitors</WidgetTitle>
      <WidgetTitle className="text-lg font-normal">462</WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="-mt-2">
      <ChartContainer config={chartConfig} className="size-full">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie data={chartData} dataKey="visitors" nameKey="device" />
        </PieChart>
      </ChartContainer>
    </WidgetContent>
    <WidgetFooter className="items-center">
      <div className="flex w-full items-center justify-center gap-1">
        <div className="bg-muted-foreground size-3 rounded-xs" />
        <Label size="sm">Desktop</Label>
      </div>
      <div className="flex w-full items-center justify-center gap-1">
        <div className="bg-secondary-foreground size-3 rounded-xs" />
        <Label size="sm">Mobile</Label>
      </div>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
