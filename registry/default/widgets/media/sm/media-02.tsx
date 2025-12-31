import { SkipBackIcon, SkipForwardIcon } from "lucide-react";

import {
  Widget,
  WidgetContent,
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
      <Widget className="justify-between">
        <WidgetHeader className="items-center justify-start gap-x-3">
          <Avatar className="size-14 rounded-md">
            <AvatarImage
              src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
              alt="Code Monkey"
            />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
          <div className="space-y-0">
            <Label className="text-base text-wrap">
              {exampleTrack.data.title}
            </Label>
          </div>
        </WidgetHeader>
        <WidgetContent className="flex-none flex-col gap-3">
          <div className="flex w-full items-center justify-between">
            <Button variant="ghost" size="icon-sm">
              <SkipBackIcon className="stroke-muted-foreground" />
            </Button>
            <AudioPlayerButton
              size="icon-sm"
              variant="ghost"
              item={exampleTrack}
            />
            <Button variant="ghost" size="icon-sm">
              <SkipForwardIcon className="stroke-muted-foreground" />
            </Button>
          </div>
          <div className="w-full space-y-1">
            <AudioPlayerProgress className="h-full max-h-2 w-full flex-1" />
            <div className="flex w-full items-center justify-between">
              <AudioPlayerTime className="text-muted-foreground text-xs" />
              <AudioPlayerDuration className="text-muted-foreground text-xs" />
            </div>
          </div>
        </WidgetContent>
      </Widget>
    </AudioPlayerProvider>
  );
}
