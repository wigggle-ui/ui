"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const chartData = [
  { desktop: 186, mobile: 80, month: "Jan" },
  { desktop: 305, mobile: 200, month: "Feb" },
  { desktop: 237, mobile: 120, month: "Mar" },
  { desktop: 173, mobile: 56, month: "Apr" },
  { desktop: 299, mobile: 130, month: "May" },
];

const chartConfig = {
  desktop: {
    color: "var(--productive)",
    label: "Desktop",
  },
  mobile: {
    color: "var(--destructive)",
    label: "Mobile",
  },
} satisfies ChartConfig;

const WidgetDemo = () => (
  <Widget design="mumbai" className="gap-4">
    <WidgetHeader>
      <WidgetTitle className="w-full text-center">acme.com</WidgetTitle>
    </WidgetHeader>
    <WidgetContent>
      <ChartContainer className="size-full" config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="desktop"
            type="natural"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-desktop)",
            }}
            activeDot={{
              r: 6,
            }}
          />
          <Line
            dataKey="mobile"
            type="natural"
            stroke="var(--color-mobile)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-mobile)",
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ChartContainer>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
