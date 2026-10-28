"use client";

import { DotIcon, GlobeIcon, MonitorIcon, UploadIcon } from "lucide-react";
import { Pie, PieChart } from "recharts";

import { Button } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetHeader,
  WidgetContent,
  WidgetTitle,
  WidgetFooter,
} from "@/registry/default/ui/widget";

const visitorsByTrafficChartData = [
  { fill: "var(--color-direct)", medium: "direct", visitors: 1578 },
  { fill: "var(--color-search)", medium: "search", visitors: 908 },
  { fill: "var(--color-referrals)", medium: "referrals", visitors: 789 },
  { fill: "var(--color-socials)", medium: "socials", visitors: 671 },
];

const chartConfig = {
  direct: {
    color: "var(--vercel-purple)",
    label: "Direct",
  },
  mediums: {
    label: "Mediums",
  },
  referrals: {
    color: "var(--vercel-yellow)",
    label: "Referrals",
  },
  search: {
    color: "var(--vercel-pink)",
    label: "Search",
  },
  socials: {
    color: "var(--vercel-blue)",
    label: "Socials",
  },
} satisfies ChartConfig;

const WidgetDemo = () => (
  <Widget design="mumbai" size="lg" className="gap-2">
    <WidgetHeader>
      <WidgetTitle className="text-2xl">Traffic Source</WidgetTitle>
      <WidgetTitle className="text-2xl">3946</WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="flex-col justify-start gap-4">
      <div className="flex w-full items-center justify-start">
        <div className="flex items-center space-x-1">
          <GlobeIcon className="stroke-muted-foreground size-4" />
          <Label variant="muted-foreground">Worldwide</Label>
        </div>
        <DotIcon className="stroke-muted-foreground/40" />
        <div className="flex items-center space-x-1">
          <MonitorIcon className="stroke-muted-foreground size-4" />
          <Label variant="muted-foreground">Desktop</Label>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="size-full max-h-44">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={visitorsByTrafficChartData}
            dataKey="visitors"
            nameKey="medium"
          />
        </PieChart>
      </ChartContainer>
    </WidgetContent>
    <WidgetFooter className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-center gap-6">
        <div className="flex items-center space-x-1.5">
          <div className="bg-vercel-purple size-2.5 rounded-full" />
          <Label size="sm" variant="muted-foreground">
            Direct
          </Label>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="bg-vercel-pink size-2.5 rounded-full" />
          <Label size="sm" variant="muted-foreground">
            Search
          </Label>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="bg-vercel-yellow size-2.5 rounded-full" />
          <Label size="sm" variant="muted-foreground">
            Referrals
          </Label>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="bg-vercel-blue size-2.5 rounded-full" />
          <Label size="sm" variant="muted-foreground">
            Socials
          </Label>
        </div>
      </div>
      <Button className="w-full" variant="outline">
        <UploadIcon /> Export
      </Button>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
