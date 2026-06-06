import React, { useState } from "react";

interface Animal {
  id: number;
  name: string;
  species: string;
  tank: string;
  quantity: number;
  type: string;
}

const TANKS = ["Reef Tank", "Freshwater", "Quarantine", "Planted"];
const TYPES = ["Fish", "Invertebrate"];

const SEED_ANIMALS: Animal[] = [
  { id: 1, name: "Nemo", species: "Amphiprioninae", tank: "Reef Tank", quantity: 2, type: "Fish" },
  { id: 2, name: "Dory", species: "Paracanthurus hepatus", tank: "Reef Tank", quantity: 1, type: "Fish" },
  { id: 3, name: "Turbo Snail", species: "Turbo fluctuosa", tank: "Reef Tank", quantity: 5, type: "Invertebrate" },
  { id: 4, name: "Neon Tetra", species: "Paracheirodon innesi", tank: "Freshwater", quantity: 10, type: "Fish" },
  { id: 5, name: "Cherry Shrimp", species: "Neocaridina davidi", tank: "Freshwater", quantity: 15, type: "Invertebrate" },
];

export default function App() {
  const [animals, setAnimals] = useState<Animal[]>(SEED_ANIMALS);
  const [name, setName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [tank, setTank] = useState<string>(TANKS[0]);
  const [quantity, setQuantity] = useState<string>("");
  const [type, setType] = useState<string>(TYPES[0]);
  const [search, setSearch] = useState<string>("");
  const [tankFilter, setTankFilter] = useState<string>("All");
  const [nextId, setNextId] = useState<number>(6);

  const visible = animals.filter((a) => {
    const matchesTank = tankFilter === "All" || a.tank === tankFilter;
    const q = search.toLowerCase();
    const matchesSearch = search === ""
      || a.name.toLowerCase().includes(q)
      || a.species.toLowerCase().includes(q);
    return matchesTank && matchesSearch;
  });

  const totalQuantity = visible.reduce((sum, a) => sum + a.quantity, 0);

  function handleAdd() {
    if (name.trim() === "" || species.trim() === "") return;
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) return;
    const newAnimal: Animal = {
      id: nextId,
      name: name.trim(),
      species: species.trim(),
      tank,
      quantity: qty,
      type,
    };
    setAnimals([...animals, newAnimal]);
    setNextId(nextId + 1);
    setName("");
    setSpecies("");
    setQuantity("");
  }

  function handleDelete(id: number) {
    setAnimals(animals.filter((a) => a.id !== id));
  }

  return (
    <div>
      <h1>Livestock Catalog</h1>

      <section>
        <div>
          <label htmlFor="name-input">Common Name</label>
          <input
            id="name-input"
            type="text"
            data-testid="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="species-input">Species</label>
          <input
            id="species-input"
            type="text"
            data-testid="species-input"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="tank-select">Tank</label>
          <select
            id="tank-select"
            data-testid="tank-select"
            value={tank}
            onChange={(e) => setTank(e.target.value)}
          >
            {TANKS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity-input">Quantity</label>
          <input
            id="quantity-input"
            type="number"
            min="1"
            data-testid="quantity-input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="type-select">Type</label>
          <select
            id="type-select"
            data-testid="type-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {TYPES.map((tp) => (
              <option key={tp} value={tp}>{tp}</option>
            ))}
          </select>
        </div>
        <button data-testid="add-button" onClick={handleAdd}>
          Add Animal
        </button>
      </section>

      <section>
        <input
          type="text"
          placeholder="Search by name or species"
          data-testid="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="tank-filter">Filter by Tank</label>
        <select
          id="tank-filter"
          data-testid="tank-filter"
          value={tankFilter}
          onChange={(e) => setTankFilter(e.target.value)}
        >
          <option value="All">All</option>
          {TANKS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </section>

      <div>
        <span data-testid="total-animals">{visible.length}</span>
        <span data-testid="total-quantity">{totalQuantity}</span>
      </div>

      <ul data-testid="catalog-list">
        {visible.map((a) => (
          <li key={a.id} data-testid={`animal-${a.id}`}>
            <span data-testid={`animal-name-${a.id}`}>{a.name}</span>
            <span data-testid={`animal-species-${a.id}`}>{a.species}</span>
            <span data-testid={`animal-tank-${a.id}`}>{a.tank}</span>
            <span data-testid={`animal-quantity-${a.id}`}>{a.quantity}</span>
            <span data-testid={`animal-type-${a.id}`}>{a.type}</span>
            <button
              data-testid={`delete-${a.id}`}
              onClick={() => handleDelete(a.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
