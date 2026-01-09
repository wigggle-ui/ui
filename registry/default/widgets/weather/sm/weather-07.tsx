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

  const getWeatherIcon = (code: number, size: string = "size-4") => {
    const props = { className: `${size}` };
    if (code === 0)
      return (
        <SunIcon
          {...props}
          className={`${size} fill-amber-500 text-amber-500`}
        />
      );
    if (code >= 1 && code <= 3)
      return <CloudSunIcon {...props} className={`${size} text-gray-400`} />;
    if (code >= 45 && code <= 48)
      return <CloudFogIcon {...props} className={`${size} text-gray-400`} />;
    if (code >= 51 && code <= 67)
      return <CloudRainIcon {...props} className={`${size} text-blue-400`} />;
    if (code >= 71 && code <= 77)
      return <SnowflakeIcon {...props} className={`${size} text-blue-200`} />;
    if (code >= 80 && code <= 82)
      return <CloudRainIcon {...props} className={`${size} text-blue-500`} />;
    if (code >= 95 && code <= 99)
      return (
        <CloudLightningIcon {...props} className={`${size} text-purple-500`} />
      );
    return <SunIcon {...props} className={`${size} text-amber-500`} />;
  };

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
        <div className="flex w-full items-center justify-between gap-3 p-2">
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
