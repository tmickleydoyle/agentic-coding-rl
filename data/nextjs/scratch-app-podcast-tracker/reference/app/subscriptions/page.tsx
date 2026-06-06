"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function SubscriptionsPage() {
  const { podcasts, setPodcasts } = useApp();
  const [title, setTitle] = useState("");
  const [host, setHost] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/podcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, host, category, description }),
    });
    const podcast = await res.json();
    setPodcasts((prev) => [...prev, podcast]);
    setTitle(""); setHost(""); setCategory(""); setDescription("");
  }

  async function handleRemove(id: string) {
    await fetch("/api/podcasts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setPodcasts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div data-testid="subscriptions-page">
      <h2>Subscriptions</h2>
      <form data-testid="add-podcast-form" onSubmit={handleAdd}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input data-testid="input-host" value={host} onChange={(e) => setHost(e.target.value)} placeholder="Host" required />
        <input data-testid="input-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
        <input data-testid="input-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <button type="submit" data-testid="btn-add-podcast">Subscribe</button>
      </form>
      <ul data-testid="podcast-list">
        {podcasts.map((p) => (
          <li key={p.id} data-testid={`podcast-item-${p.id}`}>
            <span data-testid={`podcast-title-${p.id}`}>{p.title}</span>
            <span data-testid={`podcast-host-${p.id}`}>{p.host}</span>
            <button data-testid={`btn-remove-${p.id}`} onClick={() => handleRemove(p.id)}>Unsubscribe</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
