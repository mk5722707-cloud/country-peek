import { useState, useEffect, useRef } from "react";

function useCountry(code) {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef({});

  useEffect(() => {
    const normalizedCode = code?.toUpperCase();

    if (!normalizedCode) {
      setCountry(null);
      setLoading(false);
      setError(null);
      return;
    }

    const cached = cache.current[normalizedCode];
    if (cached) {
      setCountry(cached);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch(`https://restcountries.com/v3.1/alpha/${normalizedCode}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch country data");
        return res.json();
      })
      .then((data) => {
        if (!data || !data.length) {
          throw new Error("Country not found");
        }
        setCountry(data[0]);
        cache.current[normalizedCode] = data[0];
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [code]);

  return { country, loading, error };
}

export default useCountry;