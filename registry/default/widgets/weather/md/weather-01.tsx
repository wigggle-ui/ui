"use client";

import {
  CloudRainIcon,
  DropletsIcon,
  ThermometerIcon,
  WindIcon,
} from "lucide-react";

import { Text } from "@/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DEFAULT_LOCATION,
  useLocation,
} from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { getWeatherIcon } from "@/registry/default/lib/weather-utils";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

interface InfoItemProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}

const InfoItem = (el: InfoItemProps) => (
  <Tooltip delayDuration={300}>
    <TooltipTrigger asChild>
      <div className="flex w-full flex-col items-center justify-center space-y-2">
        <el.icon className="stroke-muted-foreground size-6" />
        <Text>{el.value}</Text>
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <Text size="sm" variant="background">
        {el.label}
      </Text>
    </TooltipContent>
  </Tooltip>
);

const WidgetDemo = () => {
  const { coordinates, city, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? DEFAULT_LOCATION.lat,
    coordinates?.lon ?? DEFAULT_LOCATION.lon
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

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
      <WidgetContent>
        <div className="flex w-full flex-col items-center justify-center gap-3">
          {weather && getWeatherIcon(weather.weatherCode)}
          <div className="flex flex-col items-center justify-center gap-2">
            <Text size="xxxl">{weather?.temperature}&deg;C</Text>
            <Text>{city || "Unknown Location"}</Text>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 items-center gap-5">
          <InfoItem
            icon={WindIcon}
            label="Wind Speed"
            value={`${weather?.windSpeed} km/h`}
          />
          <InfoItem
            icon={ThermometerIcon}
            label="Feels like"
            value={`${weather?.feelsLike}\u00B0`}
          />
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
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
