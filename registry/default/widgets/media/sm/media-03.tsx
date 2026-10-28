import { SkipBackIcon, SkipForwardIcon } from "lucide-react";
import Image from "next/image";

import {
  AudioPlayerButton,
  AudioPlayerProvider,
} from "@/components/ui/audio-player";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";

const track = {
  data: { artist: "Jonathan Coulton", title: "Code Monkey" },
  id: "0",
  src: "/code-monkey.mp3",
};

const WidgetDemo = () => (
  <AudioPlayerProvider>
    <Widget design="mumbai" className="justify-between gap-3">
      <WidgetContent>
        <div className="relative size-full">
          <Image
            fill
            src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
            alt="Code Monkey"
            className="max-h-28 w-full rounded-lg object-cover"
          />
          <div className="absolute inset-0 z-10 rounded-md bg-linear-to-t from-black via-black/50 to-transparent" />
          <Label
            variant="muted-foreground"
            size="xs"
            className="absolute bottom-7 left-2 z-10"
          >
            Now Playing
          </Label>
          <Label
            size="sm"
            className="absolute bottom-2 left-2 z-10 w-36 overflow-hidden"
          >
            <span className="inline-block whitespace-nowrap">
              {track.data.title}
            </span>
          </Label>
        </div>
      </WidgetContent>
      <WidgetFooter className="gap-2">
        <AudioPlayerButton variant="outline" className="flex-1" item={track} />
        <Button variant="outline" size="icon-sm-circle">
          <SkipBackIcon />
        </Button>
        <Button variant="outline" size="icon-sm-circle">
          <SkipForwardIcon />
        </Button>
      </WidgetFooter>
    </Widget>
  </AudioPlayerProvider>
);

export default WidgetDemo;
