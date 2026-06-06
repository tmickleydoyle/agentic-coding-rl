import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function DistributionsPage() {
  const { distributions, addDistribution, deleteDistribution } = useApp();
  const [trustName, setTrustName] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleAdd = () => {
    const num = parseFloat(amount);
    if (!trustName || !beneficiary || !date || isNaN(num) || num <= 0) return;
    addDistribution({ trustName, beneficiary, amount: num, date });
    setTrustName(""); setBeneficiary(""); setAmount(""); setDate("");
  };

  return (
    <div data-testid="distributions-page">
      <h1>Distributions</h1>
      {distributions.length === 0 ? (
        <p data-testid="no-distributions">No distributions found.</p>
      ) : (
        <ul data-testid="distribution-list">
          {distributions.map((d) => (
            <li key={d.id} data-testid={`dist-item-${d.id}`}>
              <span data-testid={`dist-trust-${d.id}`}>{d.trustName}</span>
              <span data-testid={`dist-beneficiary-${d.id}`}>{d.beneficiary}</span>
              <span data-testid={`dist-amount-${d.id}`}>${d.amount.toLocaleString()}</span>
              <span data-testid={`dist-date-${d.id}`}>{d.date}</span>
              <button data-testid={`delete-dist-${d.id}`} onClick={() => deleteDistribution(d.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-dist-form">
        <input data-testid="dist-trust-input" value={trustName} onChange={(e) => setTrustName(e.target.value)} placeholder="Trust Name" />
        <input data-testid="dist-beneficiary-input" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder="Beneficiary" />
        <input data-testid="dist-amount-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input data-testid="dist-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button data-testid="add-dist-btn" onClick={handleAdd}>Add Distribution</button>
      </div>
    </div>
  );
}
