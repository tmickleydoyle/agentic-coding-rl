"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { Priority } from "../../lib/types";

export default function ItemsPage() {
  const { items, setItems, categories } = useApp();
  const [filterCat, setFilterCat] = useState("all");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const filtered = filterCat === "all" ? items : items.filter((i) => i.category === filterCat);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price), url, category, priority }),
    });
    const item = await res.json();
    setItems((prev) => [...prev, item]);
    setName(""); setPrice(""); setUrl(""); setCategory(""); setPriority("medium");
  }

  async function handlePurchase(id: string, purchased: boolean) {
    const res = await fetch("/api/wishlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, purchased: !purchased }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  }

  async function handleRemove(id: string) {
    await fetch("/api/wishlist", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div data-testid="items-page">
      <h2>Wishlist Items</h2>
      <form data-testid="add-item-form" onSubmit={handleAdd}>
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" required />
        <input data-testid="input-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
        <input data-testid="input-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
        <input data-testid="input-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
        <select data-testid="select-priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button type="submit" data-testid="btn-add-item">Add Item</button>
      </form>
      <div data-testid="filter-controls">
        <button data-testid="filter-all" onClick={() => setFilterCat("all")}>All</button>
        {categories.map((c) => <button key={c.id} data-testid={`filter-${c.name.toLowerCase()}`} onClick={() => setFilterCat(c.name)}>{c.name}</button>)}
      </div>
      <ul data-testid="item-list">
        {filtered.map((i) => (
          <li key={i.id} data-testid={`item-${i.id}`}>
            <span data-testid={`item-name-${i.id}`}>{i.name}</span>
            <span data-testid={`item-price-${i.id}`}>${i.price}</span>
            <span data-testid={`item-purchased-${i.id}`}>{i.purchased ? "purchased" : "unpurchased"}</span>
            <button data-testid={`btn-toggle-${i.id}`} onClick={() => handlePurchase(i.id, i.purchased)}>{i.purchased ? "Unpurchase" : "Mark Purchased"}</button>
            <button data-testid={`btn-remove-${i.id}`} onClick={() => handleRemove(i.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
