import {
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  SnowflakeIcon,
  SunIcon,
} from "lucide-react";
import type { JSX } from "react";

export enum WeatherCode {
  // Clear
  CLEAR_SKY = 0,
  MAINLY_CLEAR = 1,
  PARTLY_CLOUDY = 2,
  OVERCAST = 3,

  // Fog
  FOG = 45,
  DEPOSITING_RIME_FOG = 48,

  // Drizzle
  DRIZZLE_LIGHT = 51,
  DRIZZLE_MODERATE = 53,
  DRIZZLE_DENSE = 55,

  // Freezing Drizzle
  FREEZING_DRIZZLE_LIGHT = 56,
  FREEZING_DRIZZLE_DENSE = 57,

  // Rain
  RAIN_SLIGHT = 61,
  RAIN_MODERATE = 63,
  RAIN_HEAVY = 65,

  // Freezing Rain
  FREEZING_RAIN_LIGHT = 66,
  FREEZING_RAIN_HEAVY = 67,

  // Snow
  SNOW_FALL_SLIGHT = 71,
  SNOW_FALL_MODERATE = 73,
  SNOW_FALL_HEAVY = 75,
  SNOW_GRAINS = 77,

  // Rain Showers
  RAIN_SHOWERS_SLIGHT = 80,
  RAIN_SHOWERS_MODERATE = 81,
  RAIN_SHOWERS_VIOLENT = 82,

  // Snow Showers
  SNOW_SHOWERS_SLIGHT = 85,
  SNOW_SHOWERS_HEAVY = 86,

  // Thunderstorm
  THUNDERSTORM_SLIGHT_MODERATE = 95,
  THUNDERSTORM_HAIL_SLIGHT = 96,
  THUNDERSTORM_HAIL_HEAVY = 99,
}

export function getWeatherIcon(
  code: number,
  size: string = "size-16",
  props: Record<string, string | number> = {},
): JSX.Element {
  if (code === WeatherCode.CLEAR_SKY)
    return <SunIcon className={size + " stroke-amber-300"} {...props} />;

  if (code >= WeatherCode.MAINLY_CLEAR && code <= WeatherCode.OVERCAST)
    return <CloudSunIcon className={size + " stroke-gray-400"} {...props} />;

  if (code >= WeatherCode.FOG && code <= WeatherCode.DEPOSITING_RIME_FOG)
    return <CloudFogIcon className={size + " stroke-gray-400"} {...props} />;

  if (
    code >= WeatherCode.DRIZZLE_LIGHT &&
    code <= WeatherCode.FREEZING_RAIN_HEAVY
  )
    return <CloudRainIcon className={size + " stroke-blue-400"} {...props} />;

  if (code >= WeatherCode.SNOW_FALL_SLIGHT && code <= WeatherCode.SNOW_GRAINS)
    return <SnowflakeIcon className={size + " stroke-blue-200"} {...props} />;

  if (
    code >= WeatherCode.RAIN_SHOWERS_SLIGHT &&
    code <= WeatherCode.RAIN_SHOWERS_VIOLENT
  )
    return <CloudRainIcon className={size + " stroke-blue-500"} {...props} />;

  if (
    code >= WeatherCode.THUNDERSTORM_SLIGHT_MODERATE &&
    code <= WeatherCode.THUNDERSTORM_HAIL_HEAVY
  )
    return (
      <CloudLightningIcon className={size + " stroke-purple-500"} {...props} />
    );

  return <SunIcon className={size + " stroke-amber-300"} {...props} />;
}

export function getSmallWeatherIcon(code: number): JSX.Element {
  if (code === WeatherCode.CLEAR_SKY)
    return <SunIcon className="stroke-muted-foreground size-6" />;

  if (code >= WeatherCode.MAINLY_CLEAR && code <= WeatherCode.OVERCAST)
    return <CloudSunIcon className="stroke-muted-foreground size-6" />;

  if (code >= WeatherCode.FOG && code <= WeatherCode.DEPOSITING_RIME_FOG)
    return <CloudFogIcon className="stroke-muted-foreground size-6" />;

  if (
    code >= WeatherCode.DRIZZLE_LIGHT &&
    code <= WeatherCode.FREEZING_RAIN_HEAVY
  )
    return <CloudRainIcon className="stroke-muted-foreground size-6" />;

  if (code >= WeatherCode.SNOW_FALL_SLIGHT && code <= WeatherCode.SNOW_GRAINS)
    return <SnowflakeIcon className="stroke-muted-foreground size-6" />;

  if (
    code >= WeatherCode.RAIN_SHOWERS_SLIGHT &&
    code <= WeatherCode.RAIN_SHOWERS_VIOLENT
  )
    return <CloudRainIcon className="stroke-muted-foreground size-6" />;

  if (
    code >= WeatherCode.THUNDERSTORM_SLIGHT_MODERATE &&
    code <= WeatherCode.THUNDERSTORM_HAIL_HEAVY
  )
    return <CloudLightningIcon className="stroke-muted-foreground size-6" />;

  return <SunIcon className="stroke-muted-foreground size-6" />;
}

export function getWeatherDescription(code: number): string {
  if (code === WeatherCode.CLEAR_SKY) return "Clear Sky";

  if (code >= WeatherCode.MAINLY_CLEAR && code <= WeatherCode.OVERCAST)
    return "Partly Cloudy";

  if (code >= WeatherCode.FOG && code <= WeatherCode.DEPOSITING_RIME_FOG)
    return "Foggy";

  if (
    code >= WeatherCode.DRIZZLE_LIGHT &&
    code <= WeatherCode.FREEZING_RAIN_HEAVY
  )
    return "Rainy";

  if (code >= WeatherCode.SNOW_FALL_SLIGHT && code <= WeatherCode.SNOW_GRAINS)
    return "Snowy";

  if (
    code >= WeatherCode.RAIN_SHOWERS_SLIGHT &&
    code <= WeatherCode.RAIN_SHOWERS_VIOLENT
  )
    return "Heavy Rain";

  if (
    code >= WeatherCode.THUNDERSTORM_SLIGHT_MODERATE &&
    code <= WeatherCode.THUNDERSTORM_HAIL_HEAVY
  )
    return "Thunderstorm";

  return "Clear Sky";
}
