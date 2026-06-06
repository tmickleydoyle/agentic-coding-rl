import { useState } from "react";

interface Beer {
  id: number;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  rating: number;
  notes: string;
}

const SEED_BEERS: Beer[] = [
  { id: 1, name: "Heady Topper", brewery: "The Alchemist", style: "IPA", abv: 8.0, rating: 5, notes: "Legendary Vermont double IPA" },
  { id: 2, name: "Pliny the Elder", brewery: "Russian River", style: "IPA", abv: 8.0, rating: 5, notes: "West coast hop bomb" },
  { id: 3, name: "Founders KBS", brewery: "Founders", style: "Stout", abv: 11.2, rating: 4, notes: "Bourbon barrel aged stout" },
  { id: 4, name: "Bell's Two Hearted", brewery: "Bell's", style: "IPA", abv: 7.0, rating: 4, notes: "Classic American IPA" },
  { id: 5, name: "Dogfish 90 Minute", brewery: "Dogfish Head", style: "IPA", abv: 9.0, rating: 3, notes: "Imperial IPA with continuous hopping" },
];

function renderStars(rating: number): string {
  const filled = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return filled + empty;
}

export default function App() {
  const [beers, setBeers] = useState<Beer[]>(SEED_BEERS);
  const [activeStyle, setActiveStyle] = useState<string>("All Styles");

  const [name, setName] = useState("");
  const [brewery, setBrewery] = useState("");
  const [style, setStyle] = useState("");
  const [abv, setAbv] = useState("");
  const [rating, setRating] = useState("3");
  const [notes, setNotes] = useState("");

  const styles: string[] = [];
  beers.forEach((b) => {
    if (!styles.includes(b.style)) styles.push(b.style);
  });

  const handleAdd = () => {
    if (!name.trim() || !brewery.trim()) return;
    const newBeer: Beer = {
      id: Date.now(),
      name: name.trim(),
      brewery: brewery.trim(),
      style: style.trim() || "Unknown",
      abv: parseFloat(abv) || 0,
      rating: parseInt(rating) || 3,
      notes: notes.trim(),
    };
    setBeers((prev) => [...prev, newBeer]);
    setName("");
    setBrewery("");
    setStyle("");
    setAbv("");
    setRating("3");
    setNotes("");
  };

  const visible =
    activeStyle === "All Styles"
      ? beers
      : beers.filter((b) => b.style === activeStyle);

  return (
    <div>
      <h1>Beer Tasting Log</h1>

      <div>
        <button
          data-testid="filter-all"
          aria-pressed={activeStyle === "All Styles"}
          onClick={() => setActiveStyle("All Styles")}
        >
          All Styles
        </button>
        {styles.map((s) => (
          <button
            key={s}
            data-testid="style-filter"
            aria-pressed={activeStyle === s}
            onClick={() => setActiveStyle(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div data-testid="beer-list">
        {visible.map((beer) => (
          <div key={beer.id} data-testid="beer-card">
            <span data-testid="beer-name">{beer.name}</span>
            <span data-testid="beer-brewery">{beer.brewery}</span>
            <span data-testid="beer-style">{beer.style}</span>
            <span data-testid="beer-abv">{beer.abv}%</span>
            <span data-testid="beer-rating">{renderStars(beer.rating)}</span>
            <span data-testid="beer-notes">{beer.notes}</span>
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
          Brewery
          <input
            data-testid="input-brewery"
            value={brewery}
            onChange={(e) => setBrewery(e.target.value)}
          />
        </label>
        <label>
          Style
          <input
            data-testid="input-style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          />
        </label>
        <label>
          ABV
          <input
            data-testid="input-abv"
            type="number"
            step="0.1"
            value={abv}
            onChange={(e) => setAbv(e.target.value)}
          />
        </label>
        <label>
          Rating
          <select
            data-testid="input-rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label>
          Notes
          <textarea
            data-testid="input-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <button type="submit" data-testid="submit-beer">
          Add Beer
        </button>
      </form>
    </div>
  );
}
