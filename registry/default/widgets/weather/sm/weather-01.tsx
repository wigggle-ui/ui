import { useLocation } from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { getWeatherIcon } from "@/registry/default/lib/weather-utils";
import { Label } from "@/registry/default/ui/label";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
} from "@/registry/default/ui/widget";

export default function WidgetDemo() {
  const { coordinates, city, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

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
      <WidgetContent className="flex-col gap-4">
        {weather &&
          getWeatherIcon(weather.weatherCode, "size-16", { strokeWidth: 2 })}
        <Label className="text-4xl">{weather?.temperature}&deg;</Label>
      </WidgetContent>
      <WidgetFooter className="justify-center">
        <Label className="text-lg font-semibold">
          {city || "Unknown Location"}
        </Label>
      </WidgetFooter>
    </Widget>
  );
}
