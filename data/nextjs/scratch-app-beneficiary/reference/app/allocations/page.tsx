import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function AllocationsPage() {
  const { allocations, addAllocation, deleteAllocation } = useApp();
  const [beneficiary, setBeneficiary] = useState("");
  const [asset, setAsset] = useState("");
  const [percentage, setPercentage] = useState("");

  // check if any beneficiary total exceeds 100
  const totals: Record<string, number> = {};
  allocations.forEach((a) => {
    totals[a.beneficiary] = (totals[a.beneficiary] || 0) + a.percentage;
  });
  const hasOverAllocation = Object.values(totals).some((v) => v > 100);

  const handleAdd = () => {
    const num = parseFloat(percentage);
    if (!beneficiary || !asset || isNaN(num) || num < 0 || num > 100) return;
    addAllocation({ beneficiary, asset, percentage: num });
    setBeneficiary(""); setAsset(""); setPercentage("");
  };

  return (
    <div data-testid="allocations-page">
      <h1>Allocations</h1>
      {hasOverAllocation && <div data-testid="over-allocation-warning">Warning: some beneficiary exceeds 100%</div>}
      {allocations.length === 0 ? (
        <p data-testid="no-allocations">No allocations found.</p>
      ) : (
        <ul data-testid="allocation-list">
          {allocations.map((a) => (
            <li key={a.id} data-testid={`alloc-item-${a.id}`}>
              <span data-testid={`alloc-beneficiary-${a.id}`}>{a.beneficiary}</span>
              <span data-testid={`alloc-asset-${a.id}`}>{a.asset}</span>
              <span data-testid={`alloc-pct-${a.id}`}>{a.percentage}%</span>
              <button data-testid={`delete-alloc-${a.id}`} onClick={() => deleteAllocation(a.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-alloc-form">
        <input data-testid="alloc-beneficiary-input" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder="Beneficiary" />
        <input data-testid="alloc-asset-input" value={asset} onChange={(e) => setAsset(e.target.value)} placeholder="Asset" />
        <input data-testid="alloc-pct-input" type="number" value={percentage} onChange={(e) => setPercentage(e.target.value)} placeholder="%" />
        <button data-testid="add-alloc-btn" onClick={handleAdd}>Add Allocation</button>
      </div>
    </div>
  );
}
