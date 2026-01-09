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
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

export default function WidgetDemo() {
  const { coordinates, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  const getWeatherIcon = (code: number) => {
    const props = { className: "mx-auto size-4" };
    if (code === 0)
      return (
        <SunIcon {...props} className="mx-auto size-4 stroke-yellow-500" />
      );
    if (code >= 1 && code <= 3)
      return (
        <CloudSunIcon {...props} className="mx-auto size-4 stroke-gray-400" />
      );
    if (code >= 45 && code <= 48)
      return (
        <CloudFogIcon {...props} className="mx-auto size-4 stroke-gray-400" />
      );
    if (code >= 51 && code <= 67)
      return (
        <CloudRainIcon {...props} className="mx-auto size-4 stroke-blue-400" />
      );
    if (code >= 71 && code <= 77)
      return (
        <SnowflakeIcon {...props} className="mx-auto size-4 stroke-blue-200" />
      );
    if (code >= 80 && code <= 82)
      return (
        <CloudRainIcon {...props} className="mx-auto size-4 stroke-blue-500" />
      );
    if (code >= 95 && code <= 99)
      return (
        <CloudLightningIcon
          {...props}
          className="mx-auto size-4 stroke-purple-500"
        />
      );
    return <SunIcon {...props} className="mx-auto size-4 stroke-yellow-500" />;
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const forecast =
    weather?.daily?.time.slice(0, 4).map((time, index) => ({
      day: getDayName(time),
      min: weather.daily.temperatureMin[index],
      max: weather.daily.temperatureMax[index],
      weatherCode: weather.daily.weatherCode[index],
    })) || [];

  if (isLoading) {
    return (
      <Widget design="mumbai">
        <WidgetContent className="flex items-center justify-center">
          <Label className="animate-pulse">Loading...</Label>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget design="mumbai">
      <WidgetContent className="mt-1.5 flex w-full flex-col gap-2">
        {forecast.map((el, index) => (
          <div
            key={index}
            className="grid w-full grid-cols-4 items-center gap-3 border-b pb-2 last:border-none"
          >
            <Label className="text-muted-foreground text-base">{el.day}</Label>
            {getWeatherIcon(el.weatherCode)}
            <Label className="mx-aut text-base">{el.min}&deg;</Label>
            <Label className="mx-auto text-base">{el.max}&deg;</Label>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
}
