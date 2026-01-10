import { useLocation } from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { getWeatherIcon } from "@/registry/default/lib/weather-utils";
import { Label } from "@/registry/default/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

export default function WidgetDemo() {
  const { coordinates, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const forecast =
    weather?.daily?.time.slice(0, 4).map((time, index) => ({
      day: getDayName(time),
      min: weather.daily.temperatureMin[index],
      max: weather.daily.temperatureMax[index],
      weatherCode: weather.daily.weatherCode[index],
    })) || [];

  if (isLoading) {
    return (
      <Widget design="mumbai">
        <WidgetContent className="flex items-center justify-center">
          <Label className="animate-pulse">Loading...</Label>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget design="mumbai">
      <WidgetContent className="mt-1.5 flex w-full flex-col gap-2">
        {forecast.map((el, index) => (
          <div
            key={index}
            className="grid w-full grid-cols-4 items-center gap-3 border-b pb-2 last:border-none"
          >
            <Label className="text-muted-foreground text-base">{el.day}</Label>
            {getWeatherIcon(el.weatherCode, "size-4", { className: "mx-auto" })}
            <Label className="mx-aut text-base">{el.min}&deg;</Label>
            <Label className="mx-auto text-base">{el.max}&deg;</Label>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
}
