import {
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  DropletsIcon,
  SnowflakeIcon,
  SunIcon,
  ThermometerIcon,
  WindIcon,
} from "lucide-react";

import { useLocation } from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { Label } from "@/registry/default/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

export default function WidgetDemo() {
  const { coordinates, city, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <SunIcon className="size-16 stroke-amber-300" />;
    if (code >= 1 && code <= 3)
      return <CloudSunIcon className="size-16 stroke-gray-400" />;
    if (code >= 45 && code <= 48)
      return <CloudFogIcon className="size-16 stroke-gray-400" />;
    if (code >= 51 && code <= 67)
      return <CloudRainIcon className="size-16 stroke-blue-400" />;
    if (code >= 71 && code <= 77)
      return <SnowflakeIcon className="size-16 stroke-blue-200" />;
    if (code >= 80 && code <= 82)
      return <CloudRainIcon className="size-16 stroke-blue-500" />;
    if (code >= 95 && code <= 99)
      return <CloudLightningIcon className="size-16 stroke-purple-500" />;
    return <SunIcon className="size-16 stroke-amber-300" />;
  };

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
      <WidgetContent>
        <div className="flex w-full flex-col items-center justify-center gap-3">
          {weather && getWeatherIcon(weather.weatherCode)}
          <div className="flex flex-col items-center justify-center gap-2">
            <Label className="text-3xl">{weather?.temperature}&deg;C</Label>
            <Label>{city || "Unknown Location"}</Label>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-5">
          <div className="flex w-full items-center justify-center gap-16">
            <InfoItem
              icon={WindIcon}
              label="Wind Speed"
              value={`${weather?.windSpeed} km/h`}
            />
            <InfoItem
              icon={ThermometerIcon}
              label="Feels like"
              value={`${weather?.feelsLike}\u00b0`}
            />
          </div>
          <div className="flex w-full items-center justify-center gap-16">
            <InfoItem
              icon={CloudRainIcon}
              label="Precipitation"
              value={`${weather?.chanceOfRain} mm`}
            />
            <InfoItem
              icon={DropletsIcon}
              label="Humidity"
              value={`${weather?.humidity}%`}
            />
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
}

type InfoItemProps = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
};

const InfoItem = (el: InfoItemProps) => {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <div className="space-y-2">
          <el.icon className="stroke-muted-foreground size-6" />
          <Label className="text-base font-normal">{el.value}</Label>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <Label className="text-sm font-normal">{el.label}</Label>
      </TooltipContent>
    </Tooltip>
  );
};
