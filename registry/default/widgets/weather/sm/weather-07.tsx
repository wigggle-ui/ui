import { MoveDownIcon, MoveUpIcon } from "lucide-react";

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

  const isLoading = isLoadingLocation || isLoadingWeather;

  const todayMax = weather?.daily?.temperatureMax[0];
  const todayMin = weather?.daily?.temperatureMin[0];

  const next5Hours =
    weather?.hourly.time.slice(0, 5).map((time, index) => ({
      temp: weather.hourly.temperature[index],
      code: weather.hourly.weatherCode[index],
    })) || [];

  if (isLoading) {
    return (
      <Widget design="mumbai" className="gap-6">
        <WidgetContent className="flex items-center justify-center">
          <Label className="animate-pulse">Loading...</Label>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget design="mumbai" className="gap-6">
      <WidgetHeader className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Label>{city || "Unknown"}</Label>
          <Label className="text-muted-foreground">
            Feels Like {weather?.feelsLike}&deg;
          </Label>
        </div>
        <WidgetTitle className="text-3xl">
          {weather?.temperature}&deg;
        </WidgetTitle>
      </WidgetHeader>
      <WidgetContent className="items-start">
        <div className="flex h-max w-full items-center justify-start">
          <MoveUpIcon
            fill="currentColor"
            className="mr-1 size-4"
            strokeWidth={4}
          />
          <Label>{todayMax}&deg;</Label>
        </div>
        <div className="flex w-full items-center justify-end">
          <MoveDownIcon
            fill="currentColor"
            className="mr-1 size-4"
            strokeWidth={4}
          />
          <Label>{todayMin}&deg;</Label>
        </div>
      </WidgetContent>
      <WidgetFooter className="bg-muted w-full rounded-xl">
        <div className="flex w-full items-center justify-between gap-1 p-2">
          {next5Hours.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {getWeatherIcon(h.code, "size-4")}
              <Label className="text-xs font-light">{h.temp}&deg;</Label>
            </div>
          ))}
        </div>
      </WidgetFooter>
    </Widget>
  );
}
