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
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface MusicCardProps {
  image: string;
  alt: string;
  fallback: string;
  title: string;
  artist: string;
}

const musicCards: MusicCardProps[] = [
  {
    alt: "Ed Sheeran",
    artist: "Ed Sheeran",
    fallback: "ED",
    image: "https://i.scdn.co/image/ab6761610000e5ebd55c95ad400aed87da52daec",
    title: "Sapphire",
  },
  {
    alt: "Nucleya",
    artist: "Nucleya",
    fallback: "NU",
    image:
      "https://c.saavncdn.com/artists/Nucleya_002_20241118064538_500x500.jpg",
    title: "Jamrock",
  },
  {
    alt: "Major Lazer",
    artist: "Major Lazer",
    fallback: "ML",
    image: "https://i.scdn.co/image/ab67616d0000b273aacbfc6de7128a834757fea4",
    title: "Bumaye",
  },
  {
    alt: "DJ Snake",
    artist: "DJ Snake",
    fallback: "DS",
    image: "https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8",
    title: "Taki Taki",
  },
  {
    alt: "Arijit Singh",
    artist: "Arijit Singh",
    fallback: "AS",
    image: "https://i.scdn.co/image/ab67616d0000b273627b5b17cb48f6e6956b842e",
    title: "Raabta",
  },
];

const MusicCard = ({
  image,
  alt,
  fallback,
  title,
  artist,
}: {
  image: string;
  alt: string;
  fallback: string;
  title: string;
  artist: string;
}) => (
  <div className="group bg-secondary hover:bg-muted/50 mt-3 flex w-full items-center justify-start gap-2 rounded-md p-3 hover:cursor-pointer">
    <Avatar className="size-full max-h-9 max-w-9">
      <AvatarImage src={image} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
    <div className="space-y-0">
      <Label size="sm" className="w-full group-hover:cursor-pointer">
        {title}
      </Label>
      <Label
        variant="muted-foreground"
        size="xs"
        className="group-hover:cursor-pointer"
      >
        {artist}
      </Label>
    </div>
  </div>
);

const WidgetDemo = () => (
  <AudioPlayerProvider>
    <Widget size="md" className="p-0">
      <WidgetContent>
        <div className="size-full">
          <div className="flex size-full flex-col items-center justify-between p-6">
            <WidgetHeader className="items-center justify-start gap-x-3">
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
            <WidgetContent className="w-full flex-col gap-1">
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
              <AudioPlayerButton
                size="icon-sm"
                variant="outline"
                item={track}
              />
              <Button variant="ghost" size="icon-sm">
                <SkipForwardIcon className="stroke-muted-foreground" />
              </Button>
            </WidgetFooter>
          </div>
        </div>
        <div className="flex size-full flex-col items-start justify-between">
          <ScrollArea className="size-full max-h-44">
            <div className="pe-3">
              {musicCards.map((el, i) => (
                <MusicCard key={i} {...el} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </WidgetContent>
    </Widget>
  </AudioPlayerProvider>
);

export default WidgetDemo;
