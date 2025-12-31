import { SkipBackIcon, SkipForwardIcon } from "lucide-react";

import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
} from "@/registry/default/ui/widget";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Label } from "@/registry/default/ui/label";
import {
  AudioPlayerButton,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerProvider,
  AudioPlayerTime,
  exampleTrack,
} from "@/components/ui/audio-player";
import { Button } from "@/registry/default/ui/button";

export default function WidgetDemo() {
  return (
    <AudioPlayerProvider>
      <Widget design="mumbai" className="justify-between">
        <WidgetHeader className="items-center justify-start gap-x-3">
          <Avatar className="size-full max-h-9 max-w-9 rounded-md">
            <AvatarImage
              src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
              alt="Code Monkey"
            />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
          <div className="space-y-0">
            <Label className="text-base">{exampleTrack.data.title}</Label>
            <Label className="text-muted-foreground text-xs">
              {exampleTrack.data.artist}
            </Label>
          </div>
        </WidgetHeader>
        <WidgetContent className="flex-col gap-1">
          <AudioPlayerProgress className="h-full max-h-2 w-full flex-1" />
          <div className="flex w-full items-center justify-between">
            <AudioPlayerTime className="text-muted-foreground text-xs" />
            <AudioPlayerDuration className="text-muted-foreground text-xs" />
          </div>
        </WidgetContent>
        <WidgetFooter className="mx-auto w-max items-center justify-between gap-x-6">
          <Button variant="ghost" size="icon-sm">
            <SkipBackIcon className="stroke-muted-foreground" />
          </Button>
          <AudioPlayerButton
            size="icon-sm"
            variant="outline"
            item={exampleTrack}
          />
          <Button variant="ghost" size="icon-sm">
            <SkipForwardIcon className="stroke-muted-foreground" />
          </Button>
        </WidgetFooter>
      </Widget>
    </AudioPlayerProvider>
  );
}
