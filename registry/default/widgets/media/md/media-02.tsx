import { SkipBackIcon, SkipForwardIcon } from "lucide-react";

import { Widget, WidgetContent } from "@/registry/default/ui/widget";
import {
  AudioPlayerButton,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerProvider,
  AudioPlayerTime,
  exampleTrack,
} from "@/components/ui/audio-player";
import { Label } from "@/registry/default/ui/label";
import { Button } from "@/registry/default/ui/button";

export default function WidgetDemo() {
  return (
    <AudioPlayerProvider>
      <Widget size="md">
        <WidgetContent className="gap-4">
          <img
            src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
            alt="Code Monkey"
            className="size-full max-w-36 rounded-lg object-cover"
          />
          <div className="flex h-full flex-1 flex-col items-start justify-between pb-3">
            <div className="space-y-0">
              <Label className="text-base">{exampleTrack.data.title}</Label>
              <Label className="text-muted-foreground text-sm">
                {exampleTrack.data.artist}
              </Label>
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <AudioPlayerProgress className="h-full max-h-2 w-full flex-1" />
              <div className="flex w-full items-center justify-between">
                <AudioPlayerTime className="text-muted-foreground text-xs" />
                <AudioPlayerDuration className="text-muted-foreground text-xs" />
              </div>
            </div>
            <div className="mx-auto flex w-max items-center justify-between gap-x-6">
              <Button variant="ghost" size="icon-sm">
                <SkipBackIcon className="stroke-muted-foreground" />
              </Button>
              <AudioPlayerButton
                size="icon-sm"
                variant="secondary"
                item={exampleTrack}
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
}
