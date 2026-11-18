"use client";

import { Text } from "@/components/ui/text";
import {
  DEFAULT_LOCATION,
  useLocation,
} from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { getWeatherDescription } from "@/registry/default/lib/weather-utils";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const date = new Date();

const currentDate = date.toLocaleDateString("en-US", {
  day: "numeric",
  month: "short",
  weekday: "short",
});

const WidgetDemo = () => {
  const { coordinates, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? DEFAULT_LOCATION.lat,
    coordinates?.lon ?? DEFAULT_LOCATION.lon
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  if (isLoading) {
    return (
      <Widget>
        <WidgetContent className="mx-auto flex-col items-center justify-center">
          <Text>
            <span className="animate-pulse">Loading...</span>
          </Text>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget>
      <WidgetContent className="mx-auto flex-col items-start">
        <Text weight="medium" size="xxxxl">
          {weather?.temperature}&deg;
        </Text>
        <Text size="xxl" weight="light">
          {weather ? getWeatherDescription(weather.weatherCode) : "Sunny"}
        </Text>
        <Text weight="light">{currentDate}</Text>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
