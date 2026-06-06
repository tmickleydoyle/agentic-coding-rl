import React, { useState } from "react";

interface Coin {
  id: number;
  name: string;
  country: string;
  era: string;
  year: number;
  estimatedValue: number;
  graded: boolean;
}

const ERAS = ["Ancient", "Medieval", "Colonial", "Modern"];

const SEED_COINS: Coin[] = [
  { id: 1, name: "Morgan Dollar", country: "United States", era: "Modern", year: 1889, estimatedValue: 85, graded: true },
  { id: 2, name: "Roman Denarius", country: "Rome", era: "Ancient", year: 100, estimatedValue: 420, graded: false },
  { id: 3, name: "Gold Sovereign", country: "United Kingdom", era: "Colonial", year: 1890, estimatedValue: 350, graded: true },
  { id: 4, name: "Spanish Doubloon", country: "Spain", era: "Colonial", year: 1700, estimatedValue: 1200, graded: false },
  { id: 5, name: "Lincoln Penny", country: "United States", era: "Modern", year: 1943, estimatedValue: 45, graded: false },
];

export default function App() {
  const [coins, setCoins] = useState<Coin[]>(SEED_COINS);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [era, setEra] = useState(ERAS[0]);
  const [year, setYear] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [formError, setFormError] = useState("");
  const [filterEra, setFilterEra] = useState("All");
  const [filterGraded, setFilterGraded] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) { setFormError("Name is required"); return; }
    if (!country.trim()) { setFormError("Country is required"); return; }
    const evNum = Number(estimatedValue);
    if (estimatedValue === "" || evNum < 0) { setFormError("Estimated value must be 0 or greater"); return; }
    setFormError("");
    const newId = coins.length > 0 ? Math.max(...coins.map((c) => c.id)) + 1 : 1;
    setCoins([...coins, {
      id: newId,
      name: name.trim(),
      country: country.trim(),
      era,
      year: Number(year) || 0,
      estimatedValue: evNum,
      graded: false,
    }]);
    setName(""); setCountry(""); setEra(ERAS[0]); setYear(""); setEstimatedValue("");
  };

  const handleToggleGrade = (id: number) => {
    setCoins(coins.map((c) => c.id === id ? { ...c, graded: !c.graded } : c));
  };

  const handleRemove = (id: number) => {
    setCoins(coins.filter((c) => c.id !== id));
  };

  const filteredCoins = coins.filter((c) => {
    if (filterEra !== "All" && c.era !== filterEra) return false;
    if (filterGraded && !c.graded) return false;
    return true;
  });

  const totalValue = coins.reduce((sum, c) => sum + c.estimatedValue, 0);

  return (
    <div>
      <h1 data-testid="heading">Coin Collection</h1>

      <div data-testid="add-form">
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Coin name" />
        <input data-testid="input-country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
        <select data-testid="select-era" value={era} onChange={(e) => setEra(e.target.value)}>
          {ERAS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <input data-testid="input-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
        <input data-testid="input-estimated-value" type="number" value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)} placeholder="Estimated value" />
        <button data-testid="btn-add" onClick={handleAdd}>Add Coin</button>
        {formError && <span data-testid="form-error">{formError}</span>}
      </div>

      <div>
        <select data-testid="filter-era" value={filterEra} onChange={(e) => setFilterEra(e.target.value)}>
          <option value="All">All</option>
          {ERAS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <label>
          <input
            data-testid="filter-graded"
            type="checkbox"
            checked={filterGraded}
            onChange={(e) => setFilterGraded(e.target.checked)}
          />
          Graded only
        </label>
      </div>

      <div data-testid="coin-list">
        {filteredCoins.map((coin) => (
          <div key={coin.id} data-testid={`coin-${coin.id}`}>
            <span data-testid={`coin-name-${coin.id}`}>{coin.name}</span>
            <span>{coin.country}</span>
            <span>{coin.era}</span>
            <span>{coin.year}</span>
            <span data-testid={`coin-value-${coin.id}`}>${coin.estimatedValue.toFixed(2)}</span>
            {coin.graded && <span data-testid={`coin-graded-${coin.id}`}>GRADED</span>}
            <button data-testid={`btn-grade-${coin.id}`} onClick={() => handleToggleGrade(coin.id)}>
              Toggle Grade
            </button>
            <button data-testid={`btn-remove-${coin.id}`} onClick={() => handleRemove(coin.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div data-testid="summary">
        <span>Total coins: {coins.length}</span>
        <span data-testid="total-value">${totalValue.toFixed(2)}</span>
      </div>
    </div>
  );
}
