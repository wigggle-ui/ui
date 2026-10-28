"use client";

import { cn } from "cn";
import { MusicIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
} from "@/registry/default/ui/widget";

const albums = [
  "https://i.scdn.co/image/ab6761610000e5ebd55c95ad400aed87da52daec",
  "https://c.saavncdn.com/artists/Nucleya_002_20241118064538_500x500.jpg",
  "https://i.scdn.co/image/ab67616d0000b273aacbfc6de7128a834757fea4",
  "https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8",
  "https://i.scdn.co/image/ab67616d0000b273627b5b17cb48f6e6956b842e",
];

const noCleanup = (): undefined => undefined;

const WidgetDemo = () => {
  const [api, setApi] = React.useState<CarouselApi>();

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (!api) {
        return noCleanup;
      }

      api.on("reInit", onStoreChange);
      api.on("select", onStoreChange);

      return () => {
        api.off("reInit", onStoreChange);
        api.off("select", onStoreChange);
      };
    },
    [api]
  );
  const getCurrent = React.useCallback(
    () => api?.selectedScrollSnap() ?? 0,
    [api]
  );
  const current =
    React.useSyncExternalStore(subscribe, getCurrent, () => 0) + 1;

  return (
    <Widget className="relative gap-4" size="md" design="mumbai">
      <WidgetHeader className="items-center justify-start gap-x-2">
        <MusicIcon className="size-5" />
        Top 100 in India
      </WidgetHeader>
      <WidgetContent className="h-full items-start">
        <Carousel
          setApi={setApi}
          className="w-full max-w-xs"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {albums.map((image, index) => (
              <CarouselItem key={index} className={cn("basis-[33%]", {})}>
                <Image
                  width={90}
                  height={90}
                  src={image}
                  alt={`Album ${index + 1}`}
                  className={cn(
                    "aspect-square rounded-lg transition-transform duration-500",
                    {
                      "scale-[0.7]": index !== current - 1,
                    }
                  )}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-[calc(100%-0rem)] -left-5 translate-y-0" />
          <CarouselNext className="absolute top-[calc(100%-0rem)] -right-5 translate-y-0" />
        </Carousel>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
