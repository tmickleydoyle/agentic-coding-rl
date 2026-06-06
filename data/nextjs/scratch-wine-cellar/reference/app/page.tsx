import { useState } from "react";

type WineType = "Red" | "White" | "Rosé";

interface Wine {
  id: number;
  name: string;
  winery: string;
  year: number;
  type: WineType;
  region: string;
  quantity: number;
}

const SEED_WINES: Wine[] = [
  { id: 1, name: "Cabernet Sauvignon", winery: "Jordan", year: 2018, type: "Red", region: "Napa Valley", quantity: 6 },
  { id: 2, name: "Chardonnay", winery: "Rombauer", year: 2020, type: "White", region: "Carneros", quantity: 3 },
  { id: 3, name: "Pinot Noir", winery: "Meiomi", year: 2019, type: "Red", region: "California", quantity: 12 },
  { id: 4, name: "Sauvignon Blanc", winery: "Cloudy Bay", year: 2021, type: "White", region: "Marlborough", quantity: 4 },
  { id: 5, name: "Rosé", winery: "Whispering Angel", year: 2022, type: "Rosé", region: "Provence", quantity: 2 },
];

type FilterType = "All" | WineType;
type SortDir = "asc" | "desc";

export default function App() {
  const [wines, setWines] = useState<Wine[]>(SEED_WINES);
  const [filter, setFilter] = useState<FilterType>("All");
  const [sortDir, setSortDir] = useState<SortDir | null>(null);

  const [name, setName] = useState("");
  const [winery, setWinery] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState<WineType>("Red");
  const [region, setRegion] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !winery.trim()) return;
    const newWine: Wine = {
      id: Date.now(),
      name: name.trim(),
      winery: winery.trim(),
      year: parseInt(year) || new Date().getFullYear(),
      type,
      region: region.trim(),
      quantity: parseInt(quantity) || 0,
    };
    setWines((prev) => [...prev, newWine]);
    setName("");
    setWinery("");
    setYear("");
    setType("Red");
    setRegion("");
    setQuantity("");
  };

  const handleSort = () => {
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  let visible = filter === "All" ? wines : wines.filter((w) => w.type === filter);
  if (sortDir !== null) {
    visible = [...visible].sort((a, b) =>
      sortDir === "asc" ? a.year - b.year : b.year - a.year
    );
  }

  const sortLabel =
    sortDir === "asc"
      ? "Sort by Year ↑"
      : sortDir === "desc"
      ? "Sort by Year ↓"
      : "Sort by Year";

  return (
    <div>
      <h1>Wine Cellar</h1>

      <div>
        <button
          data-testid="filter-all"
          aria-pressed={filter === "All"}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          data-testid="filter-red"
          aria-pressed={filter === "Red"}
          onClick={() => setFilter("Red")}
        >
          Red
        </button>
        <button
          data-testid="filter-white"
          aria-pressed={filter === "White"}
          onClick={() => setFilter("White")}
        >
          White
        </button>
        <button
          data-testid="filter-rose"
          aria-pressed={filter === "Rosé"}
          onClick={() => setFilter("Rosé")}
        >
          Rosé
        </button>
        <button data-testid="sort-year" onClick={handleSort}>
          {sortLabel}
        </button>
      </div>

      <div data-testid="wine-list">
        {visible.map((wine) => (
          <div key={wine.id} data-testid="wine-card">
            <span data-testid="wine-name">{wine.name}</span>
            <span data-testid="wine-winery">{wine.winery}</span>
            <span data-testid="wine-year">{wine.year}</span>
            <span data-testid="wine-type">{wine.type}</span>
            <span data-testid="wine-region">{wine.region}</span>
            <span data-testid="wine-quantity">{wine.quantity} bottles</span>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <label>
          Name
          <input
            data-testid="input-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Winery
          <input
            data-testid="input-winery"
            value={winery}
            onChange={(e) => setWinery(e.target.value)}
          />
        </label>
        <label>
          Year
          <input
            data-testid="input-year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>
        <label>
          Type
          <select
            data-testid="input-type"
            value={type}
            onChange={(e) => setType(e.target.value as WineType)}
          >
            <option value="Red">Red</option>
            <option value="White">White</option>
            <option value="Rosé">Rosé</option>
          </select>
        </label>
        <label>
          Region
          <input
            data-testid="input-region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </label>
        <label>
          Quantity
          <input
            data-testid="input-quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <button type="submit" data-testid="submit-wine">
          Add Wine
        </button>
      </form>
    </div>
  );
}
