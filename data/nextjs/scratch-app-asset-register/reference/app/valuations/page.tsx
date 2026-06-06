import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function ValuationsPage() {
  const { valuations, addValuation, deleteValuation } = useApp();
  const [assetName, setAssetName] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");

  const handleAdd = () => {
    const num = parseFloat(value);
    if (!assetName || !date || isNaN(num) || num <= 0) return;
    addValuation({ assetName, value: num, date });
    setAssetName(""); setValue(""); setDate("");
  };

  return (
    <div data-testid="valuations-page">
      <h1>Valuations</h1>
      {valuations.length === 0 ? (
        <p data-testid="no-valuations">No valuations found.</p>
      ) : (
        <ul data-testid="valuation-list">
          {valuations.map((v) => (
            <li key={v.id} data-testid={`val-item-${v.id}`}>
              <span data-testid={`val-asset-${v.id}`}>{v.assetName}</span>
              <span data-testid={`val-value-${v.id}`}>${v.value.toLocaleString()}</span>
              <span data-testid={`val-date-${v.id}`}>{v.date}</span>
              <button data-testid={`delete-val-${v.id}`} onClick={() => deleteValuation(v.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-val-form">
        <input data-testid="val-asset-input" value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="Asset Name" />
        <input data-testid="val-value-input" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" />
        <input data-testid="val-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button data-testid="add-val-btn" onClick={handleAdd}>Add Valuation</button>
      </div>
    </div>
  );
}
