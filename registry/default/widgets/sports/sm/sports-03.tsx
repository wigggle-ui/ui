import Image from "next/image";

import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
} from "@/registry/default/ui/widget";

const upcomingMatches = [
  { date: "25 Oct", teamName: "FCB (H)", time: "18:00" },
  { date: "29 Oct", teamName: "BVB (A)", time: "21:00" },
];

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader className="items-center">
      <Image
        className="size-12"
        src="/assets/logos/mci.png"
        alt="FC Barcelona"
        width={48}
        height={48}
      />
      <div className="text-muted-foreground flex flex-col">
        <Label size="sm">UCL - 1st</Label>
        <Label size="sm">EPL - 4th</Label>
      </div>
    </WidgetHeader>
    <WidgetContent className="mt-3 flex-col items-center gap-3">
      {upcomingMatches.map((match, i) => (
        <div
          key={i}
          className="bg-secondary flex w-full items-center justify-between rounded-lg px-2 py-1"
        >
          <Label>{match.teamName}</Label>
          <div className="text-muted-foreground flex flex-col gap-0.5">
            <Label size="xs">{match.date}</Label>
            <Label size="xs">{match.time}</Label>
          </div>
        </div>
      ))}
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
