"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const WidgetDemo = () => {
  const [time, setTime] = useState<Date>(() => new Date(2000, 0, 1));

  useEffect(() => {
    const updateTime = () => setTime(new Date());

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time ? time.getHours() % 12 : 0;
  const minutes = time?.getMinutes() ?? 0;
  const seconds = time?.getSeconds() ?? 0;

  const hoursDegrees = ((hours + minutes / 60) / 12) * 360;
  const minutesDegrees = ((minutes + seconds / 60) / 60) * 360;
  const secondsDegrees = (seconds / 60) * 360;

  return (
    <Widget>
      <WidgetContent>
        <div className="relative size-22">
          {/* Hours Hand */}
          <div
            className="bg-primary dark:bg-primary absolute bottom-1/2 left-1/2 h-10 w-1 origin-bottom -translate-x-1/2 rotate-(--rotation) rounded-full"
            style={{ "--rotation": `${hoursDegrees}deg` } as CSSProperties}
          />
          {/* Minutes Hand */}
          <div
            className="bg-muted-foreground dark:bg-ring absolute bottom-1/2 left-1/2 h-15 w-1 origin-bottom -translate-x-1/2 rotate-(--rotation) rounded-full"
            style={{ "--rotation": `${minutesDegrees}deg` } as CSSProperties}
          />
          {/* Seconds Hand */}
          <div
            className="bg-destructive absolute bottom-1/2 left-1/2 h-12 w-0.5 origin-bottom -translate-x-1/2 rotate-(--rotation) rounded-full"
            style={{ "--rotation": `${secondsDegrees}deg` } as CSSProperties}
          />
          <div className="bg-primary dark:bg-primary absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
