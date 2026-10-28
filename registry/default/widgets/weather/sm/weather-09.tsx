import { Label } from "@/components/ui/label";
import {
  DEFAULT_LOCATION,
  useLocation,
} from "@/registry/default/hooks/use-location";
import { useWeather } from "@/registry/default/hooks/use-weather";
import { getWeatherIcon } from "@/registry/default/lib/weather-utils";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const WidgetDemo = () => {
  const { coordinates, isLoading: isLoadingLocation } = useLocation();
  const { data: weather, isLoading: isLoadingWeather } = useWeather(
    coordinates?.lat ?? DEFAULT_LOCATION.lat,
    coordinates?.lon ?? DEFAULT_LOCATION.lon
  );

  const isLoading = isLoadingLocation || isLoadingWeather;

  const forecast =
    weather?.daily?.time.slice(0, 4).map((time, index) => ({
      day: getDayName(time),
      max: weather.daily.temperatureMax[index],
      min: weather.daily.temperatureMin[index],
      weatherCode: weather.daily.weatherCode[index],
    })) || [];

  if (isLoading) {
    return (
      <Widget design="mumbai">
        <WidgetContent className="flex items-center justify-center">
          <Label>
            <span className="animate-pulse">Loading...</span>
          </Label>
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
            <Label>{el.day}</Label>
            {getWeatherIcon(el.weatherCode, "", {
              className: "mx-auto size-5 text-muted-foreground",
            })}
            <Label className="mx-auto">{el.min}&deg;</Label>
            <Label className="mx-auto">{el.max}&deg;</Label>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
