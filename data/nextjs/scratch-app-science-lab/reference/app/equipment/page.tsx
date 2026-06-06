import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addEquipment, updateEquipmentStatus } from "../../lib/store";
import type { EquipmentStatus } from "../../lib/types";

const STATUSES: EquipmentStatus[] = ["available", "in-use", "maintenance"];

export default function EquipmentPage() {
  const { equipment, setEquipment } = useApp();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!name.trim() || !category.trim() || !location.trim()) { setError("Name, category, location required"); return; }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) { setError("Quantity must be at least 1"); return; }
    const eq = addEquipment({ name: name.trim(), category: category.trim(), quantity: qty, status: "available", location: location.trim() });
    setEquipment([...equipment, eq]);
    setName(""); setCategory(""); setLocation(""); setError("");
  }

  function handleStatus(id: string, status: EquipmentStatus) {
    const updated = updateEquipmentStatus(id, status);
    if (updated) setEquipment(equipment.map(eq => eq.id === id ? updated : eq));
  }

  const available = equipment.filter(eq => eq.status === "available").length;

  return (
    <div data-testid="equipment-page">
      <h2>Lab Equipment</h2>
      <div data-testid="available-count">{available} items available</div>
      {error && <div data-testid="equipment-error">{error}</div>}
      <ul data-testid="equipment-list">
        {equipment.map(eq => (
          <li key={eq.id} data-testid={`equipment-item-${eq.id}`}>
            <span data-testid={`equipment-name-${eq.id}`}>{eq.name}</span>
            <span data-testid={`equipment-category-${eq.id}`}>{eq.category}</span>
            <span data-testid={`equipment-qty-${eq.id}`}>{eq.quantity}</span>
            <span data-testid={`equipment-status-${eq.id}`}>{eq.status}</span>
            <span data-testid={`equipment-location-${eq.id}`}>{eq.location}</span>
            <select data-testid={`select-eq-status-${eq.id}`} value={eq.status} onChange={e => handleStatus(eq.id, e.target.value as EquipmentStatus)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </li>
        ))}
      </ul>
      <div data-testid="add-equipment-form">
        <input data-testid="input-eq-name" value={name} onChange={e => setName(e.target.value)} placeholder="Equipment name" />
        <input data-testid="input-category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
        <input data-testid="input-quantity" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity" />
        <input data-testid="input-location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
        <button data-testid="btn-add-equipment" onClick={handleAdd}>Add Equipment</button>
      </div>
    </div>
  );
}
