import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { AssetCategory } from "../../lib/types";

export function RegisterPage() {
  const { assets, addAsset, deleteAsset } = useApp();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<AssetCategory>("Other");
  const [acquired, setAcquired] = useState("");

  const handleAdd = () => {
    if (!name) return;
    addAsset({ name, category, acquired });
    setName(""); setAcquired("");
  };

  return (
    <div data-testid="register-page">
      <h1>Asset Register</h1>
      {assets.length === 0 ? (
        <p data-testid="no-assets">No assets found.</p>
      ) : (
        <ul data-testid="asset-list">
          {assets.map((a) => (
            <li key={a.id} data-testid={`asset-item-${a.id}`}>
              <span data-testid={`asset-name-${a.id}`}>{a.name}</span>
              <span data-testid={`asset-category-${a.id}`}>{a.category}</span>
              <span data-testid={`asset-acquired-${a.id}`}>{a.acquired}</span>
              <button data-testid={`delete-asset-${a.id}`} onClick={() => deleteAsset(a.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-asset-form">
        <input data-testid="asset-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <select data-testid="asset-category-select" value={category} onChange={(e) => setCategory(e.target.value as AssetCategory)}>
          <option>Property</option>
          <option>Vehicle</option>
          <option>Financial</option>
          <option>Other</option>
        </select>
        <input data-testid="asset-acquired-input" type="date" value={acquired} onChange={(e) => setAcquired(e.target.value)} />
        <button data-testid="add-asset-btn" onClick={handleAdd}>Add Asset</button>
      </div>
    </div>
  );
}
