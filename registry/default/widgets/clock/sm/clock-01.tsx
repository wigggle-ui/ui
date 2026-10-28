"use client";

import { useEffect, useState } from "react";

import {
  Widget,
  WidgetContent,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const formatTime = (value: number) => String(value).padStart(2, "0");

const WidgetDemo = () => {
  const [time, setTime] = useState<Date>(() => new Date(2000, 0, 1));

  useEffect(() => {
    const updateTime = () => setTime(new Date());

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12 || 12;
  const minutes = formatTime(time.getMinutes());

  return (
    <Widget>
      <WidgetContent className="flex-col gap-4">
        <WidgetTitle className="text-5xl tracking-widest">
          {hours}:{minutes}
        </WidgetTitle>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
