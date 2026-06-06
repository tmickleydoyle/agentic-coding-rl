import React, { useState } from "react";
import { getOffers, addOffer, toggleAvailable } from "../../lib/store";
import type { AidCategory } from "../../lib/types";

export function OffersPage() {
  const [, setTick] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AidCategory>("Food");
  const [offerer, setOfferer] = useState("");

  const offers = getOffers();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !offerer.trim()) return;
    addOffer(title.trim(), category, offerer.trim());
    setTitle(""); setOfferer(""); setCategory("Food");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="offers-page">
      <h2>Aid Offers</h2>
      <form data-testid="offer-form" onSubmit={handleSubmit}>
        <input data-testid="offer-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select data-testid="offer-category" value={category} onChange={(e) => setCategory(e.target.value as AidCategory)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Childcare">Childcare</option>
          <option value="Other">Other</option>
        </select>
        <input data-testid="offer-offerer" placeholder="Offerer" value={offerer} onChange={(e) => setOfferer(e.target.value)} />
        <button data-testid="offer-submit" type="submit">Add Offer</button>
      </form>
      {offers.map((o) => (
        <div key={o.id} data-testid={`offer-row-${o.id}`}>
          <span data-testid={`offer-title-${o.id}`}>{o.title}</span>
          <span data-testid={`offer-available-${o.id}`}>{o.available ? "Available" : "Unavailable"}</span>
          <button data-testid={`toggle-available-${o.id}`} onClick={() => { toggleAvailable(o.id); setTick((t) => t + 1); }}>
            Toggle Available
          </button>
        </div>
      ))}
    </div>
  );
}
