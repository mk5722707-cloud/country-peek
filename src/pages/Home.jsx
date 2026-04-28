useEffect(() => {
  if (!query.trim()) {
    setCountries([]);
    setError(null);
    return;
  }

  const controller = new AbortController();

  const timer = setTimeout(() => {
    setLoading(true);

    fetch(`https://restcountries.com/v3.1/name/${query}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setCountries(data);
        setError(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setCountries([]);
        setError("No countries found.");
      })
      .finally(() => setLoading(false));
  }, 400);

  return () => {
    clearTimeout(timer);
    controller.abort(); // 🔑 cancel previous request
  };
}, [query]);