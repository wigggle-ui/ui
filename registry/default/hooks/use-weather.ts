import { useState, useEffect } from "react";

interface HourlyData {
  time: string[];
  temperature: number[];
  weatherCode: number[];
}

interface DailyData {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  weatherCode: number[];
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  chanceOfRain: number;
  weatherCode: number;
  isDay: boolean;
  hourly: HourlyData;
  daily: DailyData;
}

export function useWeather(lat: number | null, lon: number | null) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (lat === null || lon === null) return;

    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,is_day&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const result = await response.json();

        setData({
          temperature: result.current.temperature_2m,
          humidity: result.current.relative_humidity_2m,
          windSpeed: result.current.wind_speed_10m,
          feelsLike: result.current.apparent_temperature,
          chanceOfRain: result.current.precipitation,
          weatherCode: result.current.weather_code,
          isDay: result.current.is_day === 1,
          hourly: {
            time: result.hourly.time,
            temperature: result.hourly.temperature_2m,
            weatherCode: result.hourly.weather_code,
          },
          daily: {
            time: result.daily.time,
            temperatureMax: result.daily.temperature_2m_max,
            temperatureMin: result.daily.temperature_2m_min,
            weatherCode: result.daily.weather_code,
          },
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return { data, error, isLoading };
}
