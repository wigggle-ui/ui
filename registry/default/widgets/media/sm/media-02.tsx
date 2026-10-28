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
  WidgetHeader,
} from "@/registry/default/ui/widget";

const track = {
  data: { artist: "Jonathan Coulton", title: "Code Monkey" },
  id: "0",
  src: "/code-monkey.mp3",
};

const WidgetDemo = () => (
  <AudioPlayerProvider>
    <Widget className="justify-between">
      <WidgetHeader className="items-center justify-start gap-x-2">
        <Avatar className="size-12">
          <AvatarImage
            src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
            alt="Code Monkey"
          />
          <AvatarFallback>CM</AvatarFallback>
        </Avatar>
        <div className="space-y-0">
          <Label size="sm">{track.data.title}</Label>
        </div>
      </WidgetHeader>
      <WidgetContent className="flex-none flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <Button variant="ghost" size="icon-sm">
            <SkipBackIcon className="stroke-muted-foreground" />
          </Button>
          <AudioPlayerButton size="icon-sm" variant="ghost" item={track} />
          <Button variant="ghost" size="icon-sm">
            <SkipForwardIcon className="stroke-muted-foreground" />
          </Button>
        </div>
        <div className="w-full space-y-1">
          <AudioPlayerProgress className="h-full max-h-2 w-full flex-1" />
          <div className="flex w-full items-center justify-between">
            <AudioPlayerTime />
            <AudioPlayerDuration />
          </div>
        </div>
      </WidgetContent>
    </Widget>
  </AudioPlayerProvider>
);

export default WidgetDemo;
