"use client";

import { Text } from "@/components/ui/text";
import {
  DEFAULT_LOCATION,
  useLocation,
} from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import {
  getSmallWeatherIcon,
  getWeatherIcon,
} from "@/registry/default/lib/weather-utils";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
} from "@/registry/default/ui/widget";

const WidgetDemo = () => {
  const { coordinates, city, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? DEFAULT_LOCATION.lat,
    coordinates?.lon ?? DEFAULT_LOCATION.lon
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  // Get next 6 hours including current or starting from now
  const next6Hours =
    weather?.hourly.time.slice(0, 6).map((time, index) => {
      const date = new Date(time);
      const hour = date.getHours();
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;

      return {
        temp: weather.hourly.temperature[index],
        time: `${hour12} ${ampm}`,
        weatherCode: weather.hourly.weatherCode[index],
      };
    }) || [];

  if (isLoading) {
    return (
      <Widget size="md">
        <WidgetContent>
          <div className="flex w-full items-center justify-center">
            <Text>
              <span className="animate-pulse">Loading weather data...</span>
            </Text>
          </div>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget size="md">
      <WidgetHeader className="items-start">
        <div className="flex flex-col items-start">
          <Text>{city || "Unknown Location"}</Text>
          <Text size="xxxxl">{weather?.temperature}&deg;</Text>
        </div>
        <div className="flex flex-col items-start">
          {weather && getWeatherIcon(weather.weatherCode)}
        </div>
      </WidgetHeader>
      <WidgetContent className="mt-4 grid w-full grid-cols-6 items-end gap-6">
        {next6Hours.map((el, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <Text size="xs" variant="muted-foreground">
              {el.time}
            </Text>
            <Text>{getSmallWeatherIcon(el.weatherCode)}</Text>
            <Text size="lg">{el.temp}&deg;</Text>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
