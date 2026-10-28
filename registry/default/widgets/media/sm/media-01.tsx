import { SkipBackIcon, SkipForwardIcon } from "lucide-react";

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
  WidgetContent,
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
    <Widget design="mumbai" className="justify-between">
      <WidgetHeader className="items-center justify-start gap-x-2">
        <Avatar className="size-full max-h-9 max-w-9">
          <AvatarImage
            src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
            alt="Code Monkey"
          />
          <AvatarFallback>CM</AvatarFallback>
        </Avatar>
        <div className="space-y-0">
          <Label size="sm">{track.data.title}</Label>
          <Label size="xs" variant="muted-foreground">
            {track.data.artist}
          </Label>
        </div>
      </WidgetHeader>
      <WidgetContent className="flex-col gap-1">
        <AudioPlayerProgress className="h-full max-h-2 w-full flex-1" />
        <div className="flex w-full items-center justify-between">
          <AudioPlayerTime />
          <AudioPlayerDuration />
        </div>
      </WidgetContent>
      <WidgetFooter className="mx-auto w-max items-center justify-between gap-x-6">
        <Button variant="ghost" size="icon-sm">
          <SkipBackIcon className="stroke-muted-foreground" />
        </Button>
        <AudioPlayerButton size="icon-sm" variant="outline" item={track} />
        <Button variant="ghost" size="icon-sm">
          <SkipForwardIcon className="stroke-muted-foreground" />
        </Button>
      </WidgetFooter>
    </Widget>
  </AudioPlayerProvider>
);

export default WidgetDemo;
