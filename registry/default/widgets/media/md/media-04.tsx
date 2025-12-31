"use client";

import React from "react";
import { MusicIcon } from "lucide-react";

import {
  Widget,
  WidgetContent,
  WidgetHeader,
} from "@/registry/default/ui/widget";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/registry/default/lib/utils";

const albums = [
  "https://i.scdn.co/image/ab6761610000e5ebd55c95ad400aed87da52daec",
  "https://c.saavncdn.com/artists/Nucleya_002_20241118064538_500x500.jpg",
  "https://i.scdn.co/image/ab67616d0000b273aacbfc6de7128a834757fea4",
  "https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8",
  "https://i.scdn.co/image/ab67616d0000b273627b5b17cb48f6e6956b842e",
];

export default function WidgetDemo() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Widget size="md" design="mumbai">
      <WidgetHeader className="items-center justify-start gap-x-2">
        <MusicIcon className="size-5" />
        Top 100 in India
      </WidgetHeader>
      <WidgetContent className="h-max max-h-32">
        <div className="mx-auto">
          <Carousel
            setApi={setApi}
            className="w-full max-w-xs"
            opts={{ loop: true }}
          >
            <CarouselContent className="pb-4">
              {albums.map((image, index) => (
                <CarouselItem key={index} className={cn("basis-[33%]", {})}>
                  <img
                    src={image}
                    alt={`Album ${index + 1}`}
                    className={cn(
                      "aspect-square rounded-lg transition-transform duration-500",
                      {
                        "scale-[0.7]": index !== current - 1,
                      },
                    )}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="top-[calc(100%-1rem)] left-0 translate-y-0" />
            <CarouselNext className="top-[calc(100%-1rem)] right-0 translate-y-0" />
          </Carousel>
        </div>
      </WidgetContent>
    </Widget>
  );
}
