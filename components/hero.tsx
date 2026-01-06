"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Courier_Prime } from "next/font/google";

const courier = Courier_Prime({
  weight: ["400"],
  subsets: ["latin"],
});

import { Button } from "@/registry/default/ui/button";
import GetStarted from "@/components/get-started";
import { Item, ItemContent, ItemTitle } from "@/registry/default/ui/item";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

import Calendar01 from "@/registry/default/widgets/calendar/sm/calendar-01";
import Clock05 from "@/registry/default/widgets/clock/sm/clock-05";
import Sports02 from "@/registry/default/widgets/sports/sm/sports-02";
import Stocks01 from "@/registry/default/widgets/stocks/sm/stock-01";
import Weather07 from "@/registry/default/widgets/weather/sm/weather-07";
import Weather09 from "@/registry/default/widgets/weather/sm/weather-09";

import Stocks04 from "@/registry/default/widgets/stocks/sm/stock-04";
import Sports05 from "@/registry/default/widgets/sports/sm/sports-05";
import Clock12 from "@/registry/default/widgets/clock/sm/clock-12";
import Calendar04 from "@/registry/default/widgets/calendar/sm/calendar-04";
import Clock07 from "@/registry/default/widgets/clock/sm/clock-07";
import Weather04 from "@/registry/default/widgets/weather/sm/weather-04";
import { useCopy } from "@/hooks/use-copy";

export default function Hero() {
  const { copied, copy } = useCopy();
  const widgets = useMemo(
    () => [
      <Calendar01 key="cal01" />,
      <Sports02 key="sport02" />,
      <Clock05 key="clock05" />,
      <Stocks01 key="stocks01" />,
      <Weather07 key="weather07" />,
      <Clock12 key="clock12" />,
      <Stocks04 key="stocks04a" />,
      <Weather09 key="weather09" />,
      <Sports05 key="sports05" />,
      <Clock07 key="clock07" />,
      <Calendar04 key="calendar04" />,
      <Weather04 key="weather04" />,
    ],
    [],
  );

  const [mounted, setMounted] = useState(false);
  const [randomOffsets, setRandomOffsets] = useState<number[][]>([]);

  useEffect(() => {
    setMounted(true);
    setRandomOffsets(
      widgets.map(() => [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
      ]),
    );
  }, [widgets]);

  return (
    <div>
      <div className="relative z-10 hidden h-[700px] w-full items-center justify-start overflow-hidden perspective-distant xl:flex xl:flex-col">
        <div className="flex w-full flex-col items-center justify-center gap-5">
          <h1 className="text-foreground text-4xl/[1.1] font-semibold md:text-5xl/[1.1]">
            The first ever collection of Widgets for the Web.
          </h1>
          <p className="text-muted-foreground text-lg">
            An open-source curated collection of copy-paste widgets for your
            next project.
          </p>
          <div className="mx-auto flex w-max gap-x-3">
            <GetStarted />
            <Button variant="ghost" asChild>
              <Link href="/widgets">View Widgets</Link>
            </Button>
          </div>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Item
                  variant="outline"
                  className="border-foreground/30 px-4 py-2"
                  asChild
                >
                  <Button
                    aria-label={copied ? "Copied" : "Copy command"}
                    onClick={() =>
                      copy("npx shadcn@latest add @wigggleui/widget")
                    }
                    variant="ghost"
                    className="hover:cursor-pointer"
                  >
                    <ItemContent>
                      <ItemTitle className={`${courier.className} text-sm`}>
                        npx shadcn@latest add @wigggleui/widget
                      </ItemTitle>
                    </ItemContent>
                  </Button>
                </Item>
              </TooltipTrigger>
              <TooltipContent className="text-muted-foreground px-2 py-1 text-xs">
                Click to Copy
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {mounted && (
          <div className="mt-12 grid grid-cols-6 gap-8">
            {widgets.map((widget, i) => (
              <div
                key={i}
                className="animate-depth-in h-48 w-48 rounded-lg"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  transform: `translate(${randomOffsets[i]?.[0] || 0}px, ${
                    randomOffsets[i]?.[1] || 0
                  }px)`,
                }}
              >
                {widget}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 flex w-full flex-col gap-5 text-center xl:hidden">
        <h1 className="text-foreground text-4xl/[1.1] font-semibold md:text-5xl/[1.1]">
          The first ever collection of Widgets for the Web.
        </h1>
        <p className="text-muted-foreground text-lg">
          An open-source curated collection of copy-paste widgets for your next
          project.
        </p>
        <div className="mx-auto flex w-max gap-x-3">
          <GetStarted />
          <Button variant="ghost" asChild>
            <Link href="/widgets">View Widgets</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
