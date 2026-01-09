import {
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  SnowflakeIcon,
  SunIcon,
} from "lucide-react";

import { useLocation } from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { Label } from "@/registry/default/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
} from "@/registry/default/ui/widget";

export default function WidgetDemo() {
  const { coordinates, city, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <SunIcon className="size-10 stroke-amber-400" />;
    if (code >= 1 && code <= 3)
      return <CloudSunIcon className="size-10 stroke-gray-400" />;
    if (code >= 45 && code <= 48)
      return <CloudFogIcon className="size-10 stroke-gray-400" />;
    if (code >= 51 && code <= 67)
      return <CloudRainIcon className="size-10 stroke-blue-400" />;
    if (code >= 71 && code <= 77)
      return <SnowflakeIcon className="size-10 stroke-blue-200" />;
    if (code >= 80 && code <= 82)
      return <CloudRainIcon className="size-10 stroke-blue-500" />;
    if (code >= 95 && code <= 99)
      return <CloudLightningIcon className="size-10 stroke-purple-500" />;
    return <SunIcon className="size-10 stroke-amber-400" />;
  };

  const getSmallWeatherIcon = (code: number) => {
    // Reuse specific icons but smaller size
    if (code === 0)
      return <SunIcon className="stroke-muted-foreground size-6" />;
    if (code >= 1 && code <= 3)
      return <CloudSunIcon className="stroke-muted-foreground size-6" />;
    if (code >= 45 && code <= 48)
      return <CloudFogIcon className="stroke-muted-foreground size-6" />;
    if (code >= 51 && code <= 67)
      return <CloudRainIcon className="stroke-muted-foreground size-6" />;
    if (code >= 71 && code <= 77)
      return <SnowflakeIcon className="stroke-muted-foreground size-6" />;
    if (code >= 80 && code <= 82)
      return <CloudRainIcon className="stroke-muted-foreground size-6" />;
    if (code >= 95 && code <= 99)
      return <CloudLightningIcon className="stroke-muted-foreground size-6" />;
    return <SunIcon className="stroke-muted-foreground size-6" />;
  };

  // Get next 6 hours including current or starting from now
  const next6Hours =
    weather?.hourly.time.slice(0, 6).map((time, index) => {
      const date = new Date(time);
      const hour = date.getHours();
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;

      return {
        time: `${hour12} ${ampm}`,
        temp: weather.hourly.temperature[index],
        weatherCode: weather.hourly.weatherCode[index],
      };
    }) || [];

  if (isLoading) {
    return (
      <Widget size="md">
        <WidgetContent>
          <div className="flex w-full items-center justify-center">
            <Label className="animate-pulse">Loading weather data...</Label>
          </div>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget size="md">
      <WidgetHeader className="items-start">
        <div className="flex flex-col items-start">
          <Label>{city || "Unknown Location"}</Label>
          <Label className="text-4xl">{weather?.temperature}&deg;</Label>
        </div>
        <div className="flex flex-col items-start">
          {weather && getWeatherIcon(weather.weatherCode)}
        </div>
      </WidgetHeader>
      <WidgetContent className="mt-4 grid w-full grid-cols-6 items-end gap-6">
        {next6Hours.map((el, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <Label className="text-muted-foreground text-xs">{el.time}</Label>
            <Label>{getSmallWeatherIcon(el.weatherCode)}</Label>
            <Label className="text-lg">{el.temp}&deg;</Label>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
}
