import { MoveUpRight, PlayCircle, Newspaper } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/registry/default/ui/icons";

import { TestimonialItem } from "@/config/testimonials";

export const TweetCard = ({ item }: { item: TestimonialItem }) => (
  <Card className="bg-background h-full border-zinc-200 transition-colors hover:border-blue-500/50 dark:border-zinc-800">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-start justify-start gap-3">
        <Avatar className="size-10 border">
          <AvatarImage
            src={
              item.authorAvatar ??
              "https://avatars.githubusercontent.com/u/38186373?v=4"
            }
          />
          <AvatarFallback>{item.author?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-start">
          <span className="text-sm font-semibold">{item.author}</span>
          <span className="text-muted-foreground text-sm">{item.handle}</span>
        </div>
      </div>
      <Icons.X className="size-5 text-blue-400" />
    </CardHeader>
    <CardContent>
      <p className="text-lg leading-relaxed">{item.content}</p>
    </CardContent>
  </Card>
);

export const YouTubeCard = ({ item }: { item: TestimonialItem }) => (
  <Card className="group relative h-full overflow-hidden border-zinc-200 dark:border-zinc-800">
    <div
      className={`absolute inset-0 ${item.thumbnailColor} opacity-20 transition-opacity group-hover:opacity-30`}
    />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-start justify-center gap-3">
        <Avatar className="size-10 border">
          <AvatarImage
            src={
              item.authorAvatar ??
              "https://avatars.githubusercontent.com/u/38186373?v=4"
            }
          />
          <AvatarFallback>{item.author?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-start">
          <span className="text-sm font-semibold">{item.author}</span>
          <span className="text-muted-foreground text-sm">{item.role}</span>
        </div>
      </div>
      <Icons.youtube className="size-7 text-blue-400" />
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-lg leading-relaxed">{item.content}</p>
      <Button variant="outline" className="w-fit gap-2">
        Watch Video
        <PlayCircle className="h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

export const ArticleCard = ({ item }: { item: TestimonialItem }) => (
  <Card className="h-full border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
    <CardHeader>
      <div className="mb-2 flex items-center justify-between">
        <div className="bg-background flex items-center gap-2 rounded-full border px-2 py-1 text-sm font-medium">
          <Newspaper className="h-3 w-3" />
          {item.source}
        </div>
        <MoveUpRight className="text-muted-foreground size-5" />
      </div>
      <h3 className="text-lg leading-tight font-semibold">{item.title}</h3>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-base">{item.desc}</p>
    </CardContent>
  </Card>
);
