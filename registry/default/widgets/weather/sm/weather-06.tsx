"use client";

import { DropletIcon, ThermometerIcon } from "lucide-react";
import * as React from "react";

import { Label } from "@/components/ui/label";
import {
  DEFAULT_LOCATION,
  useLocation,
} from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { getWeatherIcon } from "@/registry/default/lib/weather-utils";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => {
  const { coordinates, city, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? DEFAULT_LOCATION.lat,
    coordinates?.lon ?? DEFAULT_LOCATION.lon
  );
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: false,
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60_000);
    return () => clearInterval(interval);
  }, []);

  const isLoading = isLoadingLocation || isLoadingWeather;

  if (isLoading) {
    return (
      <Widget>
        <WidgetContent className="flex items-center justify-center">
          <Label>
            <span className="animate-pulse">Loading...</span>
          </Label>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget>
      <WidgetHeader>
        <WidgetTitle>{city || "Unknown"}</WidgetTitle>
        <WidgetTitle className="text-muted-foreground font-normal">
          {time}
        </WidgetTitle>
      </WidgetHeader>
      <WidgetContent>
        {weather && getWeatherIcon(weather.weatherCode, "size-9")}
      </WidgetContent>
      <WidgetFooter>
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-max w-full items-center justify-start">
            <ThermometerIcon className="text-muted-foreground mr-1 size-5" />
            <Label size="sm" variant="muted-foreground">
              {weather?.feelsLike}&deg;
            </Label>
          </div>
          <div className="flex h-max w-full items-center justify-start">
            <DropletIcon className="text-muted-foreground mr-1 size-5" />
            <Label size="sm" variant="muted-foreground">
              {weather?.humidity}%
            </Label>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Label size="xxxxl">{weather?.temperature}&deg;</Label>
        </div>
      </WidgetFooter>
    </Widget>
  );
};

export default WidgetDemo;
