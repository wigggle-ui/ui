import {
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  DropletIcon,
  SnowflakeIcon,
  SunIcon,
  ThermometerIcon,
} from "lucide-react";
import * as React from "react";

import { useLocation } from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
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
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
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

  const getWeatherIcon = (code: number) => {
    const props = { className: "size-9" };
    if (code === 0)
      return (
        <SunIcon {...props} className="size-9 fill-amber-500 text-amber-500" />
      );
    if (code >= 1 && code <= 3)
      return <CloudSunIcon {...props} className="size-9 text-gray-400" />;
    if (code >= 45 && code <= 48)
      return <CloudFogIcon {...props} className="size-9 text-gray-400" />;
    if (code >= 51 && code <= 67)
      return <CloudRainIcon {...props} className="size-9 text-blue-400" />;
    if (code >= 71 && code <= 77)
      return <SnowflakeIcon {...props} className="size-9 text-blue-200" />;
    if (code >= 80 && code <= 82)
      return <CloudRainIcon {...props} className="size-9 text-blue-500" />;
    if (code >= 95 && code <= 99)
      return (
        <CloudLightningIcon {...props} className="size-9 text-purple-500" />
      );
    return <SunIcon {...props} className="size-9 text-amber-500" />;
  };

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
        {weather && getWeatherIcon(weather.weatherCode)}
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
