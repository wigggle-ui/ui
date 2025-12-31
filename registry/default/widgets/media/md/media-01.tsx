import {
  CastIcon,
  HeartIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";

import {
  Widget,
  WidgetFooter,
  WidgetHeader,
} from "@/registry/default/ui/widget";
import {
  AudioPlayerButton,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerProvider,
  AudioPlayerTime,
  exampleTrack,
} from "@/components/ui/audio-player";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Label } from "@/registry/default/ui/label";
import { Button } from "@/registry/default/ui/button";

export default function WidgetDemo() {
  return (
    <AudioPlayerProvider>
      <Widget className="justify-between" size="md">
        <WidgetHeader className="items-center justify-between">
          <div className="flex items-center justify-center gap-x-3">
            <Avatar className="size-12 rounded-md">
              <AvatarImage
                src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
                alt="Code Monkey"
              />
              <AvatarFallback>NU</AvatarFallback>
            </Avatar>
            <div>
              <Label className="text-base">{exampleTrack.data.title}</Label>
              <Label className="text-muted-foreground text-sm">
                {exampleTrack.data.artist}
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
              <AudioPlayerTime className="text-muted-foreground text-xs" />
              <AudioPlayerDuration className="text-muted-foreground text-xs" />
            </div>
          </div>
          <div className="mx-auto flex w-max items-center justify-between gap-8">
            <Button variant="ghost" size="icon-sm">
              <ShuffleIcon className="stroke-muted-foreground size-5" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <SkipBackIcon className="stroke-muted-foreground size-5" />
            </Button>
            <AudioPlayerButton size="icon-sm" item={exampleTrack} />
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
}
