"use client";

import { MoveDownIcon, MoveUpIcon } from "lucide-react";

import { Text } from "@/components/ui/text";
import {
  DEFAULT_LOCATION,
  useLocation,
} from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { getWeatherIcon } from "@/registry/default/lib/weather-utils";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => {
  const { coordinates, city, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? DEFAULT_LOCATION.lat,
    coordinates?.lon ?? DEFAULT_LOCATION.lon
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
          <Text>
            <span className="animate-pulse">Loading...</span>
          </Text>
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
            <Text size="xxxxl">{weather?.temperature}&deg;</Text>
          </div>
          <Text variant="muted-foreground">
            Feels Like {weather?.feelsLike}&deg;
          </Text>
        </div>
      </WidgetHeader>
      <WidgetContent className="items-end">
        <div className="flex h-max w-full items-center justify-start">
          <MoveUpIcon
            fill="currentColor"
            className="mr-1 size-4"
            strokeWidth={4}
          />
          <Text>{highTemp === null ? "--" : `${highTemp}\u00B0`}</Text>
        </div>
        <div className="flex w-full items-center justify-end">
          <MoveDownIcon
            fill="currentColor"
            className="mr-1 size-4"
            strokeWidth={4}
          />
          <Text>{lowTemp === null ? "--" : `${lowTemp}\u00B0`}</Text>
        </div>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
