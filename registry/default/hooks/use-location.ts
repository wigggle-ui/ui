import { useState, useEffect } from "react";

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

const DEFAULT_LOCATION: Coordinates = {
  lat: 19.076, // Mumbai
  lon: 72.8777,
};

const CACHE_KEY = "wigggle-location-data";
const CACHE_EXPIRY = 3600 * 1000;

interface CacheData {
  coordinates: Coordinates;
  city: string;
  timestamp: number;
}

export function useLocation(): LocationData {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkCacheAndFetch = async () => {
      // 1. Check LocalStorage Cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsedCache: CacheData = JSON.parse(cached);
          const now = Date.now();
          if (now - parsedCache.timestamp < CACHE_EXPIRY) {
            setCoordinates(parsedCache.coordinates);
            setCity(parsedCache.city);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to parse location cache", e);
          localStorage.removeItem(CACHE_KEY);
        }
      }

      // 2. Helper to save cache
      const saveToCache = (coords: Coordinates, cityName: string) => {
        const cacheData: CacheData = {
          coordinates: coords,
          city: cityName,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      };

      // 3. Try Browser Geolocation
      if (!navigator.geolocation) {
        fallbackToIP("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coords = { lat: latitude, lon: longitude };

          let cityName = "Unknown Location";
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            );
            const data = await response.json();
            cityName = data.city || data.locality || "Unknown Location";
          } catch (err) {
            console.error("Failed to fetch city name:", err);
          }

          setCoordinates(coords);
          setCity(cityName);
          saveToCache(coords, cityName);
          setIsLoading(false);
        },
        (err) => {
          console.warn(
            "Geolocation failed, attempting IP fallback:",
            err.message,
          );
          fallbackToIP(err.message);
        },
      );

      // 4. IP Fallback Strategy
      async function fallbackToIP(initialError: string) {
        try {
          const response = await fetch("https://ipwho.is/");
          const data = await response.json();

          if (data.success) {
            const coords = { lat: data.latitude, lon: data.longitude };
            const cityName = data.city || data.region || "Unknown Location";

            setCoordinates(coords);
            setCity(cityName);
            setError(null);
            saveToCache(coords, cityName);
          } else {
            throw new Error(data.message || "IP Geolocation failed");
          }
        } catch (ipErr) {
          console.error("IP Geolocation failed, defaulting to Mumbai:", ipErr);
          setError(initialError);
          setCoordinates(DEFAULT_LOCATION);
          setCity("Mumbai");
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkCacheAndFetch();
  }, []);

  return { coordinates, city, error, isLoading };
}
