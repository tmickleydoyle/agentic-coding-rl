import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { AssetType } from "../../lib/types";

export function AssetsPage() {
  const { assets, addAsset, deleteAsset } = useApp();
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetType>("Cash");
  const [value, setValue] = useState("");
  const [beneficiary, setBeneficiary] = useState("");

  const handleAdd = () => {
    const num = parseFloat(value);
    if (!name || !beneficiary || isNaN(num) || num <= 0) return;
    addAsset({ name, type, value: num, beneficiary });
    setName(""); setValue(""); setBeneficiary("");
  };

  return (
    <div data-testid="assets-page">
      <h1>Assets</h1>
      {assets.length === 0 ? (
        <p data-testid="no-assets">No assets found.</p>
      ) : (
        <ul data-testid="asset-list">
          {assets.map((a) => (
            <li key={a.id} data-testid={`asset-item-${a.id}`}>
              <span data-testid={`asset-name-${a.id}`}>{a.name}</span>
              <span data-testid={`asset-type-${a.id}`}>{a.type}</span>
              <span data-testid={`asset-value-${a.id}`}>${a.value.toLocaleString()}</span>
              <span data-testid={`asset-beneficiary-${a.id}`}>{a.beneficiary}</span>
              <button data-testid={`delete-asset-${a.id}`} onClick={() => deleteAsset(a.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-asset-form">
        <input data-testid="asset-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <select data-testid="asset-type-select" value={type} onChange={(e) => setType(e.target.value as AssetType)}>
          <option>Real Estate</option>
          <option>Investment</option>
          <option>Personal Property</option>
          <option>Cash</option>
        </select>
        <input data-testid="asset-value-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" type="number" />
        <input data-testid="asset-beneficiary-input" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder="Beneficiary" />
        <button data-testid="add-asset-btn" onClick={handleAdd}>Add Asset</button>
      </div>
    </div>
  );
}
