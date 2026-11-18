import Image from "next/image";

import { Text } from "@/components/ui/text";
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
        <Text size="sm">UCL - 1st</Text>
        <Text size="sm">EPL - 4th</Text>
      </div>
    </WidgetHeader>
    <WidgetContent className="mt-3 flex-col items-center gap-3">
      {upcomingMatches.map((match, i) => (
        <div
          key={i}
          className="bg-secondary flex w-full items-center justify-between rounded-lg px-2 py-1"
        >
          <Text>{match.teamName}</Text>
          <div className="text-muted-foreground flex flex-col gap-0.5">
            <Text size="xs">{match.date}</Text>
            <Text size="xs">{match.time}</Text>
          </div>
        </div>
      ))}
    </WidgetContent>
  </Widget>
);

export default WidgetDemo;
