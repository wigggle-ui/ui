import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
} from "@/registry/default/ui/widget";

const battersInfo = [
  {
    balls: "134",
    playerName: "Pratika R",
    score: "122",
    teamImage: "/assets/logos/ind.png",
    teamName: "India",
  },
  {
    balls: "95",
    playerName: "Smriti M",
    score: "109*",
    teamImage: "/assets/logos/ind.png",
    teamName: "India",
  },
];

const bowlersInfo = [
  {
    overs: "6.0",
    playerName: "Eden C",
    score: "2/76",
    teamImage: "/assets/logos/nz.png",
    teamName: "New Zealand",
  },
];

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader className="pb-1.5">
      <div className="flex items-center gap-1">
        <div className="bg-productive size-2 rounded-full" />
        <Text size="sm" variant="muted-foreground">
          IND vs NZ
        </Text>
      </div>
      <Text size="sm">340/7</Text>
    </WidgetHeader>
    <WidgetContent className="flex-col items-center gap-2">
      <div className="flex w-full flex-col items-center justify-between gap-3">
        {battersInfo.map((batter, i) => (
          <div key={i} className="flex w-full items-center justify-between">
            <div className="flex gap-1">
              <Image
                className="size-4"
                src={batter.teamImage}
                alt={batter.teamName}
                width={20}
                height={20}
              />
              <Text size="xs">{batter.playerName}</Text>
            </div>
            <Text size="xs">
              {batter.score}
              <span className="text-muted-foreground">({batter.balls})</span>
            </Text>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex w-full items-center justify-between">
        {bowlersInfo.map((bowler, i) => (
          <div key={i} className="flex w-full items-center justify-between">
            <div className="flex gap-1">
              <Image
                className="size-4"
                src={bowler.teamImage}
                alt={bowler.teamName}
                width={20}
                height={20}
              />
              <Text size="xs">{bowler.playerName}</Text>
            </div>
            <Text size="xs">
              {bowler.score}
              <span className="text-muted-foreground">({bowler.overs})</span>
            </Text>
          </div>
        ))}
      </div>
    </WidgetContent>
    <WidgetFooter className="justify-center pt-1">
      <p className="text-muted-foreground text-sm">
        IND needs <span className="text-productive">26</span> from{" "}
        <span className="text-productive">18</span>
      </p>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
