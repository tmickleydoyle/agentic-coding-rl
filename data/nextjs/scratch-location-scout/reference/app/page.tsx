import React, { useState } from "react";

interface Location {
  id: number;
  name: string;
  address: string;
  access: string;
  lighting: string;
  rating: number;
}

const SEED_LOCATIONS: Location[] = [
  { id: 1, name: "Rooftop Garden", address: "123 Main St, NYC", access: "Public", lighting: "Great at sunset", rating: 5 },
  { id: 2, name: "Old Railway Yard", address: "45 Industrial Ave, BK", access: "Permit", lighting: "Overcast only", rating: 3 },
  { id: 3, name: "Waterfront Pier", address: "Pier 17, Manhattan", access: "Public", lighting: "Morning golden", rating: 4 },
];

const ACCESS_TYPES = ["Public", "Permit", "Private"];

export default function App() {
  const [locations, setLocations] = useState<Location[]>(SEED_LOCATIONS);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [access, setAccess] = useState("Public");
  const [lighting, setLighting] = useState("");
  const [rating, setRating] = useState("");
  const [sortByRating, setSortByRating] = useState(false);
  const [nextId, setNextId] = useState(4);

  const avgRating = locations.length === 0
    ? "—"
    : (locations.reduce((sum, l) => sum + l.rating, 0) / locations.length).toFixed(1);

  const displayed = sortByRating
    ? [...locations].sort((a, b) => b.rating - a.rating)
    : locations;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;
    const r = parseInt(rating, 10);
    if (isNaN(r) || r < 1 || r > 5) return;
    const loc: Location = { id: nextId, name: name.trim(), address: address.trim(), access, lighting: lighting.trim(), rating: r };
    setLocations((prev) => [...prev, loc]);
    setNextId((n) => n + 1);
    setName("");
    setAddress("");
    setLighting("");
    setRating("");
    setAccess("Public");
  }

  function deleteLocation(id: number) {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div>
      <h1>Location Scout</h1>
      <p data-testid="location-count">{locations.length} locations</p>
      <p data-testid="avg-rating">Avg rating: {avgRating}</p>

      <form onSubmit={handleSubmit} data-testid="add-form">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} data-testid="input-name" />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} data-testid="input-address" />
        </div>
        <div>
          <label htmlFor="access">Access</label>
          <select id="access" value={access} onChange={(e) => setAccess(e.target.value)} data-testid="input-access">
            {ACCESS_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="lighting">Lighting Notes</label>
          <textarea id="lighting" value={lighting} onChange={(e) => setLighting(e.target.value)} data-testid="input-lighting" />
        </div>
        <div>
          <label htmlFor="rating">Rating (1-5)</label>
          <input id="rating" type="number" value={rating} onChange={(e) => setRating(e.target.value)} data-testid="input-rating" />
        </div>
        <button type="submit" data-testid="submit-btn">Add Location</button>
      </form>

      <button onClick={() => setSortByRating((v) => !v)} data-testid="sort-btn">
        {sortByRating ? "Sort by Default" : "Sort by Rating"}
      </button>

      <ul data-testid="location-list">
        {displayed.map((l) => (
          <li key={l.id} data-testid={`location-${l.id}`}>
            <span data-testid={`location-name-${l.id}`}>{l.name}</span>
            <span data-testid={`location-address-${l.id}`}>{l.address}</span>
            <span data-testid={`location-access-${l.id}`}>{l.access}</span>
            <span data-testid={`location-rating-${l.id}`}>{l.rating}</span>
            {l.lighting && <span data-testid={`location-lighting-${l.id}`}>{l.lighting}</span>}
            <button onClick={() => deleteLocation(l.id)} data-testid={`delete-${l.id}`}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
