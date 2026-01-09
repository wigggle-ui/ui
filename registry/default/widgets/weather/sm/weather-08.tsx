import {
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  MoveDownIcon,
  MoveUpIcon,
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
  WidgetTitle,
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

  const todayMax = weather?.daily?.temperatureMax[0];
  const todayMin = weather?.daily?.temperatureMin[0];

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
      <WidgetTitle>{city || "Unknown"}</WidgetTitle>
      <WidgetContent className="flex items-center justify-center gap-2">
        {weather && getWeatherIcon(weather.weatherCode)}
        <Label className="text-5xl">{weather?.temperature}&deg;</Label>
      </WidgetContent>
      <WidgetFooter className="justify-start gap-3">
        <div className="flex items-center justify-start">
          <MoveDownIcon
            fill="currentColor"
            className="mr-1 size-4"
            strokeWidth={4}
          />
          <Label>{todayMin}&deg;</Label>
        </div>
        <div className="flex h-max items-center justify-start">
          <MoveUpIcon
            fill="currentColor"
            className="mr-1 size-4"
            strokeWidth={4}
          />
          <Label>{todayMax}&deg;</Label>
        </div>
      </WidgetFooter>
    </Widget>
  );
}
