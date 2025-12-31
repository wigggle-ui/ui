"use client";

import { XIcon } from "lucide-react";
import Image from "next/image";

import {
  Widget,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";
import { Label } from "@/registry/default/ui/label";
import { Button } from "@/registry/default/ui/button";

export default function WidgetDemo() {
  return (
    <Widget design="mumbai" className="relative justify-between gap-0">
      <Button
        variant="outline"
        size="icon-sm"
        className="absolute top-2 right-2 rounded-full"
      >
        <XIcon />
      </Button>
      <WidgetContent className="flex-col gap-2">
        <Image
          src="/assets/products/airpods-max.png"
          alt="Airpods Max"
          width={192}
          height={192}
          className="size-20"
        />
        <Label>Henil's AirPods Max</Label>
      </WidgetContent>
      <WidgetFooter>
        <Button variant="outline" className="w-full rounded-full">
          Connect
        </Button>
      </WidgetFooter>
    </Widget>
  );
}
