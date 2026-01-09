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
    const className = "size-5";
    if (code === 0)
      return <SunIcon className={`${className} stroke-amber-400`} />;
    if (code >= 1 && code <= 3)
      return <CloudSunIcon className={`${className} stroke-gray-400`} />;
    if (code >= 45 && code <= 48)
      return <CloudFogIcon className={`${className} stroke-gray-400`} />;
    if (code >= 51 && code <= 67)
      return <CloudRainIcon className={`${className} stroke-blue-400`} />;
    if (code >= 71 && code <= 77)
      return <SnowflakeIcon className={`${className} stroke-blue-200`} />;
    if (code >= 80 && code <= 82)
      return <CloudRainIcon className={`${className} stroke-blue-500`} />;
    if (code >= 95 && code <= 99)
      return (
        <CloudLightningIcon className={`${className} stroke-purple-500`} />
      );
    return <SunIcon className={`${className} stroke-amber-400`} />;
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
        {weather && getWeatherIcon(weather.weatherCode)}
      </WidgetHeader>
      <WidgetContent>
        <Label className="text-5xl">{weather?.temperature}&deg;</Label>
      </WidgetContent>
    </Widget>
  );
}
