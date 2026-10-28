import Image from "next/image";

import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const scoreCard = [
  {
    image: "/assets/logos/ind.png",
    overs: 49,
    score: "387/3",
    teamName: "IND",
  },
  {
    image: "/assets/logos/aus.png",
    overs: 30,
    score: "200/6",
    teamName: "AUS",
  },
];

const WidgetDemo = () => (
  <Widget design="mumbai">
    <WidgetHeader>
      <WidgetTitle className="text-muted-foreground">ODI 2</WidgetTitle>
    </WidgetHeader>
    <WidgetContent className="flex-col items-center gap-4">
      {scoreCard.map((team, i) => (
        <div key={i} className="flex w-full items-center justify-between">
          <div className="flex items-center justify-start gap-1">
            <Image
              className="size-5"
              src={team.image}
              alt={team.teamName}
              width={24}
              height={24}
            />
            <Label>{team.teamName}</Label>
          </div>
          <div className="flex items-center justify-end gap-1">
            <Label>{team.score}</Label>
            <Label variant="muted-foreground" size="xs">
              ({team.overs})
            </Label>
          </div>
        </div>
      ))}
    </WidgetContent>
    <WidgetFooter className="justify-center">
      <p className="text-muted-foreground text-sm">
        AUS needs <span className="text-productive">187</span> from{" "}
        <span className="text-productive">120</span>
      </p>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
