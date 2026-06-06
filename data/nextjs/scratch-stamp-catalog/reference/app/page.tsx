import React, { useState } from "react";

interface Stamp {
  id: number;
  name: string;
  country: string;
  year: number;
  denomination: string;
  condition: string;
}

const CONDITIONS = ["Mint", "Fine", "Good", "Poor"];
const CONDITION_ORDER: Record<string, number> = { Poor: 0, Good: 1, Fine: 2, Mint: 3 };

const SEED_STAMPS: Stamp[] = [
  { id: 1, name: "Penny Black", country: "United Kingdom", year: 1840, denomination: "1d", condition: "Mint" },
  { id: 2, name: "Inverted Jenny", country: "United States", year: 1918, denomination: "24c", condition: "Fine" },
  { id: 3, name: "Blue Mauritius", country: "Mauritius", year: 1847, denomination: "2d", condition: "Poor" },
  { id: 4, name: "Basel Dove", country: "Switzerland", year: 1845, denomination: "2½r", condition: "Mint" },
  { id: 5, name: "Treskilling Yellow", country: "Sweden", year: 1855, denomination: "3s", condition: "Fine" },
];

function upgradeCondition(current: string): string {
  const order = ["Poor", "Good", "Fine", "Mint"];
  const idx = order.indexOf(current);
  if (idx < 0 || idx >= order.length - 1) return current;
  return order[idx + 1];
}

export default function App() {
  const [stamps, setStamps] = useState<Stamp[]>(SEED_STAMPS);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [denomination, setDenomination] = useState("");
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [formError, setFormError] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterCondition, setFilterCondition] = useState("All");

  const handleAdd = () => {
    if (!name.trim()) { setFormError("Name is required"); return; }
    if (!country.trim()) { setFormError("Country is required"); return; }
    const yearNum = Number(year);
    if (!year || yearNum < 1840 || yearNum > 2100) { setFormError("Year must be between 1840 and 2100"); return; }
    if (!denomination.trim()) { setFormError("Denomination is required"); return; }
    setFormError("");
    const newId = stamps.length > 0 ? Math.max(...stamps.map((s) => s.id)) + 1 : 1;
    setStamps([...stamps, { id: newId, name: name.trim(), country: country.trim(), year: yearNum, denomination: denomination.trim(), condition }]);
    setName(""); setCountry(""); setYear(""); setDenomination(""); setCondition(CONDITIONS[0]);
  };

  const handleUpgrade = (id: number) => {
    setStamps(stamps.map((s) => s.id === id ? { ...s, condition: upgradeCondition(s.condition) } : s));
  };

  const handleDelete = (id: number) => {
    setStamps(stamps.filter((s) => s.id !== id));
  };

  const filteredStamps = stamps.filter((s) => {
    if (filterCountry && !s.country.toLowerCase().includes(filterCountry.toLowerCase())) return false;
    if (filterCondition !== "All" && s.condition !== filterCondition) return false;
    return true;
  });

  const mintCount = stamps.filter((s) => s.condition === "Mint").length;

  return (
    <div>
      <h1 data-testid="heading">Stamp Catalog</h1>

      <div data-testid="add-form">
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Stamp name" />
        <input data-testid="input-country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
        <input data-testid="input-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
        <input data-testid="input-denomination" value={denomination} onChange={(e) => setDenomination(e.target.value)} placeholder="Denomination" />
        <select data-testid="select-condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button data-testid="btn-add" onClick={handleAdd}>Add Stamp</button>
        {formError && <span data-testid="form-error">{formError}</span>}
      </div>

      <div>
        <input
          data-testid="filter-country"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          placeholder="Filter by country"
        />
        <select data-testid="filter-condition" value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
          <option value="All">All</option>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div data-testid="stamp-list">
        {filteredStamps.map((stamp) => (
          <div key={stamp.id} data-testid={`stamp-${stamp.id}`}>
            <span data-testid={`stamp-name-${stamp.id}`}>{stamp.name}</span>
            <span>{stamp.country}</span>
            <span>{stamp.year}</span>
            <span>{stamp.denomination}</span>
            <span>{stamp.condition}</span>
            {stamp.condition !== "Mint" && (
              <button data-testid={`btn-upgrade-${stamp.id}`} onClick={() => handleUpgrade(stamp.id)}>
                Upgrade Condition
              </button>
            )}
            <button data-testid={`btn-delete-${stamp.id}`} onClick={() => handleDelete(stamp.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div data-testid="stats">
        <span>Total stamps: {stamps.length}</span>
        <span data-testid="count-mint">Mint: {mintCount}</span>
      </div>
    </div>
  );
}
