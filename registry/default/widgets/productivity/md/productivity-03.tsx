"use client";

import { ChartNoAxesColumnIcon } from "lucide-react";

import { Gauge, GaugeArc, GaugeInset, GaugeTrack } from "@/components/gauge";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget size="md" design="mumbai">
    <WidgetHeader className="w-full">
      <WidgetTitle className="flex items-center gap-2">
        <ChartNoAxesColumnIcon />
        <Label>Weekly Progress</Label>
      </WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="justify-between gap-4">
      <div className="w-full">
        <Gauge
          value={76}
          min={0}
          max={100}
          startAngle={180}
          endAngle={540}
          radius={200}
          padding={72}
          fit="content"
          transition={{ bounce: 0.1, type: "spring", visualDuration: 0.5 }}
        >
          <GaugeTrack
            width={40}
            color="var(--productive)"
            opacity={0.12}
            cap="round"
            offset={0}
          />
          <GaugeArc
            width={40}
            color="var(--productive)"
            opacity={1}
            cap="round"
            offset={0}
          />
          <GaugeInset
            x={0}
            y={0}
            scale={0.74}
            value={59}
            min={0}
            max={100}
            startAngle={180}
            endAngle={540}
            transition={{ bounce: 0.1, type: "spring", visualDuration: 0.5 }}
          >
            <GaugeTrack
              width={60}
              color="var(--vercel-yellow)"
              opacity={0.1}
              cap="round"
              offset={2}
            />
            <GaugeArc
              width={60}
              color="var(--vercel-yellow)"
              opacity={1}
              cap="round"
              offset={2}
            />
          </GaugeInset>
          <GaugeInset
            x={0}
            y={0}
            scale={0.5}
            value={41}
            min={0}
            max={100}
            startAngle={180}
            endAngle={540}
            transition={{ bounce: 0.1, type: "spring", visualDuration: 0.5 }}
          >
            <GaugeTrack
              width={76}
              color="var(--destructive)"
              opacity={0.1}
              cap="round"
              offset={0}
            />
            <GaugeArc
              width={76}
              color="var(--destructive)"
              opacity={1}
              cap="round"
              offset={0}
            />
          </GaugeInset>
        </Gauge>
      </div>
      <div className="flex w-full flex-col items-start justify-center gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-productive size-4 rounded-xs" />
          <div>
            <Label size="sm">55/100</Label>
            <Label size="xs" variant="muted-foreground">
              Design Mockups Completed
            </Label>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-vercel-yellow size-4 rounded-xs" />
          <div>
            <Label size="sm">70/100</Label>
            <Label size="xs" variant="muted-foreground">
              Features Developed
            </Label>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-destructive size-4 rounded-xs" />
          <div>
            <Label size="sm">85/100</Label>
            <Label size="xs" variant="muted-foreground">
              Test Cases Passed
            </Label>
          </div>
        </div>
      </div>
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
