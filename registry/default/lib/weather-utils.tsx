import {
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  SnowflakeIcon,
  SunIcon,
} from "lucide-react";
import type { JSX } from "react";

export function getWeatherIcon(
  code: number,
  size: string = "size-16",
  props: Record<string, string | number> = {},
): JSX.Element {
  if (code === 0)
    return <SunIcon className={size + " stroke-amber-300"} {...props} />;
  if (code >= 1 && code <= 3)
    return <CloudSunIcon className={size + " stroke-gray-400"} {...props} />;
  if (code >= 45 && code <= 48)
    return <CloudFogIcon className={size + " stroke-gray-400"} {...props} />;
  if (code >= 51 && code <= 67)
    return <CloudRainIcon className={size + " stroke-blue-400"} {...props} />;
  if (code >= 71 && code <= 77)
    return <SnowflakeIcon className={size + " stroke-blue-200"} {...props} />;
  if (code >= 80 && code <= 82)
    return <CloudRainIcon className={size + " stroke-blue-500"} {...props} />;
  if (code >= 95 && code <= 99)
    return (
      <CloudLightningIcon className={size + " stroke-purple-500"} {...props} />
    );
  return <SunIcon className={size + " stroke-amber-300"} {...props} />;
}

export function getSmallWeatherIcon(code: number): JSX.Element {
  if (code === 0) return <SunIcon className="stroke-muted-foreground size-6" />;
  if (code >= 1 && code <= 3)
    return <CloudSunIcon className="stroke-muted-foreground size-6" />;
  if (code >= 45 && code <= 48)
    return <CloudFogIcon className="stroke-muted-foreground size-6" />;
  if (code >= 51 && code <= 67)
    return <CloudRainIcon className="stroke-muted-foreground size-6" />;
  if (code >= 71 && code <= 77)
    return <SnowflakeIcon className="stroke-muted-foreground size-6" />;
  if (code >= 80 && code <= 82)
    return <CloudRainIcon className="stroke-muted-foreground size-6" />;
  if (code >= 95 && code <= 99)
    return <CloudLightningIcon className="stroke-muted-foreground size-6" />;
  return <SunIcon className="stroke-muted-foreground size-6" />;
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code >= 1 && code <= 3) return "Partly Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 82) return "Heavy Rain";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Clear Sky";
}
