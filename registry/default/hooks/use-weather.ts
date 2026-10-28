"use client";

import { useEffect, useState } from "react";

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

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

type WeatherResult = { data: WeatherData } | { error: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every(isFiniteNumber);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every((item: unknown) => typeof item === "string");

const isOpenMeteoResponse = (value: unknown): value is OpenMeteoResponse => {
  if (!isRecord(value)) {
    return false;
  }

  const { current, daily, hourly } = value;
  if (!isRecord(current) || !isRecord(daily) || !isRecord(hourly)) {
    return false;
  }

  return (
    isFiniteNumber(current.temperature_2m) &&
    isFiniteNumber(current.relative_humidity_2m) &&
    isFiniteNumber(current.apparent_temperature) &&
    isFiniteNumber(current.precipitation) &&
    isFiniteNumber(current.weather_code) &&
    isFiniteNumber(current.wind_speed_10m) &&
    isFiniteNumber(current.is_day) &&
    isStringArray(hourly.time) &&
    isNumberArray(hourly.temperature_2m) &&
    isNumberArray(hourly.weather_code) &&
    isStringArray(daily.time) &&
    isNumberArray(daily.temperature_2m_max) &&
    isNumberArray(daily.temperature_2m_min) &&
    isNumberArray(daily.weather_code)
  );
};

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

const getWeather = async (lat: number, lon: number): Promise<WeatherResult> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,is_day&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7`
    );

    if (!response.ok) {
      return { error: `Failed to fetch weather data: ${response.statusText}` };
    }

    const result: unknown = await response.json();
    if (!isOpenMeteoResponse(result)) {
      return { error: "Weather service returned an invalid response" };
    }

    return {
      data: {
        chanceOfRain: result.current.precipitation,
        daily: {
          temperatureMax: result.daily.temperature_2m_max.map(Math.round),
          temperatureMin: result.daily.temperature_2m_min.map(Math.round),
          time: result.daily.time,
          weatherCode: result.daily.weather_code,
        },
        feelsLike: Math.round(result.current.apparent_temperature),
        hourly: {
          temperature: result.hourly.temperature_2m.map(Math.round),
          time: result.hourly.time,
          weatherCode: result.hourly.weather_code,
        },
        humidity: result.current.relative_humidity_2m,
        isDay: result.current.is_day === 1,
        temperature: Math.round(result.current.temperature_2m),
        weatherCode: result.current.weather_code,
        windSpeed: result.current.wind_speed_10m,
      },
    };
  } catch (fetchError) {
    return { error: getErrorMessage(fetchError) };
  }
};

const useWeather = (lat: number | null, lon: number | null) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    if (lat === null || lon === null) {
      return;
    }

    const fetchWeather = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      const result = await getWeather(lat, lon);
      if (!isActive) {
        return;
      }

      if ("data" in result) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error);
      }

      setIsLoading(false);
    };

    void fetchWeather();

    return () => {
      isActive = false;
    };
  }, [lat, lon]);

  return {
    data,
    error,
    isLoading: lat !== null && lon !== null && isLoading,
  };
};

export { useWeather };
