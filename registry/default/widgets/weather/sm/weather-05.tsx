import { MoveDownIcon, MoveUpIcon } from "lucide-react";

import { useLocation } from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { getWeatherIcon } from "@/registry/default/lib/weather-utils";
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

  const highTemp = weather?.hourly?.temperature
    ? Math.max(...weather.hourly.temperature)
    : null;
  const lowTemp = weather?.hourly?.temperature
    ? Math.min(...weather.hourly.temperature)
    : null;

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
      <WidgetHeader className="flex-col gap-3">
        <WidgetTitle>{city || "Unknown"}</WidgetTitle>
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            {weather && getWeatherIcon(weather.weatherCode, "size-8")}
            <Label className="text-4xl">{weather?.temperature}&deg;</Label>
          </div>
          <Label className="text-muted-foreground">
            Feels Like {weather?.feelsLike}&deg;
          </Label>
        </div>
      </WidgetHeader>
      <WidgetContent className="items-end">
        <div className="flex h-max w-full items-center justify-start">
          <MoveUpIcon
            fill="currentColor"
            className="mr-1 size-4"
            strokeWidth={4}
          />
          <Label>{highTemp !== null ? `${highTemp}\u00b0` : "--"}</Label>
        </div>
        <div className="flex w-full items-center justify-end">
          <MoveDownIcon
            fill="currentColor"
            className="mr-1 size-4"
            strokeWidth={4}
          />
          <Label>{lowTemp !== null ? `${lowTemp}\u00b0` : "--"}</Label>
        </div>
      </WidgetContent>
    </Widget>
  );
}
