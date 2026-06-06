import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Asset, AssetCategory } from "../../lib/types";

const CATEGORIES: AssetCategory[] = ["cash", "investment", "real_estate", "retirement", "other"];

export function AssetsPage() {
  const { assets, addAsset, deleteAsset } = useApp();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState<AssetCategory>("other");

  function handleAdd() {
    const val = parseFloat(value);
    if (!name || isNaN(val) || val <= 0) return;
    addAsset({ id: `a-${Date.now()}`, name, value: val, category });
    setName(""); setValue(""); setCategory("other");
  }

  return (
    <div data-testid="assets-page">
      <h1>Assets</h1>
      <div data-testid="add-asset-form">
        <input data-testid="asset-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="asset-value" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" />
        <select data-testid="asset-category" value={category} onChange={(e) => setCategory(e.target.value as AssetCategory)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button data-testid="add-asset-btn" onClick={handleAdd}>Add Asset</button>
      </div>
      <ul data-testid="asset-list">
        {assets.map((a) => (
          <li key={a.id} data-testid={`asset-${a.id}`}>
            <span data-testid={`asset-name-${a.id}`}>{a.name}</span>
            <span data-testid={`asset-value-${a.id}`}>${a.value.toFixed(2)}</span>
            <span data-testid={`asset-cat-${a.id}`}>{a.category}</span>
            <button data-testid={`delete-asset-${a.id}`} onClick={() => deleteAsset(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
