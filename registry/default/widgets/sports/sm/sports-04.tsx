import Image from "next/image";

import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const upcomingMatches = [
  {
    away: "/assets/logos/bvb.png",
    date: "25 Oct",
    home: "/assets/logos/fcb.png",
    time: "8:30 PM",
  },
  {
    away: "/assets/logos/fcb.png",
    date: "29 Oct",
    home: "/assets/logos/mci.png",
    time: "12:30 PM",
  },
  {
    away: "/assets/logos/fcb.png",
    date: "31 Oct",
    home: "/assets/logos/bvb.png",
    time: "8:30 PM",
  },
];

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader>
      <WidgetTitle className="text-sm font-normal">Fixtures</WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="mt-2 flex-col items-center gap-1.5">
      {upcomingMatches.map((match, i) => (
        <div
          key={i}
          className="bg-secondary flex w-full items-center justify-between rounded-lg px-2 py-1"
        >
          <Image
            className="size-7"
            src={match.home}
            alt={match.home}
            width={64}
            height={64}
          />
          <div className="flex flex-col items-center justify-center gap-0">
            <Label variant="muted-foreground" size="xs">
              {match.date}
            </Label>
            <Label variant="muted-foreground" size="xs">
              {match.time}
            </Label>
          </div>
          <Image
            className="size-7"
            src={match.away}
            alt={match.away}
            width={64}
            height={64}
          />
        </div>
      ))}
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
