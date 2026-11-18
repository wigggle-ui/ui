import Image from "next/image";

import { Text } from "@/components/ui/text";
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
            <Text>{team.teamName}</Text>
          </div>
          <div className="flex items-center justify-end gap-1">
            <Text>{team.score}</Text>
            <Text variant="muted-foreground" size="xs">
              ({team.overs})
            </Text>
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
