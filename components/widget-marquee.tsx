"use client";

import { Marquee } from "@/components/ui/marquee";
import { MD_WIDGETS, SM_WIDGETS, LG_WIDGETS } from "@/constants";

const firstRow = SM_WIDGETS.slice(0, SM_WIDGETS.length / 2);
const secondRow = SM_WIDGETS.slice(SM_WIDGETS.length / 2);

const firstMdRow = MD_WIDGETS.slice(0, MD_WIDGETS.length / 2);
const secondMdRow = MD_WIDGETS.slice(MD_WIDGETS.length / 2);

const WidgetCard = ({ widget }: { widget: React.ReactElement }) => (
  <div className="shrink-0">{widget}</div>
);

const WidgetMarquee = () => (
  <div className="relative flex w-screen flex-col items-center justify-center overflow-hidden">
    <Marquee className="[--duration:30s]">
      {firstRow.map((entry) => (
        <WidgetCard key={entry.key} widget={entry.widget} />
      ))}
    </Marquee>
    <Marquee reverse className="[--duration:30s]">
      {firstMdRow.map((entry) => (
        <WidgetCard key={entry.key} widget={entry.widget} />
      ))}
    </Marquee>
    <Marquee className="[--duration:30s]">
      {LG_WIDGETS.map((entry) => (
        <WidgetCard key={entry.key} widget={entry.widget} />
      ))}
    </Marquee>
    <Marquee reverse className="[--duration:30s]">
      {secondMdRow.map((entry) => (
        <WidgetCard key={entry.key} widget={entry.widget} />
      ))}
    </Marquee>
    <Marquee className="[--duration:30s]">
      {secondRow.map((entry) => (
        <WidgetCard key={entry.key} widget={entry.widget} />
      ))}
    </Marquee>
  </div>
);

export default WidgetMarquee;
