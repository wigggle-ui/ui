import { SkipBackIcon, SkipForwardIcon } from "lucide-react";

import {
  Widget,
  WidgetContent,
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
import { Label } from "@/registry/default/ui/label";
import { Button } from "@/registry/default/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { ScrollArea } from "@/registry/default/ui/scroll-area";

type MusicCardProps = {
  image: string;
  alt: string;
  fallback: string;
  title: string;
  artist: string;
};

const albums = [
  "https://i.scdn.co/image/ab6761610000e5ebd55c95ad400aed87da52daec",
  "https://c.saavncdn.com/artists/Nucleya_002_20241118064538_500x500.jpg",
  "https://i.scdn.co/image/ab67616d0000b273aacbfc6de7128a834757fea4",
  "https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8",
  "https://i.scdn.co/image/ab67616d0000b273627b5b17cb48f6e6956b842e",
];

const musicCards: MusicCardProps[] = [
  {
    image: "https://i.scdn.co/image/ab6761610000e5ebd55c95ad400aed87da52daec",
    alt: "Ed Sheeran",
    fallback: "ED",
    title: "Sapphire",
    artist: "Ed Sheeran",
  },
  {
    image:
      "https://c.saavncdn.com/artists/Nucleya_002_20241118064538_500x500.jpg",
    alt: "Nucleya",
    fallback: "NU",
    title: "Jamrock",
    artist: "Nucleya",
  },
  {
    image: "https://i.scdn.co/image/ab67616d0000b273aacbfc6de7128a834757fea4",
    alt: "Major Lazer",
    fallback: "ML",
    title: "Bumaye",
    artist: "Major Lazer",
  },
  {
    image: "https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8",
    alt: "DJ Snake",
    fallback: "DS",
    title: "Taki Taki",
    artist: "DJ Snake",
  },
  {
    image: "https://i.scdn.co/image/ab67616d0000b273627b5b17cb48f6e6956b842e",
    alt: "Arijit Singh",
    fallback: "AS",
    title: "Raabta",
    artist: "Arijit Singh",
  },
];

export default function WidgetDemo() {
  return (
    <AudioPlayerProvider>
      <Widget size="md" className="p-0">
        <WidgetContent>
          <div className="size-full">
            <div className="flex size-full flex-col items-center justify-between p-6">
              <WidgetHeader className="items-center justify-start gap-x-3">
                <Avatar className="size-full max-h-9 max-w-9 rounded-md">
                  <AvatarImage
                    src="https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
                    alt="Code Monkey"
                  />
                  <AvatarFallback>CM</AvatarFallback>
                </Avatar>
                <div className="space-y-0">
                  <Label className="text-sm">{exampleTrack.data.title}</Label>
                  <Label className="text-muted-foreground text-xs">
                    {exampleTrack.data.artist}
                  </Label>
                </div>
              </WidgetHeader>
              <WidgetContent className="w-full flex-col gap-1">
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
            </div>
          </div>
          <div className="flex size-full flex-col items-start justify-between">
            <ScrollArea className="size-full max-h-48 py-4 pe-6">
              {musicCards.map((el, i) => (
                <MusicCard key={i} {...el} />
              ))}
            </ScrollArea>
          </div>
        </WidgetContent>
      </Widget>
    </AudioPlayerProvider>
  );
}

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
}) => {
  return (
    <div className="group bg-secondary hover:bg-muted/50 mt-3 flex w-full items-center justify-start gap-2 rounded-md p-3 hover:cursor-pointer">
      <Avatar className="size-full max-h-9 max-w-9 rounded-md">
        <AvatarImage src={image} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className="space-y-0">
        <Label className="w-full truncate text-sm group-hover:cursor-pointer">
          {title}
        </Label>
        <Label className="text-muted-foreground text-xs group-hover:cursor-pointer">
          {artist}
        </Label>
      </div>
    </div>
  );
};
