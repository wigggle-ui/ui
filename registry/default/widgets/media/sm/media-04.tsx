import { SkipBackIcon, SkipForwardIcon } from "lucide-react";

import { Widget, WidgetContent } from "@/registry/default/ui/widget";
import {
  AudioPlayerButton,
  AudioPlayerProvider,
  exampleTrack,
} from "@/components/ui/audio-player";
import { Label } from "@/registry/default/ui/label";
import { Button } from "@/registry/default/ui/button";

export default function WidgetDemo() {
  return (
    <AudioPlayerProvider>
      <Widget design="mumbai" className="justify-between gap-3 p-0">
        <WidgetContent>
          <div className="relative size-full">
            <img
              src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
              alt="Code Monkey"
              className="w-full rounded-3xl object-cover"
            />
            <div className="absolute inset-0 z-10 rounded-3xl bg-linear-to-t from-black via-black/75 to-transparent" />
            <Label className="absolute bottom-20 left-4 z-10 w-full overflow-hidden text-base">
              {exampleTrack.data.title}
            </Label>
            <Label className="text-muted-foreground absolute bottom-16 left-4 z-10 text-xs font-normal">
              {exampleTrack.data.artist}
            </Label>
            <div className="absolute inset-x-0 bottom-4 z-20 flex w-full gap-x-3 px-4">
              <AudioPlayerButton
                variant="outline"
                className="flex-1 rounded-full"
                item={exampleTrack}
              />
              <Button className="rounded-full" variant="outline" size="icon-sm">
                <SkipBackIcon />
              </Button>
              <Button className="rounded-full" variant="outline" size="icon-sm">
                <SkipForwardIcon />
              </Button>
            </div>
          </div>
        </WidgetContent>
      </Widget>
    </AudioPlayerProvider>
  );
}
