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

export function useLocation(): LocationData {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setCoordinates(DEFAULT_LOCATION);
      setCity("Mumbai");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const data = await response.json();
          setCity(data.city || data.locality || "Unknown Location");
        } catch (err) {
          console.error("Failed to fetch city name:", err);
        } finally {
          setIsLoading(false);
        }
      },
      async (err) => {
        console.warn(
          "Geolocation denied or failed, attempting IP fallback:",
          err.message,
        );

        try {
          const response = await fetch("https://ipapi.co/json/");
          if (!response.ok) throw new Error("IP API failed");

          const data = await response.json();
          if (data.latitude && data.longitude) {
            setCoordinates({ lat: data.latitude, lon: data.longitude });
            setCity(data.city || data.region || "Unknown Location");
            setError(null);
          } else {
            throw new Error("Invalid IP data");
          }
        } catch (ipErr) {
          console.error(
            "IP Geoloc outcome failed, defaulting to Mumbai:",
            ipErr,
          );
          setError(err.message);
          setCoordinates(DEFAULT_LOCATION);
          setCity("Mumbai");
        } finally {
          setIsLoading(false);
        }
      },
    );
  }, []);

  return { coordinates, city, error, isLoading };
}
