import {
  CastIcon,
  HeartIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";

import {
  AudioPlayerButton,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerProvider,
  AudioPlayerTime,
} from "@/components/ui/audio-player";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetFooter,
  WidgetHeader,
} from "@/registry/default/ui/widget";

const track = {
  data: { artist: "Jonathan Coulton", title: "Code Monkey" },
  id: "0",
  src: "/code-monkey.mp3",
};

const WidgetDemo = () => (
  <AudioPlayerProvider>
    <Widget className="justify-between" size="md">
      <WidgetHeader className="items-center justify-between">
        <div className="flex items-center justify-center gap-x-3">
          <Avatar className="size-12">
            <AvatarImage
              src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
              alt="Code Monkey"
            />
            <AvatarFallback>NU</AvatarFallback>
          </Avatar>
          <div>
            <Label>{track.data.title}</Label>
            <Label variant="muted-foreground" size="sm">
              {track.data.artist}
            </Label>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm">
          <HeartIcon className="stroke-muted-foreground size-5" />
        </Button>
      </WidgetHeader>
      <WidgetFooter className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-1.5">
          <AudioPlayerProgress className="h-full max-h-2 w-full flex-1" />
          <div className="flex w-full items-center justify-between">
            <AudioPlayerTime />
            <AudioPlayerDuration />
          </div>
        </div>
        <div className="mx-auto flex w-max items-center justify-between gap-8">
          <Button variant="ghost" size="icon-sm">
            <ShuffleIcon className="stroke-muted-foreground size-5" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <SkipBackIcon className="stroke-muted-foreground size-5" />
          </Button>
          <AudioPlayerButton size="icon-sm" item={track} />
          <Button variant="ghost" size="icon-sm">
            <SkipForwardIcon className="stroke-muted-foreground size-5" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <CastIcon className="stroke-muted-foreground size-5" />
          </Button>
        </div>
      </WidgetFooter>
    </Widget>
  </AudioPlayerProvider>
);

export default WidgetDemo;
