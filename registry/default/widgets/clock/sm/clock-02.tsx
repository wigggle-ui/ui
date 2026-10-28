"use client";

import { useEffect, useState } from "react";

import {
  Widget,
  WidgetContent,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const now = new Date();

const formatTime = (value: number) => String(value).padStart(2, "0");

const WidgetDemo = () => {
  const [time, setTime] = useState<Date>(now);

  useEffect(() => {
    const updateTime = () => setTime(new Date());

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12 || 12;
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  return (
    <Widget>
      <WidgetContent className="flex-col gap-4">
        <WidgetTitle className="text-4xl tracking-widest">
          {hours}:{minutes}:{seconds}
        </WidgetTitle>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
