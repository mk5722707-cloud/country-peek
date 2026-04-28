import { useState } from "react";
import SearchBar from "../components/SearchBar";
import CountryCard from "../components/CountryCard";
import FilterBar from "../components/FilterBar";

function Home() {
  const [countries, setCountries] = useState([]);
  const [region, setRegion] = useState("All");
  const [sortBy, setSortBy] = useState("");

  const displayed = [...countries]
    .filter(
      (country) =>
        region === "All" || country.region === region
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.common.localeCompare(b.name.common);
      }

      if (sortBy === "population") {
        return b.population - a.population;
      }

      return 0;
    });

  return (
    <div>
      <SearchBar setCountries={setCountries} />

      <FilterBar
        region={region}
        onRegionChange={setRegion}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="cards-grid">
        {displayed.map((country) => (
          <CountryCard
            key={country.cca3}
            country={country}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;