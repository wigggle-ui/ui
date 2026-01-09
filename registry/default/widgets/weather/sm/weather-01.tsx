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
  WidgetFooter,
} from "@/registry/default/ui/widget";

export default function WidgetDemo() {
  const { coordinates, city, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  const getWeatherIcon = (code: number) => {
    const props = { className: "size-10", strokeWidth: 2 };
    if (code === 0)
      return <SunIcon {...props} className="size-10 stroke-amber-400" />;
    if (code >= 1 && code <= 3)
      return <CloudSunIcon {...props} className="size-10 stroke-gray-400" />;
    if (code >= 45 && code <= 48)
      return <CloudFogIcon {...props} className="size-10 stroke-gray-400" />;
    if (code >= 51 && code <= 67)
      return <CloudRainIcon {...props} className="size-10 stroke-blue-400" />;
    if (code >= 71 && code <= 77)
      return <SnowflakeIcon {...props} className="size-10 stroke-blue-200" />;
    if (code >= 80 && code <= 82)
      return <CloudRainIcon {...props} className="size-10 stroke-blue-500" />;
    if (code >= 95 && code <= 99)
      return (
        <CloudLightningIcon {...props} className="size-10 stroke-purple-500" />
      );
    return <SunIcon {...props} className="size-10 stroke-amber-400" />;
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
      <WidgetContent className="flex-col gap-4">
        {weather && getWeatherIcon(weather.weatherCode)}
        <Label className="text-4xl">{weather?.temperature}&deg;</Label>
      </WidgetContent>
      <WidgetFooter className="justify-center">
        <Label className="text-lg font-semibold">
          {city || "Unknown Location"}
        </Label>
      </WidgetFooter>
    </Widget>
  );
}
