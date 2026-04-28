import { useState, useEffect, useRef } from "react";

function useCountry(code) {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef({});

  useEffect(() => {
    if (!code) {
      setCountry(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (cache.current[code]) {
      setCountry(cache.current[code]);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setCountry(null);

    fetch(`https://restcountries.com/v3.1/alpha/${code}`, {
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
        cache.current[code] = data[0];
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