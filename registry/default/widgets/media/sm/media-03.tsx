import { SkipBackIcon, SkipForwardIcon } from "lucide-react";

import {
  Widget,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";
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
      <Widget design="mumbai" className="justify-between gap-3">
        <WidgetContent>
          <div className="relative size-full">
            <img
              src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
              alt="Code Monkey"
              className="max-h-28 w-full rounded-lg object-cover"
            />
            <div className="absolute inset-0 z-10 rounded-md bg-linear-to-t from-black via-black/50 to-transparent" />
            <Label className="text-muted-foreground absolute bottom-7 left-2 z-10 text-xs font-normal">
              Now Playing
            </Label>
            <Label className="absolute bottom-2 left-2 z-10 w-36 overflow-hidden text-sm">
              <span className="inline-block whitespace-nowrap">
                {exampleTrack.data.title}
              </span>
            </Label>
          </div>
        </WidgetContent>
        <WidgetFooter className="gap-2">
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
        </WidgetFooter>
      </Widget>
    </AudioPlayerProvider>
  );
}
