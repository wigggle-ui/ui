"use client";

import { XIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => (
  <Widget design="mumbai" className="relative justify-between gap-0">
    <Button
      variant="outline"
      size="icon-sm-circle"
      className="absolute top-2 right-2"
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
      <Label>Henil&apos;s AirPods Max</Label>
    </WidgetContent>
    <WidgetFooter>
      <Button size="icon-circle" variant="outline" className="w-full">
        Connect
      </Button>
    </WidgetFooter>
  </Widget>
);

export default WidgetDemo;
