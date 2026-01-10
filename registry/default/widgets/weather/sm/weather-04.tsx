import { useLocation } from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { getWeatherDescription } from "@/registry/default/lib/weather-utils";
import { Label } from "@/registry/default/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

export default function WidgetDemo() {
  const { coordinates, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <Widget>
        <WidgetContent className="mx-auto flex-col items-center justify-center">
          <Label className="animate-pulse">Loading...</Label>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget>
      <WidgetContent className="mx-auto flex-col items-start">
        <Label className="text-6xl">{weather?.temperature}&deg;</Label>
        <Label className="text-2xl">
          {weather ? getWeatherDescription(weather.weatherCode) : "Sunny"}
        </Label>
        <Label>{currentDate}</Label>
      </WidgetContent>
    </Widget>
  );
}
