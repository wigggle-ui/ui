import { useLocation } from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { Label } from "@/registry/default/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

export default function WidgetDemo() {
  const { coordinates, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 80 && code <= 82) return "Heavy Rain";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Clear Sky";
  };

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
