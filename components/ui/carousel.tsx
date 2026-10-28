"use client";

import { cn } from "cn";
import useEmblaCarousel from "embla-carousel-react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

interface CarouselContextProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  opts?: CarouselOptions;
  orientation: "horizontal" | "vertical";
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

const noCleanup = (): undefined => undefined;

const useCarousel = () => {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
};

const Carousel = ({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & CarouselProps) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  );
  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

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

  const getScrollState = React.useCallback(() => {
    if (!api) {
      return "00";
    }

    return `${Number(api.canScrollPrev())}${Number(api.canScrollNext())}`;
  }, [api]);

  const scrollState = React.useSyncExternalStore(
    subscribe,
    getScrollState,
    () => "00"
  );
  const [canScrollPrevState, canScrollNextState] = scrollState;
  const canScrollPrev = canScrollPrevState === "1";
  const canScrollNext = canScrollNextState === "1";

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }
    setApi(api);
  }, [api, setApi]);

  const contextValue = React.useMemo(
    () => ({
      api,
      canScrollNext,
      canScrollPrev,
      carouselRef,
      opts,
      orientation,
      scrollNext,
      scrollPrev,
    }),
    [
      api,
      canScrollNext,
      canScrollPrev,
      carouselRef,
      opts,
      orientation,
      scrollNext,
      scrollPrev,
    ]
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <section
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        aria-label="Carousel"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  );
};

const CarouselContent = ({
  className,
  ...props
}: React.ComponentProps<"ul">) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <ul
        className={cn(
          "m-0 flex list-none p-0",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
};

const CarouselItem = ({ className, ...props }: React.ComponentProps<"li">) => {
  const { orientation } = useCarousel();

  return (
    <li
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
};

const CarouselPrevious = ({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
};

const CarouselNext = ({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
};

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
