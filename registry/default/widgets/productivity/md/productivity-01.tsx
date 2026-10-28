"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Icons } from "@/components/icons";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const chartData = [
  { instagram: 12, time: "8 AM", whatsapp: 8, x: 5 },
  { instagram: 25, time: "9 AM", whatsapp: 15, x: 18 },
  { instagram: 18, time: "10 AM", whatsapp: 12, x: 8 },
  {
    instagram: 22,
    time: "11 AM",
    whatsapp: 20,
    x: 15,
  },
  {
    instagram: 35,
    time: "12 PM",
    whatsapp: 28,
    x: 22,
  },
  { instagram: 28, time: "1 PM", whatsapp: 18, x: 16 },
  {
    instagram: 32,
    time: "2 PM",
    whatsapp: 22,
    x: 20,
  },
  {
    instagram: 38,
    time: "3 PM",
    whatsapp: 25,
    x: 28,
  },
  {
    instagram: 42,
    time: "4 PM",
    whatsapp: 30,
    x: 32,
  },
  {
    instagram: 48,
    time: "5 PM",
    whatsapp: 35,
    x: 38,
  },
  {
    instagram: 52,
    time: "6 PM",
    whatsapp: 40,
    x: 42,
  },
];

const chartConfig = {
  instagram: {
    color: "var(--chart-1)",
    label: "Instagram",
  },
  whatsapp: {
    color: "var(--chart-2)",
    label: "WhatsApp",
  },
  x: {
    color: "var(--chart-3)",
    label: "X",
  },
} satisfies ChartConfig;

const WidgetDemo = () => (
  <Widget design="mumbai" size="md" className="p-0">
    <WidgetContent className="items-center justify-between gap-5">
      <div className="flex size-full items-center justify-between">
        <div className="mx-auto flex size-full flex-col items-center justify-center gap-6 border-e-2 px-1.5 py-3">
          <div className="flex items-center justify-between gap-2">
            <Icons.Instagram className="size-4.5" />
            <Label>21m</Label>
          </div>
          <div className="flex items-center gap-2">
            <Icons.Whatsapp className="size-4.5" />
            <Label>21m</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Icons.X className="size-4" />
            <Label>21m</Label>
          </div>
        </div>
        <ChartContainer
          className="size-full max-w-72 flex-1"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={true}
              tickMargin={12}
              tick={{ fill: "hsl(var(--color-foreground))" }}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="instagram"
              stackId="a"
              fill="var(--color-instagram)"
              radius={[0, 0, 4, 4]}
            />
            <Bar dataKey="whatsapp" stackId="a" fill="var(--color-whatsapp)" />
            <Bar
              dataKey="x"
              stackId="a"
              fill="var(--color-x)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
