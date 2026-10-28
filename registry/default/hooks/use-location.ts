"use client";

import { useEffect, useState } from "react";

interface Coordinates {
  lat: number;
  lon: number;
}

interface LocationData {
  coordinates: Coordinates | null;
  city: string | null;
  error: string | null;
  isLoading: boolean;
}

interface Location {
  coordinates: Coordinates;
  city: string;
}

interface CacheData extends Location {
  timestamp: number;
}

type IpLocationResult = { location: Location } | { error: string };

export const DEFAULT_LOCATION: Coordinates = {
  // Mumbai
  lat: 19.076,
  lon: 72.8777,
};

const CACHE_KEY = "wigggle-location-data";
const CACHE_EXPIRY = 3600 * 1000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isCoordinates = (value: unknown): value is Coordinates =>
  isRecord(value) &&
  typeof value.lat === "number" &&
  Number.isFinite(value.lat) &&
  typeof value.lon === "number" &&
  Number.isFinite(value.lon);

const isCacheData = (value: unknown): value is CacheData =>
  isRecord(value) &&
  isCoordinates(value.coordinates) &&
  typeof value.city === "string" &&
  typeof value.timestamp === "number" &&
  Number.isFinite(value.timestamp);

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unexpected error occurred";

const getCachedLocation = (): CacheData | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);

    if (!cached) {
      return null;
    }

    const parsed: unknown = JSON.parse(cached);

    if (!isCacheData(parsed)) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    const cacheAge = Date.now() - parsed.timestamp;
    if (cacheAge < 0 || cacheAge >= CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed;
  } catch (cacheError) {
    console.error("Failed to read location cache:", cacheError);
    return null;
  }
};

const saveLocationToCache = (location: Location): void => {
  try {
    const cacheData: CacheData = {
      ...location,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (cacheError) {
    console.error("Failed to save location cache:", cacheError);
  }
};

const getCityName = async ({ lat, lon }: Coordinates): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );

    if (!response.ok) {
      console.error("Failed to fetch city name:", response.statusText);
      return "Unknown Location";
    }

    const data: unknown = await response.json();
    if (!isRecord(data)) {
      return "Unknown Location";
    }

    if (typeof data.city === "string" && data.city.length > 0) {
      return data.city;
    }

    if (typeof data.locality === "string" && data.locality.length > 0) {
      return data.locality;
    }
  } catch (cityError) {
    console.error("Failed to fetch city name:", cityError);
  }

  return "Unknown Location";
};

const getIpLocation = async (): Promise<IpLocationResult> => {
  try {
    const response = await fetch("https://ipwho.is/");

    if (!response.ok) {
      return { error: `IP geolocation request failed: ${response.statusText}` };
    }

    const data: unknown = await response.json();
    if (!isRecord(data) || typeof data.success !== "boolean") {
      return { error: "IP Geolocation returned an invalid response" };
    }

    if (!data.success) {
      return {
        error:
          typeof data.message === "string"
            ? data.message
            : "IP Geolocation failed",
      };
    }

    const { city: cityName, latitude, longitude, region } = data;

    if (
      typeof latitude !== "number" ||
      !Number.isFinite(latitude) ||
      typeof longitude !== "number" ||
      !Number.isFinite(longitude)
    ) {
      return { error: "IP Geolocation returned invalid coordinates" };
    }

    let city = "Unknown Location";
    if (typeof cityName === "string" && cityName.length > 0) {
      city = cityName;
    } else if (typeof region === "string" && region.length > 0) {
      city = region;
    }

    return {
      location: {
        city,
        coordinates: { lat: latitude, lon: longitude },
      },
    };
  } catch (ipError) {
    return { error: getErrorMessage(ipError) };
  }
};

const useLocation = (): LocationData => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const setLocation = (
      location: Location,
      locationError: string | null = null
    ): void => {
      if (!isActive) {
        return;
      }

      setCoordinates(location.coordinates);
      setCity(location.city);
      setError(locationError);
      setIsLoading(false);
    };

    const fetchIpLocation = async (initialError: string): Promise<void> => {
      const ipResult = await getIpLocation();
      if (!isActive) {
        return;
      }

      if ("location" in ipResult) {
        saveLocationToCache(ipResult.location);
        setLocation(ipResult.location);
        return;
      }

      console.error(
        "IP Geolocation failed, defaulting to Mumbai:",
        ipResult.error
      );
      setLocation(
        { city: "Mumbai", coordinates: DEFAULT_LOCATION },
        initialError
      );
    };

    const fetchBrowserLocation = async (
      position: GeolocationPosition
    ): Promise<void> => {
      const locationCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      const location: Location = {
        city: await getCityName(locationCoordinates),
        coordinates: locationCoordinates,
      };

      if (!isActive) {
        return;
      }

      saveLocationToCache(location);
      setLocation(location);
    };

    const handlePosition = (position: GeolocationPosition): void => {
      void fetchBrowserLocation(position);
    };

    const handlePositionError = (
      geolocationError: GeolocationPositionError
    ) => {
      const initialError = getErrorMessage(geolocationError);
      console.warn("Geolocation failed, attempting IP fallback:", initialError);
      void fetchIpLocation(initialError);
    };

    const resolveLocation = (): void => {
      const cachedLocation = getCachedLocation();
      if (cachedLocation) {
        setLocation(cachedLocation);
        return;
      }

      if (!navigator.geolocation) {
        void fetchIpLocation("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        handlePosition,
        handlePositionError
      );
    };

    resolveLocation();

    return () => {
      isActive = false;
    };
  }, []);

  return { city, coordinates, error, isLoading };
};

export { useLocation };
