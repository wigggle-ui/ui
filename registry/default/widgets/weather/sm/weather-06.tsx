import { DropletIcon, ThermometerIcon } from "lucide-react";
import * as React from "react";

import {
  DEFAULT_LOCATION,
  useLocation,
} from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { getWeatherIcon } from "@/registry/default/lib/weather-utils";
import { Label } from "@/registry/default/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

export default function WidgetDemo() {
  const { coordinates, city, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? DEFAULT_LOCATION.lat,
    coordinates?.lon ?? DEFAULT_LOCATION.lon,
  );
  const [time, setTime] = React.useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const isLoading = isLoadingLocation || isLoadingWeather;

  if (isLoading) {
    return (
      <Widget>
        <WidgetContent className="flex items-center justify-center">
          <Label className="animate-pulse">Loading...</Label>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget>
      <WidgetHeader>
        <WidgetTitle>{city || "Unknown"}</WidgetTitle>
        <WidgetTitle className="font-normal">{time}</WidgetTitle>
      </WidgetHeader>
      <WidgetContent>
        {weather && getWeatherIcon(weather.weatherCode, "size-9")}
      </WidgetContent>
      <WidgetFooter>
        <div className="flex flex-col items-center">
          <div className="flex h-max w-full items-center justify-start">
            <ThermometerIcon className="mr-1 size-5" />
            <Label>{weather?.feelsLike}&deg;</Label>
          </div>
          <div className="flex h-max w-full items-center justify-start">
            <DropletIcon className="mr-1 size-5" />
            <Label>{weather?.humidity}%</Label>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Label className="text-4xl">{weather?.temperature}&deg;</Label>
        </div>
      </WidgetFooter>
    </Widget>
  );
}
