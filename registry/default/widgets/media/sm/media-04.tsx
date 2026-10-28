import { SkipBackIcon, SkipForwardIcon } from "lucide-react";
import Image from "next/image";

import {
  AudioPlayerButton,
  AudioPlayerProvider,
} from "@/components/ui/audio-player";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const track = {
  data: { artist: "Jonathan Coulton", title: "Code Monkey" },
  id: "0",
  src: "/code-monkey.mp3",
};

const WidgetDemo = () => (
  <AudioPlayerProvider>
    <Widget design="mumbai" className="justify-between gap-3 p-0">
      <WidgetContent>
        <div className="relative size-full">
          <Image
            fill
            src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
            alt="Code Monkey"
            className="w-full rounded-3xl object-cover"
          />
          <div className="absolute inset-0 z-10 rounded-3xl bg-linear-to-t from-black via-black/75 to-transparent" />
          <Label className="absolute bottom-20 left-4 z-10 w-full overflow-hidden">
            {track.data.title}
          </Label>
          <Label
            variant="muted-foreground"
            size="xs"
            className="absolute bottom-16 left-4 z-10"
          >
            {track.data.artist}
          </Label>
          <div className="absolute inset-x-0 bottom-4 z-20 flex w-full gap-x-3 px-4">
            <AudioPlayerButton
              variant="outline"
              className="flex-1"
              item={track}
            />
            <Button variant="outline" size="icon-sm-circle">
              <SkipBackIcon />
            </Button>
            <Button variant="outline" size="icon-sm-circle">
              <SkipForwardIcon />
            </Button>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  </AudioPlayerProvider>
);

export default WidgetDemo;
