"use client";

import { ChartNoAxesCombinedIcon } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import type { LabelProps } from "recharts";

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
  { category: "ecommerce", fill: "var(--color-ecommerce)", visitors: 12.72 },
  { category: "finance", fill: "var(--color-finance)", visitors: 24.14 },
  { category: "automobiles", fill: "var(--color-automobiles)", visitors: 8.55 },
  { category: "healthcare", fill: "var(--color-healthcare)", visitors: 23.64 },
  { category: "technology", fill: "var(--color-technology)", visitors: 30.95 },
];
const chartConfig = {
  automobiles: {
    color: "var(--chart-3)",
    label: "Auto",
  },
  ecommerce: {
    color: "var(--chart-1)",
    label: "E-Comm",
  },
  finance: {
    color: "var(--chart-2)",
    label: "Finance",
  },
  healthcare: {
    color: "var(--chart-4)",
    label: "Health",
  },
  technology: {
    color: "var(--chart-5)",
    label: "Tech",
  },
} satisfies ChartConfig;

const PortfolioLabel = ({ viewBox }: LabelProps) => {
  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
    return null;
  }

  return (
    <text
      x={viewBox.cx}
      y={viewBox.cy}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      <tspan
        x={viewBox.cx}
        y={viewBox.cy}
        className="fill-foreground text-lg font-semibold"
      >
        $1.2M
      </tspan>
    </text>
  );
};

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader className="items-center">
      <WidgetTitle className="text-base font-normal">Portfolio</WidgetTitle>
      <ChartNoAxesCombinedIcon className="size-5" />
    </WidgetHeader>
    <WidgetContent>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="category"
            innerRadius={35}
            strokeWidth={5}
          >
            <Label content={<PortfolioLabel />} />
          </Pie>
        </PieChart>
      </ChartContainer>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
