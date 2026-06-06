import React, { useState } from "react";

interface Spool {
  id: number;
  brand: string;
  material: string;
  color: string;
  weight_g: number;
  remaining_g: number;
  price_usd: number;
}

const SEED_SPOOLS: Spool[] = [
  { id: 1, brand: "Hatchbox", material: "PLA", color: "Black", weight_g: 1000, remaining_g: 800, price_usd: 22.99 },
  { id: 2, brand: "eSUN", material: "PETG", color: "Clear", weight_g: 1000, remaining_g: 450, price_usd: 24.99 },
  { id: 3, brand: "Prusament", material: "PLA", color: "Galaxy Silver", weight_g: 1000, remaining_g: 1000, price_usd: 29.99 },
  { id: 4, brand: "Hatchbox", material: "ABS", color: "White", weight_g: 1000, remaining_g: 200, price_usd: 21.99 },
];

let nextId = 5;

export default function App() {
  const [spools, setSpools] = useState<Spool[]>(SEED_SPOOLS);
  const [remainingInputs, setRemainingInputs] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    SEED_SPOOLS.forEach((s) => { init[s.id] = String(s.remaining_g); });
    return init;
  });

  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState("");
  const [remaining, setRemaining] = useState("");
  const [price, setPrice] = useState("");

  function addSpool() {
    const w = parseInt(weight, 10);
    const r = parseInt(remaining, 10);
    const p = parseFloat(price);
    if (!brand.trim() || !material.trim() || !color.trim()) return;
    if (isNaN(w) || w <= 0 || isNaN(r) || r < 0 || r > w || isNaN(p) || p <= 0) return;
    const newSpool: Spool = {
      id: nextId,
      brand: brand.trim(),
      material: material.trim(),
      color: color.trim(),
      weight_g: w,
      remaining_g: r,
      price_usd: p,
    };
    setSpools((prev) => [...prev, newSpool]);
    setRemainingInputs((prev) => ({ ...prev, [nextId]: String(r) }));
    nextId++;
    setBrand(""); setMaterial(""); setColor(""); setWeight(""); setRemaining(""); setPrice("");
  }

  function updateRemaining(id: number, weightG: number) {
    const val = parseInt(remainingInputs[id] ?? "0", 10);
    const clamped = isNaN(val) ? 0 : Math.min(weightG, Math.max(0, val));
    setSpools((prev) => prev.map((s) => s.id === id ? { ...s, remaining_g: clamped } : s));
    setRemainingInputs((prev) => ({ ...prev, [id]: String(clamped) }));
  }

  function removeSpool(id: number) {
    setSpools((prev) => prev.filter((s) => s.id !== id));
  }

  const distinctBrands = new Set(spools.map((s) => s.brand)).size;
  const hasLowStock = spools.some((s) => s.remaining_g < 200);

  return (
    <div>
      <h1>Filament Stock</h1>

      <div>
        <input aria-label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand" />
        <input aria-label="Material" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Material" />
        <input aria-label="Color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color" />
        <input aria-label="Weight (g)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (g)" />
        <input aria-label="Remaining (g)" type="number" value={remaining} onChange={(e) => setRemaining(e.target.value)} placeholder="Remaining (g)" />
        <input aria-label="Price (USD)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (USD)" />
        <button onClick={addSpool}>Add Spool</button>
      </div>

      <ul>
        {spools.map((spool) => {
          const pct = Math.round((spool.remaining_g / spool.weight_g) * 100);
          return (
            <li key={spool.id}>
              <span data-testid={`spool-brand-${spool.id}`}>{spool.brand}</span>
              <span data-testid={`spool-material-${spool.id}`}>{spool.material}</span>
              <span data-testid={`spool-color-${spool.id}`}>{spool.color}</span>
              <span data-testid={`spool-remaining-${spool.id}`}>{spool.remaining_g}</span>
              <span data-testid={`spool-percent-${spool.id}`}>{pct}%</span>
              <input
                data-testid={`spool-remaining-input-${spool.id}`}
                type="number"
                value={remainingInputs[spool.id] ?? spool.remaining_g}
                onChange={(e) =>
                  setRemainingInputs((prev) => ({ ...prev, [spool.id]: e.target.value }))
                }
              />
              <button
                data-testid={`spool-update-${spool.id}`}
                onClick={() => updateRemaining(spool.id, spool.weight_g)}
              >
                Update
              </button>
              <button
                data-testid={`spool-remove-${spool.id}`}
                onClick={() => removeSpool(spool.id)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <div data-testid="stock-summary">
        {spools.length} spools, {distinctBrands} brands
      </div>

      {hasLowStock && (
        <div data-testid="low-stock-warning">Low stock alert</div>
      )}
    </div>
  );
}
