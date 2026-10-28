"use client";

import { useEffect, useState } from "react";

import {
  Widget,
  WidgetContent,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const now = new Date();

const WidgetDemo = () => {
  const [time, setTime] = useState<Date>(now);

  useEffect(() => {
    const updateTime = () => setTime(new Date());

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const day = days[time.getDay()];

  const hours = time.getHours() % 12;
  const minutes = String(time.getMinutes()).padStart(2, "0");

  return (
    <Widget>
      <WidgetContent className="flex-col gap-2">
        <WidgetTitle className="text-2xl">{day}</WidgetTitle>
        <WidgetTitle className="text-5xl tracking-widest">
          {hours}:{minutes}
        </WidgetTitle>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
