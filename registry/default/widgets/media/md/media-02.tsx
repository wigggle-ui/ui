import { SkipBackIcon, SkipForwardIcon } from "lucide-react";
import Image from "next/image";

import {
  AudioPlayerButton,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerProvider,
  AudioPlayerTime,
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
    <Widget size="md">
      <WidgetContent className="gap-4">
        <Image
          width={100}
          height={100}
          src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
          alt="Code Monkey"
          className="size-full max-w-36 rounded-lg object-cover"
        />
        <div className="flex h-full flex-1 flex-col items-start justify-between pb-3">
          <div className="space-y-0">
            <Label>{track.data.title}</Label>
            <Label variant="muted-foreground" size="sm">
              {track.data.artist}
            </Label>
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <AudioPlayerProgress className="h-full max-h-2 w-full flex-1" />
            <div className="flex w-full items-center justify-between">
              <AudioPlayerTime />
              <AudioPlayerDuration />
            </div>
          </div>
          <div className="mx-auto flex w-max items-center justify-between gap-x-6">
            <Button variant="ghost" size="icon-sm">
              <SkipBackIcon className="stroke-muted-foreground" />
            </Button>
            <AudioPlayerButton
              size="icon-sm"
              variant="secondary"
              item={track}
            />
            <Button variant="ghost" size="icon-sm">
              <SkipForwardIcon className="stroke-muted-foreground" />
            </Button>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  </AudioPlayerProvider>
);

export default WidgetDemo;
